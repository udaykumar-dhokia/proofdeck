package models

import (
	"time"

	"github.com/google/uuid"
)

type Company struct {
	ID       uuid.UUID `gorm:"type:uuid;primaryKey" json:"id"`
	Name     string    `json:"name"`
	Email    string    `gorm:"uniqueIndex" json:"email"`
	Password string    `json:"password"`
	Website  string    `json:"website"`

	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
}
