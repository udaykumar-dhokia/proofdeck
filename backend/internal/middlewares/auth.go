package middlewares

import (
	"context"
	"net/http"

	"github.com/udaykumar-dhokia/proofdeck/internal/services"
)

type contextKey string

const CompanyIDKey contextKey = "companyId"

func AuthMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {

		// Get the cookie
		cookie, err := r.Cookie("token")
		if err != nil {
			http.Error(w, "unauthorized", http.StatusUnauthorized)
			return
		}

		// Parse and validate
		claims, err := services.VerifyJWT(cookie.Value)
		if err != nil {
			http.Error(w, "unauthorized", http.StatusUnauthorized)
			return
		}

		// Inject the id into the context
		ctx := context.WithValue(r.Context(), CompanyIDKey, claims.ID)
		next.ServeHTTP(w, r.WithContext(ctx))
	})
}
