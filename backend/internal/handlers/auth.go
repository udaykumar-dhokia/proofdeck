package handlers

import (
	"encoding/json"
	"net/http"
	"time"

	"github.com/google/uuid"
	"github.com/udaykumar-dhokia/proofdeck/internal/middlewares"
	"github.com/udaykumar-dhokia/proofdeck/internal/models"
	"github.com/udaykumar-dhokia/proofdeck/internal/services"
	"golang.org/x/crypto/bcrypt"
)

type LoginResponse struct {
	Message string `json:"message"`
	Error   string `json:"error"`
}

type LoginRequest struct {
	Email    string `json:"email"`
	Password string `json:"password"`
}

type RegisterResponse struct {
	Message string `json:"message"`
	Error   string `json:"error"`
}

func LoginHandler(w http.ResponseWriter, r *http.Request) {

	var req *LoginRequest

	// Parse body
	dec := json.NewDecoder(r.Body)
	dec.DisallowUnknownFields()
	if err := dec.Decode(&req); err != nil {
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(LoginResponse{
			Message: "Invalid request",
			Error:   err.Error(),
		})
		return
	}

	// Check for the required fields
	if req.Email == "" || req.Password == "" {
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(LoginResponse{
			Message: "Invalid request",
			Error:   "Missing required fields",
		})
		return
	}

	// Search for the company
	fetchedCompany, err := services.FetchCompanyByEmail(req.Email)
	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(LoginResponse{
			Message: "Check your credentials",
			Error:   err.Error(),
		})
		return
	}

	// Match passwords by comparing hash
	err = bcrypt.CompareHashAndPassword([]byte(fetchedCompany.Password), []byte(req.Password))
	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(LoginResponse{
			Message: "Check your credentials",
			Error:   err.Error(),
		})
		return
	}

	// Generate JWT token
	token, err := services.GenerateJWT(fetchedCompany.ID)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(LoginResponse{
			Message: "Error while register",
			Error:   err.Error(),
		})
		return
	}

	// Attaching a cookie
	cookie := services.NewCookie("token", token)
	http.SetCookie(w, &cookie)

	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(LoginResponse{
		Message: "Welcome back!!!",
		Error:   "",
	})
}

func RegisterHandler(w http.ResponseWriter, r *http.Request) {
	var company models.Company

	company.ID = uuid.New()

	// Parse body
	dec := json.NewDecoder(r.Body)
	dec.DisallowUnknownFields()
	if err := dec.Decode(&company); err != nil {
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(RegisterResponse{
			Message: "Invalid request",
			Error:   err.Error(),
		})
		return
	}

	// Check for the required fields
	if company.Email == "" || company.Name == "" || company.Password == "" {
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(RegisterResponse{
			Message: "Invalid request",
			Error:   "Missing required fields",
		})
		return
	}

	// Hashing company's password
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(company.Password), bcrypt.DefaultCost)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(RegisterResponse{
			Message: "Error while register",
			Error:   err.Error(),
		})
		return
	}

	company.Password = string(hashedPassword)

	// Inserting the company's data to database
	if err := services.CreateCompany(&company); err != nil {
		w.WriteHeader(http.StatusConflict)
		json.NewEncoder(w).Encode(RegisterResponse{
			Message: "company already exists",
			Error:   err.Error(),
		})
		return
	}

	// Generate JWT token
	token, err := services.GenerateJWT(company.ID)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(RegisterResponse{
			Message: "Error while register",
			Error:   err.Error(),
		})
		return
	}

	// Attaching a cookie
	cookie := services.NewCookie("token", token)
	http.SetCookie(w, &cookie)

	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(RegisterResponse{
		Message: "Registered successfully",
		Error:   "",
	})
}

func LogoutHandler(w http.ResponseWriter, r *http.Request) {
	_, ok := r.Context().Value(middlewares.CompanyIDKey).(uuid.UUID)
	if !ok {
		w.WriteHeader(http.StatusUnauthorized)
		json.NewEncoder(w).Encode(ProductResponse{
			Message: "Unauthorized",
			Error:   "id missing",
		})
		return
	}

	cookie := &http.Cookie{
		Name:     "token",
		Value:    "",
		Path:     "/",
		MaxAge:   -1,
		Expires:  time.Now().Add(-1 * time.Hour),
		HttpOnly: true,
		Secure:   true,
		SameSite: http.SameSiteLaxMode,
	}

	http.SetCookie(w, cookie)
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(CompanyResponse{
		Message: "Logout successfully",
	})
}
