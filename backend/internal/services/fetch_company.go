package services

import (
	"github.com/udaykumar-dhokia/proofdeck/internal/database"
	"github.com/udaykumar-dhokia/proofdeck/internal/models"
)

func FetchCompanyByEmail(email string) (models.Company, error) {
	var company models.Company

	result := database.DB.Where("email = ?", email).First(&company)

	if result.Error != nil {
		return models.Company{}, result.Error
	}

	return company, nil
}
