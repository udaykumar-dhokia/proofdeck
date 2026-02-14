package services

import (
	"github.com/udaykumar-dhokia/proofdeck/internal/database"
	"github.com/udaykumar-dhokia/proofdeck/internal/models"
)

func CreateTestimonial(testimonial *models.Testimonial) error {
	return database.DB.Create(&testimonial).Error
}

func FetchAllTestimonialByProductID(product_id string) []models.Testimonial {
	var testimonials []models.Testimonial
	database.DB.Where("product_id = ?", product_id).Find(&testimonials)
	return testimonials
}

func FetchTestimonialByID(id string) (models.Testimonial, error) {
	var testimonial models.Testimonial

	result := database.DB.Where("id = ?", id).First(&testimonial)

	if result.Error != nil {
		return models.Testimonial{}, result.Error
	}

	return testimonial, nil
}

func DeleteTestimonialByID(id string) error {
	result := database.DB.Delete(&models.Testimonial{}, "id = ?", id)
	return result.Error
}
