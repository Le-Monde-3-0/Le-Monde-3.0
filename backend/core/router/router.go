package router

import (
	adm "core/router/admin"
	art "core/router/articles"
	bkm "core/router/bookmarks"
	utils "github.com/Le-Monde-3-0/utils/sources"
	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	swaggerfiles "github.com/swaggo/files"
	ginSwagger "github.com/swaggo/gin-swagger"
	"go.uber.org/zap"
)

func Router(logger *zap.Logger) *gin.Engine {

	r := gin.New()

	r.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"http://localhost:3000"},
		AllowMethods:     []string{"PUT", "PATCH", "GET", "POST"},
		AllowHeaders:     []string{"*"},
		ExposeHeaders:    []string{"Content-Length", "Content-Type"},
		AllowCredentials: true,
	}))

	r.GET("/swagger/*any", ginSwagger.WrapHandler(swaggerfiles.Handler))
	public := r.Group("/")
	protected := r.Group("/")

	protected.Use(utils.JwtAuthMiddleware())

	adm.ApplyAdminRoutes(public, logger)
	art.ApplyArticlesRoutes(protected, logger)
	bkm.ApplyBookmarksRoutes(protected, logger)

	return r
}
