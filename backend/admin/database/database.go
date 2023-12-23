package admin

import (
	src "admin/sources"
	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
	"log"
)

func DatabaseInit() *gorm.DB {
	db, err := gorm.Open(sqlite.Open("database/admin.db"), &gorm.Config{})
	if err != nil {
		log.Fatal("failed to connect database:", err)
	}

	db.AutoMigrate(&src.User{})

	return db
}
