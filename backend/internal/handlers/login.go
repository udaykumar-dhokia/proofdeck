package handlers

import (
	"encoding/json"
	"net/http"

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
	token, err := services.GenerateJWT(fetchedCompany.ID.String())
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

	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(LoginResponse{
		Message: "Welcome back!!!",
		Error:   "",
	})
}
