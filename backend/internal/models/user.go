package models

import (
	"time"

	"github.com/google/uuid"
)

type User struct {
	ID        uuid.UUID `gorm:"type:uuid;primaryKey"`
	Name      string
	Email     string `gorm:"uniqueIndex"`
	Password  string
	CreatedAt time.Time
}
