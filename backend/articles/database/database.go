package articles

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
	db, err := gorm.Open(sqlite.Open("database/articles.db"), &gorm.Config{})
	if err != nil {
		log.Fatal("failed to connect database:", err)
	}

	db.AutoMigrate(&src.Article{})
	db.AutoMigrate(&src.RecordView{})
	db.AutoMigrate(&src.RecordLike{})

	return db
}
