package routers

import (
	"github.com/go-chi/chi/v5"
	"github.com/udaykumar-dhokia/proofdeck/internal/handlers"
	"github.com/udaykumar-dhokia/proofdeck/internal/middlewares"
)

func TestimonialRouter() *chi.Mux {
	r := chi.NewRouter()

	r.Get("/public/{unique_id}", handlers.FetchTestimonialByUniqueIDHandler)

	r.Group(func(r chi.Router) {
		r.Use(middlewares.AuthMiddleware)
		r.Post("/", handlers.InsertTestimonialHandler)
		r.Get("/", handlers.FetchAllTestimonialsHandler)
		r.Get("/p/{product_id}", handlers.FetchAllTestimonialByProductIDHandler)
		r.Get("/{id}", handlers.FetchTestimonialByIDHandler)
		r.Delete("/{id}", handlers.DeleteTestimonialByIDHandler)
		r.Put("/{id}", handlers.UpdateTestimonialByIDHandler)
		r.Put("/{id}/toggle-status", handlers.ToggleTestimonialStateHandler)
	})

	return r
}
