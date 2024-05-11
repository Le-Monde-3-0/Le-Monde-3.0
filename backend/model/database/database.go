package model

import (
	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
	"log"
)

/*
DatabaseInit initializes the database for the microservice
*/
func DatabaseInit() *gorm.DB {
	db, err := gorm.Open(sqlite.Open("database/model.db"), &gorm.Config{})
	if err != nil {
		log.Fatal("failed to connect database:", err)
	}

	// TODO edit to object of the microservice
	// db.AutoMigrate(&src.{})

	return db
}
