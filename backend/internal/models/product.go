package models

import (
	"time"

	"github.com/google/uuid"
)

type Product struct {
	ID        uuid.UUID `gorm:"type:uuid;default:gen_random_uuid();primaryKey" json:"id"`
	Name      string    `json:"name"`
	Desc      string    `json:"desc"`
	Website   string    `json:"website"`
	CompanyId uuid.UUID `gorm:"type:uuid;not null" json:"company_id"`
	Company   Company   `gorm:"foreignKey:CompanyId;references:ID;constraint:OnUpdate:CASCADE,OnDelete:CASCADE" json:"-"`

	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
}
