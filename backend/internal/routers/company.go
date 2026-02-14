package routers

import (
	"github.com/go-chi/chi/v5"
	"github.com/udaykumar-dhokia/proofdeck/internal/handlers"
	"github.com/udaykumar-dhokia/proofdeck/internal/middlewares"
)

func CompanyRouter() *chi.Mux {
	r := chi.NewRouter()
	r.Group(func(r chi.Router) {
		r.Use(middlewares.AuthMiddleware)
		r.Get("/", handlers.FetchCompanyByIdHandler)
		r.Get("/stats", handlers.FetchCompanyStatsHandler)
	})
	return r
}
