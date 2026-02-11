package services

import (
	"github.com/udaykumar-dhokia/proofdeck/internal/database"
	"github.com/udaykumar-dhokia/proofdeck/internal/models"
)

func CreateCompany(user *models.Company) error {
	return database.DB.Create(user).Error
}
