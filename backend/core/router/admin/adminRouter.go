package articles

import (
	"github.com/gin-gonic/gin"
	"go.uber.org/zap"
)

func ApplyAdminRoutes(public *gin.RouterGroup, logger *zap.Logger) {

	public.POST("/register", func(c *gin.Context) {
		Register(c, logger)
	})

	public.POST("/login", func(c *gin.Context) {
		Login(c, logger)
	})
}
