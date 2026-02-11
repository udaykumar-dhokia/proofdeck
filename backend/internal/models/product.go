package models

import (
	"time"

	"github.com/google/uuid"
)

type Product struct {
	ID        uuid.UUID `gorm:"type:uuid;default:gen_random_uuid();primaryKey"`
	Name      string
	Desc      string
	Logo      string
	CompanyId uuid.UUID `gorm:"type:uuid;not null"`
	Company   Company   `gorm:"foreignKey:CompanyId;references:ID;constraint:OnUpdate:CASCADE,OnDelete:CASCADE"`
	CreatedAt time.Time
}
