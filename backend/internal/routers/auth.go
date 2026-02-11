package routers

import (
	"net/http"

	"github.com/go-chi/chi/v5"
	"github.com/udaykumar-dhokia/proofdeck/internal/handlers"
)

func AuthRouter() *chi.Mux {
	r := chi.NewRouter()

	r.Post("/register", handlers.Register)

	r.Post("/login", func(w http.ResponseWriter, r *http.Request) {
		w.Write([]byte("Hello World"))
	})

	return r
}
