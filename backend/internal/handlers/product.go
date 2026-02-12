package handlers

import (
	"encoding/json"
	"net/http"

	"github.com/google/uuid"
	"github.com/udaykumar-dhokia/proofdeck/internal/middlewares"
	"github.com/udaykumar-dhokia/proofdeck/internal/models"
	"github.com/udaykumar-dhokia/proofdeck/internal/services"
)

type ProductResponse struct {
	Message string `json:"message"`
	Error   string `json:"error"`
}

// Insert Handler
func InsertProductHandler(w http.ResponseWriter, r *http.Request) {

	companyID, ok := r.Context().Value(middlewares.CompanyIDKey).(uuid.UUID)
	if !ok {
		w.WriteHeader(http.StatusUnauthorized)
		json.NewEncoder(w).Encode(ProductResponse{
			Message: "Unauthorized",
			Error:   "user id missing",
		})
		return
	}

	var product models.Product

	dec := json.NewDecoder(r.Body)
	if err := dec.Decode(&product); err != nil {
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(ProductResponse{
			Message: "Invalid request",
			Error:   err.Error(),
		})
		return
	}

	product.CompanyId = uuid.UUID(companyID)

	if err := services.CreateProduct(&product); err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(ProductResponse{
			Message: "Internal Server Error",
			Error:   err.Error(),
		})
		return
	}

	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(ProductResponse{
		Message: "Product created successfully",
		Error:   "",
	})
}

// Fetch All Products Handler
func FetchAllProductHandler(w http.ResponseWriter, r *http.Request) {

	companyId, ok := r.Context().Value(middlewares.CompanyIDKey).(uuid.UUID)
	if !ok {
		w.WriteHeader(http.StatusUnauthorized)
		json.NewEncoder(w).Encode(ProductResponse{
			Message: "Unauthorized",
			Error:   "id missing",
		})
		return
	}

	products := services.FetchAllProducts(companyId)

	err := json.NewEncoder(w).Encode(products)
	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(ProductResponse{
			Message: "Failed to fetch products",
			Error:   err.Error(),
		})
		return
	}

	w.WriteHeader(http.StatusOK)
}
