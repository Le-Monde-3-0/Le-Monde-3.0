package auth

import (
	src "auth/sources"
	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

/*
Router implements the routes of the microservice
*/
func Router(db *gorm.DB) *gin.Engine {

	r := gin.Default()

	r.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"*"},
		AllowMethods:     []string{"PUT", "PATCH", "GET", "POST"},
		AllowHeaders:     []string{"*"},
		ExposeHeaders:    []string{"Content-Length", "Content-Type"},
		AllowCredentials: true,
	}))

	r.POST("/login", func(c *gin.Context) {
		src.Login(c, db)
	})

	r.POST("/register", func(c *gin.Context) {
		src.Register(c, db)
	})

	return r
}
