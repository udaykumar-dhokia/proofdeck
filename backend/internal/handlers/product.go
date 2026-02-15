package handlers

import (
	"encoding/json"
	"net/http"
	"time"

	"github.com/go-chi/chi/v5"
	"github.com/google/uuid"
	"github.com/udaykumar-dhokia/proofdeck/internal/middlewares"
	"github.com/udaykumar-dhokia/proofdeck/internal/models"
	"github.com/udaykumar-dhokia/proofdeck/internal/services"
)

type ProductResponse struct {
	Message string          `json:"message,omitempty"`
	Error   string          `json:"error,omitempty"`
	Product *models.Product `json:"product,omitempty"`
}

type UpdateProductRequest struct {
	Name      *string    `json:"name"`
	Desc      *string    `json:"desc"`
	Website   *string    `json:"website"`
	UpdatedAt *time.Time `json:"updated_at"`
}

func UpdateProductPartial(id string, req UpdateProductRequest) error {
	updates := make(map[string]interface{})

	if req.Name != nil {
		updates["name"] = *req.Name
	}
	if req.Desc != nil {
		updates["desc"] = *req.Desc
	}
	if req.Website != nil {
		updates["website"] = *req.Website
	}

	if len(updates) == 0 {
		return nil
	}

	updates["updated_at"] = time.Now()

	return services.UpdateProductByID(id, updates)
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
		Product: &product,
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

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	if err := json.NewEncoder(w).Encode(products); err != nil {
		return
	}
}

// Delete Product By ID
func DeleteProductByIDHandler(w http.ResponseWriter, r *http.Request) {
	_, ok := r.Context().Value(middlewares.CompanyIDKey).(uuid.UUID)
	if !ok {
		w.WriteHeader(http.StatusUnauthorized)
		json.NewEncoder(w).Encode(ProductResponse{
			Message: "Unauthorized",
			Error:   "id missing",
		})
		return
	}

	id := chi.URLParam(r, "id")
	if id == "" {
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(TestimonialResponse{
			Message: "Bad Request",
			Error:   "Missing required fields",
		})
		return
	}

	if err := services.DeleteProductByID(id); err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(ProductResponse{
			Message: "Internal Server Error",
			Error:   err.Error(),
		})
		return
	}

	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(TestimonialResponse{
		Message: "Deleted successfully",
		Error:   "",
	})
}

func UpdateProductByIDHandler(w http.ResponseWriter, r *http.Request) {

	_, ok := r.Context().Value(middlewares.CompanyIDKey).(uuid.UUID)
	if !ok {
		w.WriteHeader(http.StatusUnauthorized)
		json.NewEncoder(w).Encode(ProductResponse{
			Message: "Unauthorized",
			Error:   "id missing",
		})
		return
	}

	id := chi.URLParam(r, "id")
	if id == "" {
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(ProductResponse{
			Message: "Missing product id",
		})
		return
	}

	var req UpdateProductRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(ProductResponse{
			Message: "Invalid request body",
			Error:   err.Error(),
		})
		return
	}

	// Check product exists
	if _, err := services.FetchProductByID(id); err != nil {
		w.WriteHeader(http.StatusNotFound)
		json.NewEncoder(w).Encode(ProductResponse{
			Message: "Product not found",
		})
		return
	}

	// Perform partial update
	if err := UpdateProductPartial(id, req); err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(ProductResponse{
			Message: "Update failed",
			Error:   err.Error(),
		})
		return
	}

	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(ProductResponse{
		Message: "Updated successfully",
	})
}
