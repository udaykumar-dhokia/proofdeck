package routers

import (
	"github.com/go-chi/chi/v5"
	"github.com/udaykumar-dhokia/proofdeck/internal/handlers"
	"github.com/udaykumar-dhokia/proofdeck/internal/middlewares"
)

func CompanyRouter() *chi.Mux {
	r := chi.NewRouter()
	r.Use(middlewares.AuthMiddleware)

	r.Get("/", handlers.FetchCompanyByIdHandler)

	return r
}
