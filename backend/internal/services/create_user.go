package services

import (
	"github.com/udaykumar-dhokia/proofdeck/internal/database"
	"github.com/udaykumar-dhokia/proofdeck/internal/models"
)

func CreateUser(user *models.User) error {
	return database.DB.Create(user).Error
}
