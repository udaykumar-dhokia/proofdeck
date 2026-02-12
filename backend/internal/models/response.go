package models

import (
	"time"

	"github.com/google/uuid"
)

type Response struct {
	ID            uuid.UUID   `gorm:"primaryKey;type:uuid" json:"id"`
	TestimonialId uuid.UUID   `gorm:"not null" json:"testimonial_id"`
	Testimonial   Testimonial `gorm:"foreignKey:TestimonialId;references:ID;constraint:OnUpdate:CASCADE,OnDelete:CASCADE" json:"-"`

	Name     string `json:"name,omitempty"`
	Email    string `json:"email" gorm:"not null"`
	Role     string `json:"role,omitempty"`
	Company  string `json:"company,omitempty"`
	Feedback string `json:"feedback"`
	Rating   int    `json:"rating" gorm:"check:rating >= 1 AND rating <=5"`

	CreatedAt time.Time `json:"createdAt"`
	UpdatedAt time.Time `json:"updatedAt"`
}
