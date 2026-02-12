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

	// dsn := fmt.Sprintf(
	// 	"host=%s user=%s password=%s dbname=%s port=%s sslmode=require",
	// 	cfg.DB_HOST,
	// 	cfg.DB_USER,
	// 	cfg.DB_PASSWORD,
	// 	cfg.DB_NAME,
	// 	cfg.DB_PORT,
	// )

	dsn := cfg.DATABASE_URL

	var err error
	DB, err = gorm.Open(postgres.Open(dsn), &gorm.Config{
		PrepareStmt: false,
	})

	if err != nil {
		log.Fatal("failed to connect database: ", err)
	}

	if err := DB.AutoMigrate(
		&models.Company{},
		&models.Product{},
		&models.Testimonial{},
		&models.Response{},
	); err != nil {
		log.Fatal("migration failed:", err)
	}

	log.Println("Connected to Database")

}
