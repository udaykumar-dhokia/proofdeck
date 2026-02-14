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
	database.DB.Where("company_id = ?", companyId).Find(&products)
	return products
}

func FetchProductByID(id string) (models.Product, error) {
	var product models.Product

	result := database.DB.First(&product, "id = ?", id)
	return product, result.Error
}

func DeleteProductByID(id string) error {
	result := database.DB.Delete(&models.Product{}, "id = ?", id)
	return result.Error
}

func UpdateProductByID(id string, updatedData map[string]interface{}) error {
	return database.DB.Model(&models.Product{}).
		Where("id = ?", id).
		Updates(updatedData).Error
}
