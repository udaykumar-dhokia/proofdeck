package models

import (
	"time"

	"github.com/google/uuid"
)

type Testimonial struct {
	ID        uuid.UUID `gorm:"primaryKey;type:uuid;uniqueIndex" json:"id"`
	Title     string    `json:"title"`
	Desc      string    `json:"desc"`
	ProductId uuid.UUID `gorm:"type:uuid;not null" json:"product_id"`
	Product   Product   `gorm:"foreignKey:ProductId;references:ID;constraint:OnUpdate:CASCADE,OnDelete:CASCADE" json:"-"`
	UniqueId  string    `gorm:"uniqueIndex" json:"unique_id"`

	IsNameRequired    bool `json:"is_name_required" gorm:"default:false"`
	IsRoleRequired    bool `json:"is_role_required" gorm:"default:false"`
	IsCompanyRequired bool `json:"is_company_required" gorm:"default:false"`
	IsActive          bool `json:"is_active" gorm:"default:true"`

	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
}
