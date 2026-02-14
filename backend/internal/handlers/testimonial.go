package handlers

import (
	"encoding/json"
	"net/http"

	"github.com/go-chi/chi/v5"
	"github.com/google/uuid"
	"github.com/udaykumar-dhokia/proofdeck/internal/middlewares"
	"github.com/udaykumar-dhokia/proofdeck/internal/models"
	"github.com/udaykumar-dhokia/proofdeck/internal/services"
)

type TestimonialResponse struct {
	Message     string             `json:"message"`
	Error       string             `json:"error"`
	Testimonial *models.Testimonial `json:"testimonial,omitempty"`
}

func InsertTestimonialHandler(w http.ResponseWriter, r *http.Request) {

	var testimonial models.Testimonial

	_, ok := r.Context().Value(middlewares.CompanyIDKey).(uuid.UUID)
	if !ok {
		w.WriteHeader(http.StatusUnauthorized)
		json.NewEncoder(w).Encode(TestimonialResponse{
			Message: "Unauthorized",
			Error:   "user id missing",
		})
		return
	}

	dec := json.NewDecoder(r.Body)
	if err := dec.Decode(&testimonial); err != nil {
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(TestimonialResponse{
			Message: "Invalid request",
			Error:   err.Error(),
		})
		return
	}

	testimonial.ID = uuid.New()

	if err := services.CreateTestimonial(&testimonial); err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(TestimonialResponse{
			Message: "Internal Server Error",
			Error:   err.Error(),
		})
		return
	}

	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(TestimonialResponse{
		Message:     "Testimonial created successfully",
		Error:       "",
		Testimonial: &testimonial,
	})
}

func FetchAllTestimonialByProductIDHandler(w http.ResponseWriter, r *http.Request) {
	var testimonial []models.Testimonial

	_, ok := r.Context().Value(middlewares.CompanyIDKey).(uuid.UUID)
	if !ok {
		w.WriteHeader(http.StatusUnauthorized)
		json.NewEncoder(w).Encode(TestimonialResponse{
			Message: "Unauthorized",
			Error:   "user id missing",
		})
		return
	}

	product_id := chi.URLParam(r, "product_id")
	if product_id == "" {
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(TestimonialResponse{
			Message: "Bad Request",
			Error:   "Missing required fields",
		})
		return
	}

	testimonial = services.FetchAllTestimonialByProductID(product_id)
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(testimonial)
}

func FetchTestimonialByIDHandler(w http.ResponseWriter, r *http.Request) {

	_, ok := r.Context().Value(middlewares.CompanyIDKey).(uuid.UUID)
	if !ok {
		w.WriteHeader(http.StatusUnauthorized)
		json.NewEncoder(w).Encode(TestimonialResponse{
			Message: "Unauthorized",
			Error:   "user id missing",
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

	testimonial, err := services.FetchTestimonialByID(id)
	if err != nil {
		w.WriteHeader(http.StatusNotFound)
		json.NewEncoder(w).Encode(TestimonialResponse{
			Message: "No such record found",
			Error:   err.Error(),
		})
		return
	}

	w.WriteHeader(http.StatusFound)
	json.NewEncoder(w).Encode(testimonial)
}

func DeleteTestimonialByIDHandler(w http.ResponseWriter, r *http.Request) {
	_, ok := r.Context().Value(middlewares.CompanyIDKey).(uuid.UUID)
	if !ok {
		w.WriteHeader(http.StatusUnauthorized)
		json.NewEncoder(w).Encode(TestimonialResponse{
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

	if err := services.DeleteTestimonialByID(id); err != nil {
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
