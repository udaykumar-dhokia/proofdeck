package models

import (
	"time"

	"github.com/google/uuid"
)

type Company struct {
	ID        uuid.UUID `gorm:"type:uuid;primaryKey"`
	Name      string
	Email     string `gorm:"uniqueIndex"`
	Password  string
	Website   string
	CreatedAt time.Time
}
