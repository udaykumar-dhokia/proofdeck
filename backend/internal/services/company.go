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

type ProductStat struct {
	ProductName string `json:"product_name"`
	Count       int64  `json:"count"`
}

type CompanyStats struct {
	TotalProducts          int64         `json:"total_products"`
	TotalTestimonials      int64         `json:"total_testimonials"`
	TestimonialsPerProduct []ProductStat `json:"testimonials_per_product"`
}

func GetCompanyStats(companyID uuid.UUID) (CompanyStats, error) {
	var stats CompanyStats

	if err := database.DB.Model(&models.Product{}).Where("company_id = ?", companyID).Count(&stats.TotalProducts).Error; err != nil {
		return stats, err
	}

	if err := database.DB.Model(&models.Testimonial{}).
		Joins("JOIN products ON products.id = testimonials.product_id").
		Where("products.company_id = ?", companyID).
		Count(&stats.TotalTestimonials).Error; err != nil {
		return stats, err
	}

	if err := database.DB.Model(&models.Testimonial{}).
		Select("products.name as product_name, count(testimonials.id) as count").
		Joins("JOIN products ON products.id = testimonials.product_id").
		Where("products.company_id = ?", companyID).
		Group("products.name").
		Scan(&stats.TestimonialsPerProduct).Error; err != nil {
		return stats, err
	}

	return stats, nil
}
