package main

import (
	"log"
	"net/http"

	"github.com/go-chi/chi/v5"
	"github.com/go-chi/cors"
	"github.com/udaykumar-dhokia/proofdeck/internal/config"
	"github.com/udaykumar-dhokia/proofdeck/internal/database"
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

	log.Println("Server running on :8080")
	database.Connect()
	http.ListenAndServe(cfg.PORT, r)
}
