package core

import (
	"github.com/gin-gonic/gin"
	"go.uber.org/zap"
)

/*
ApplyAuthRoutes implements the routes of the microservice Auth
*/
func ApplyAuthRoutes(public *gin.RouterGroup, protected *gin.RouterGroup, logger *zap.Logger) {

	public.POST("/register", func(c *gin.Context) {
		Register(c, logger)
	})

	public.POST("/login", func(c *gin.Context) {
		Login(c, logger)
	})

	protected.GET("/me", func(c *gin.Context) {
		GetMyInfo(c, logger)
	})
}
