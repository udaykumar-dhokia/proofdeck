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

func FetchAllTestimonialsByCompanyID(companyID string) ([]models.Testimonial, error) {
	var testimonials []models.Testimonial
	err := database.DB.Joins("JOIN products ON products.id = testimonials.product_id").
		Where("products.company_id = ?", companyID).
		Find(&testimonials).Error
	return testimonials, err
}

func FetchTestimonialByID(id string) (models.Testimonial, error) {
	var testimonial models.Testimonial

	result := database.DB.Where("id = ?", id).First(&testimonial)

	if result.Error != nil {
		return models.Testimonial{}, result.Error
	}

	return testimonial, nil
}

func FetchTestimonialByUniqueID(uniqueID string) (models.Testimonial, error) {
	var testimonial models.Testimonial
	result := database.DB.Where("unique_id = ?", uniqueID).First(&testimonial)
	if result.Error != nil {
		return models.Testimonial{}, result.Error
	}
	return testimonial, nil
}

func DeleteTestimonialByID(id string) error {
	result := database.DB.Delete(&models.Testimonial{}, "id = ?", id)
	return result.Error
}

func UpdateTestimonialByID(id string, updateData map[string]interface{}) error {
	return database.DB.Model(&models.Testimonial{}).Where("id = ?", id).Updates(updateData).Error
}

func ToggleTestimonialState(id string) error {
	return database.DB.Exec("UPDATE testimonials SET is_active = NOT is_active WHERE id = ?", id).Error
}