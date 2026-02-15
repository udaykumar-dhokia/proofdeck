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

type ResponseResponse struct {
	Message  string          `json:"message,omitempty"`
	Error    string          `json:"error,omitempty"`
	Response models.Response `json:"response,omitempty"`
}

func SubmitResponseHandler(w http.ResponseWriter, r *http.Request) {
	var response models.Response
	if err := json.NewDecoder(r.Body).Decode(&response); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	testimonialID := chi.URLParam(r, "id")
	if testimonialID == "" {
		http.Error(w, "Testimonial ID is required", http.StatusBadRequest)
		return
	}

	response.ID = uuid.New()
	response.TestimonialId = uuid.Must(uuid.Parse(testimonialID))

	if err := services.CreateResponse(response); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(ResponseResponse{
		Message:  "Response submitted successfully",
		Response: response,
	})
}

func FetchResponsesByTestimonialID(w http.ResponseWriter, r *http.Request) {

	_, ok := r.Context().Value(middlewares.CompanyIDKey).(uuid.UUID)
	if !ok {
		w.WriteHeader(http.StatusUnauthorized)
		json.NewEncoder(w).Encode(TestimonialResponse{
			Message: "Unauthorized",
			Error:   "id missing",
		})
		return
	}

	testimonialID := chi.URLParam(r, "id")
	if testimonialID == "" {
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(TestimonialResponse{
			Message: "Bad Request",
			Error:   "testimonial id missing",
		})
		return
	}

	responses, err := services.GetResponsesByTestimonialID(uuid.Must(uuid.Parse(testimonialID)))
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(TestimonialResponse{
			Message: "Internal Server Error",
			Error:   err.Error(),
		})
		return
	}

	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(responses)
}