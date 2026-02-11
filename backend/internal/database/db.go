package database

import (
	"log"

	"github.com/udaykumar-dhokia/proofdeck/internal/config"
	"github.com/udaykumar-dhokia/proofdeck/internal/models"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

var DB *gorm.DB

func Connect() {
	cfg := config.NewEnv()

	dsn := cfg.DATABASE_URL

	var err error
	DB, err = gorm.Open(postgres.Open(dsn), &gorm.Config{})

	if err != nil {
		log.Fatal("failed to connect database: ", err)
	}

	DB.AutoMigrate(&models.User{})
	log.Println("Connected to Database")

}
