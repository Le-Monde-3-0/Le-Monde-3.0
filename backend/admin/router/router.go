package router

import (
	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
	src "main/sources"
)

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

	r.PUT("/mail", func(c *gin.Context) {
		src.ChangeUserMail(c, db)
	})

	r.PUT("/username", func(c *gin.Context) {
		src.ChangeUsername(c, db)
	})

	r.PUT("/password", func(c *gin.Context) {
		src.ChangeUserPassword(c, db)
	})

	r.GET("/users/:username", func(c *gin.Context) {
		src.GetUserInfoByUsername(c, db)
	})

	// r.GET("/getUser/:id", func(c *gin.Context) {
	// 	src.GetUserFromId(c, db)
	// })
	return r
}
