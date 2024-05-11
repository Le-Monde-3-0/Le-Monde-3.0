package bookmarks

import (
	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
	"log"
	src "main/sources"
)

/*
DatabaseInit initializes the database for the microservice
*/
func DatabaseInit() *gorm.DB {
	db, err := gorm.Open(sqlite.Open("database/bookmarks.db"), &gorm.Config{})
	if err != nil {
		log.Fatal("failed to connect database:", err)
	}

	db.AutoMigrate(&src.Bookmark{})

	return db
}
