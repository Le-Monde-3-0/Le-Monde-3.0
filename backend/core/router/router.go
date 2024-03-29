package router

import (
	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	swaggerfiles "github.com/swaggo/files"
	ginSwagger "github.com/swaggo/gin-swagger"
	mw "main/middlewares"
	adm "main/router/admin"
	art "main/router/articles"
	bkm "main/router/bookmarks"
)

func Router() *gin.Engine {

	r := gin.New()

	r.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"*"},
		AllowMethods:     []string{"PUT", "PATCH", "GET", "POST", "DELETE"},
		AllowHeaders:     []string{"*"},
		ExposeHeaders:    []string{"Content-Length", "Content-Type"},
		AllowCredentials: true,
	}))

	r.GET("/swagger/*any", ginSwagger.WrapHandler(swaggerfiles.Handler))
	public := r.Group("/")
	protected := r.Group("/")

	protected.Use(mw.JwtAuthMiddleware())

	adm.ApplyAdminRoutes(public)
	art.ApplyArticlesRoutes(protected)
	bkm.ApplyBookmarksRoutes(protected)

	return r
}
