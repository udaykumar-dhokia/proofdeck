package services

import (
	"github.com/google/uuid"
	"github.com/udaykumar-dhokia/proofdeck/internal/database"
	"github.com/udaykumar-dhokia/proofdeck/internal/models"
)

func CreateProduct(product *models.Product) error {
	return database.DB.Create(product).Error
}

func FetchAllProducts(companyId uuid.UUID) []models.Product {
	var products []models.Product
	database.DB.Find(&products).Where("company_id = ?", companyId)
	return products
}
