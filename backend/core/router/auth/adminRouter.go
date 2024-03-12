package core

import (
	"github.com/gin-gonic/gin"
	"github.com/prometheus/client_golang/prometheus/promhttp"
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

	protected.GET("/users/me", func(c *gin.Context) {
		GetMyInfo(c, logger)
	})

	protected.GET("/users/:id", func(c *gin.Context) {
		GetUser(c, logger)
	})

	protected.POST("/users/me/visibility", func(c *gin.Context) {
		ChangeUserVisibility(c, logger)
	})

	public.GET("/metrics", gin.WrapH(promhttp.Handler()))
}
