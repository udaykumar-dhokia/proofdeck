package handlers

import (
	"encoding/json"
	"net/http"

	"github.com/google/uuid"
	"github.com/udaykumar-dhokia/proofdeck/internal/middlewares"
	"github.com/udaykumar-dhokia/proofdeck/internal/models"
	"github.com/udaykumar-dhokia/proofdeck/internal/services"
)

type CompanyResponse struct {
	Message string          `json:"message,omitempty"`
	Error   string          `json:"error,omitempty"`
	Company *models.Company `json:"company,omitempty"`
}

func FetchCompanyByIdHandler(w http.ResponseWriter, r *http.Request) {

	companyID, ok := r.Context().Value(middlewares.CompanyIDKey).(uuid.UUID)
	if !ok {
		w.WriteHeader(http.StatusUnauthorized)
		json.NewEncoder(w).Encode(ProductResponse{
			Message: "Unauthorized",
			Error:   "user id missing",
		})
		return
	}

	company, err := services.FetchCompanyByID(companyID)
	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(CompanyResponse{
			Message: "Something went wrong",
			Error:   err.Error(),
		})
	}

	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(CompanyResponse{
		Message: "",
		Company: &company,
	})
}
