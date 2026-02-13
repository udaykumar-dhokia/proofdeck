package main

import (
	"encoding/json"
	"log"
	"net/http"

	"github.com/go-chi/chi/v5"
	"github.com/go-chi/cors"
	"github.com/udaykumar-dhokia/proofdeck/internal/config"
	"github.com/udaykumar-dhokia/proofdeck/internal/database"
	"github.com/udaykumar-dhokia/proofdeck/internal/middlewares"
	"github.com/udaykumar-dhokia/proofdeck/internal/routers"
)

func main() {

	cfg := config.NewEnv()

	r := chi.NewRouter()

	r.Use(cors.Handler(cors.Options{
		AllowedOrigins:   []string{"*"},
		AllowedMethods:   []string{"GET", "POST", "PUT", "DELETE"},
		AllowedHeaders:   []string{"Accept", "Authorization", "Content-Type"},
		AllowCredentials: true,
	}))

	r.Use(middlewares.JsonContentTypeMiddleware)

	r.Get("/", func(w http.ResponseWriter, r *http.Request) {
		data := struct {
			Message string `json:"message"`
		}{
			Message: "Server is healthy.",
		}
		json.NewEncoder(w).Encode(data)
	})

	r.Mount("/api/v1/auth", routers.AuthRouter())
	r.Mount("/api/v1/product", routers.ProductRouter())
	r.Mount("/api/v1/testimonial", routers.TestimonialRouter())
	r.Mount("/api/v1/company", routers.CompanyRouter())

	log.Println("Server running on :8080")
	database.Connect()
	http.ListenAndServe(cfg.PORT, r)
}
