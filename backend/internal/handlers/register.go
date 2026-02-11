package handlers

import (
	"encoding/json"
	"net/http"

	"github.com/google/uuid"
	"github.com/udaykumar-dhokia/proofdeck/internal/models"
	"github.com/udaykumar-dhokia/proofdeck/internal/services"
	"golang.org/x/crypto/bcrypt"
)

type RegisterResponse struct {
	Message string `json:"message"`
	Error   string `json:"error"`
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
	token, err := services.GenerateJWT(company.ID.String())
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
