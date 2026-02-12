package routers

import (
	"github.com/go-chi/chi/v5"
	"github.com/udaykumar-dhokia/proofdeck/internal/handlers"
	"github.com/udaykumar-dhokia/proofdeck/internal/middlewares"
)

func ProductRouter() *chi.Mux {
	r := chi.NewRouter()
	r.Use(middlewares.AuthMiddleware)

	r.Post("/", handlers.InsertProductHandler)
	r.Get("/", handlers.FetchAllProductHandler)

	return r
}
