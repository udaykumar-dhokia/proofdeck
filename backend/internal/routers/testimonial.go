package routers

import (
	"github.com/go-chi/chi/v5"
	"github.com/udaykumar-dhokia/proofdeck/internal/handlers"
	"github.com/udaykumar-dhokia/proofdeck/internal/middlewares"
)

func TestimonialRouter() *chi.Mux {
	r := chi.NewRouter()
	r.Use(middlewares.AuthMiddleware)

	r.Post("/", handlers.InsertTestimonialHandler)
	r.Get("/p/{product_id}", handlers.FetchAllTestimonialByProductIDHandler)
	r.Get("/{id}", handlers.FetchTestimonialByIDHandler)
	r.Delete("/{id}", handlers.DeleteTestimonialByIDHandler)

	return r
}
