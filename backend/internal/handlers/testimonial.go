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
	"github.com/udaykumar-dhokia/proofdeck/internal/utils"
)


func FetchTestimonialByUniqueIDHandler(w http.ResponseWriter, r *http.Request) {
	uniqueID := chi.URLParam(r, "unique_id")
	if uniqueID == "" {
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(TestimonialResponse{
			Message: "Bad Request",
			Error:   "Missing unique_id",
		})
		return
	}

	testimonial, err := services.FetchTestimonialByUniqueID(uniqueID)
	if err != nil {
		w.WriteHeader(http.StatusNotFound)
		json.NewEncoder(w).Encode(TestimonialResponse{
			Message: "No such record found",
			Error:   err.Error(),
		})
		return
	}

	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(testimonial)
}

func FetchAllTestimonialsHandler(w http.ResponseWriter, r *http.Request) {
	companyID, ok := r.Context().Value(middlewares.CompanyIDKey).(uuid.UUID)
	if !ok {
		w.WriteHeader(http.StatusUnauthorized)
		json.NewEncoder(w).Encode(TestimonialResponse{
			Message: "Unauthorized",
			Error:   "user id missing",
		})
		return
	}

	testimonials, err := services.FetchAllTestimonialsByCompanyID(companyID.String())
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(TestimonialResponse{
			Message: "Internal Server Error",
			Error:   err.Error(),
		})
		return
	}

	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(testimonials)
}

type TestimonialResponse struct {
	Message     string              `json:"message"`
	Error       string              `json:"error"`
	Testimonial *models.Testimonial `json:"testimonial,omitempty"`
}

type UpdateTestimonialRequest struct {
	Title             *string `json:"title"`
	Desc              *string `json:"desc"`
	IsNameRequired    *bool   `json:"is_name_required"`
	IsRoleRequired    *bool   `json:"is_role_required"`
	IsCompanyRequired *bool   `json:"is_company_required"`
}

func UpdateTestimonialPartial(id string, req UpdateTestimonialRequest) error {
	updates := make(map[string]interface{})

	if req.Title != nil {
		updates["title"] = *req.Title
	}
	if req.Desc != nil {
		updates["desc"] = *req.Desc
	}
	if req.IsRoleRequired != nil {
		updates["is_role_required"] = *req.IsRoleRequired
	}
	if req.IsCompanyRequired != nil {
		updates["is_company_required"] = *req.IsCompanyRequired
	}
	if req.IsNameRequired != nil {
		updates["is_name_required"] = *req.IsNameRequired
	}
	if len(updates) == 0 {
		return nil
	}

	updates["updated_at"] = time.Now()

	return services.UpdateTestimonialByID(id, updates)
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
	testimonial.UniqueId = utils.GenerateUniqueId()

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

func UpdateTestimonialByIDHandler(w http.ResponseWriter, r *http.Request) {

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
			Message: "Missing product id",
		})
		return
	}

	var req UpdateTestimonialRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(TestimonialResponse{
			Message: "Invalid request body",
			Error:   err.Error(),
		})
		return
	}

	if _, err := services.FetchTestimonialByID(id); err != nil {
		w.WriteHeader(http.StatusNotFound)
		json.NewEncoder(w).Encode(TestimonialResponse{
			Message: "Testimonial not found",
		})
	}

	if err := UpdateTestimonialPartial(id, req); err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(TestimonialResponse{
			Message: "Update failed",
			Error:   err.Error(),
		})
		return
	}

	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(TestimonialResponse{
		Message: "Updated successfully",
	})
}

func ToggleTestimonialStateHandler(w http.ResponseWriter, r *http.Request){
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
			Message: "Missing product id",
		})
		return
	}

	if _, err := services.FetchTestimonialByID(id); err != nil {
		w.WriteHeader(http.StatusNotFound)
		json.NewEncoder(w).Encode(TestimonialResponse{
			Message: "Testimonial not found",
		})
	}

	if err := services.ToggleTestimonialState(id); err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(TestimonialResponse{
			Message: "Update failed",
			Error:   err.Error(),
		})
		return
	}

	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(TestimonialResponse{
		Message: "Updated successfully",
	})

}