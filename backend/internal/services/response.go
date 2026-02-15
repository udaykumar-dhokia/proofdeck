package services

import (
	"github.com/google/uuid"
	"github.com/udaykumar-dhokia/proofdeck/internal/database"
	"github.com/udaykumar-dhokia/proofdeck/internal/models"
)

func CreateResponse(reponse models.Response) error {
	return database.DB.Create(&reponse).Error
}

func GetResponsesByTestimonialID(testimonialID uuid.UUID) ([]models.Response, error) {
	var responses []models.Response
	if err := database.DB.Where("testimonial_id = ?", testimonialID).Find(&responses).Error; err != nil {
		return nil, err
	}
	return responses, nil
}