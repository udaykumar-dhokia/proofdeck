package routers

import (
	"github.com/go-chi/chi/v5"
	"github.com/udaykumar-dhokia/proofdeck/internal/handlers"
	"github.com/udaykumar-dhokia/proofdeck/internal/middlewares"
)

func AuthRouter() *chi.Mux {
	r := chi.NewRouter()

	r.Post("/register", handlers.RegisterHandler)
	r.Post("/login", handlers.LoginHandler)

	r.Group(func(r chi.Router) {
		r.Use(middlewares.AuthMiddleware)
		r.Get("/logout", handlers.LogoutHandler)
	})

	return r
}
