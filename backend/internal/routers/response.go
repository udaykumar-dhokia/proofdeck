package routers

import (
	"github.com/go-chi/chi/v5"
	"github.com/udaykumar-dhokia/proofdeck/internal/handlers"
	"github.com/udaykumar-dhokia/proofdeck/internal/middlewares"
)

func ResponseRouter() *chi.Mux {
	r := chi.NewRouter()

	r.Post("/{id}", handlers.SubmitResponseHandler)

	r.Group(func(r chi.Router) {
		r.Use(middlewares.AuthMiddleware)
		r.Get("/{id}", handlers.FetchResponsesByTestimonialID)
	})

	return r
}