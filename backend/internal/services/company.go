package services

import (
	"github.com/google/uuid"
	"github.com/udaykumar-dhokia/proofdeck/internal/database"
	"github.com/udaykumar-dhokia/proofdeck/internal/models"
)

func CreateCompany(user *models.Company) error {
	return database.DB.Create(user).Error
}

func FetchCompanyByEmail(email string) (models.Company, error) {
	var company models.Company

	result := database.DB.Where("email = ?", email).First(&company)

	if result.Error != nil {
		return models.Company{}, result.Error
	}

	return company, nil
}

func FetchCompanyByID(id uuid.UUID) (models.Company, error) {
	var company models.Company

	result := database.DB.Where("id = ?", id).First(&company)

	if result.Error != nil {
		return models.Company{}, result.Error
	}

	return company, nil
}
