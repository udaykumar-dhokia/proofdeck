package database

import (
	"log"

	"github.com/udaykumar-dhokia/proofdeck/internal/config"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

func Connect() {
	cfg := config.NewEnv()

	dsn := cfg.DATABASE_URL

	_, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})

	if err != nil {
		log.Fatal("failed to connect database: ", err)
	}

	log.Println("Connected to Database")

	// db.AutoMigrate(&models.User{})
}
