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
		AllowMethods:     []string{"PUT", "PATCH", "GET", "POST", "DELETE"},
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

	r.GET("/users/me", func(c *gin.Context) {
		src.GetMyInfo(c, db)
	})

	r.GET("/users/users/:id", func(c *gin.Context) {
		src.GetUser(c, db)
	})

	r.POST("/users/me/visibility", func(c *gin.Context) {
		src.ChangeUserVisibility(c, db)
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

	r.GET("/users/username/:username", func(c *gin.Context) {
		src.GetUserInfoByUsername(c, db)
	})

	// r.GET("/getUser/:id", func(c *gin.Context) {
	// 	src.GetUserFromId(c, db)
	// })
	return r
}
