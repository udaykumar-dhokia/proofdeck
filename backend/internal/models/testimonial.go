package models

import (
	"time"

	"github.com/google/uuid"
)

type Testimonial struct {
	ID        uuid.UUID `gorm:"primaryKey;type:uuid" json:"id"`
	Title     string    `json:"title"`
	Desc      string    `json:"desc"`
	ProductId uuid.UUID `gorm:"type:uuid;not null" json:"product_id"`
	Product   Product   `gorm:"foreignKey:ProductId;references:ID;constraint:OnUpdate:CASCADE,OnDelete:CASCADE" json:"-"`

	Name     string `json:"name,omitempty"`
	Email    string `json:"email" gorm:"not null"`
	Role     string `json:"role,omitempty"`
	Company  string `json:"company,omitempty"`
	Feedback string `json:"feedback"`
	Rating   int    `json:"rating" gorm:"check:rating >= 1 AND rating <=5"`

	IsNameRequired    bool `json:"is_name_required" gorm:"default:false"`
	IsRoleRequired    bool `json:"is_role_required" gorm:"default:false"`
	IsCompanyRequired bool `json:"is_company_required" gorm:"default:false"`

	CreatedAt time.Time `json:"createdAt"`
	UpdatedAt time.Time `json:"updatedAt"`
}
