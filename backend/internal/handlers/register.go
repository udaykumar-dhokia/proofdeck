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

func Register(w http.ResponseWriter, r *http.Request) {
	var user models.User

	user.ID = uuid.New()

	// Parse body
	if err := json.NewDecoder(r.Body).Decode(&user); err != nil {
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(RegisterResponse{
			Message: "Invalid request",
			Error:   err.Error(),
		})
		return
	}

	// Check for the required fields
	if user.Email == "" || user.Name == "" || user.Password == "" {
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(RegisterResponse{
			Message: "Invalid request",
			Error:   "Missing required fields",
		})
		return
	}

	// Hashing user's password
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(user.Password), bcrypt.DefaultCost)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(RegisterResponse{
			Message: "Error while register",
			Error:   err.Error(),
		})
		return
	}

	user.Password = string(hashedPassword)

	// Inserting the user's data to database
	if err := services.CreateUser(&user); err != nil {
		w.WriteHeader(http.StatusConflict)
		json.NewEncoder(w).Encode(RegisterResponse{
			Message: "User already exists",
			Error:   err.Error(),
		})
		return
	}

	// Generate JWT token
	token, err := services.GenerateJWT(user.ID.String())
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
