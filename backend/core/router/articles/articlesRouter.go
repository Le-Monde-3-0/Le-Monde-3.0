package core

import (
	"github.com/gin-gonic/gin"
	"go.uber.org/zap"
)

/*
ApplyArticlesRoutes implements the routes of the microservice Articles
*/
func ApplyArticlesRoutes(public *gin.RouterGroup, protected *gin.RouterGroup, logger *zap.Logger) {

	protected.POST("/articles", func(c *gin.Context) {
		AddArticle(c, logger)
	})
	protected.POST("/articles/:id/likes", func(c *gin.Context) {
		AddLike(c, logger)
	})

	protected.GET("/articles", func(c *gin.Context) {
		GetAllArticles(c, logger)
	})
	protected.GET("/articles/:id", func(c *gin.Context) {
		GetArticle(c, logger)
	})
	protected.GET("/articles/me", func(c *gin.Context) {
		GetMyArticles(c, logger)
	})
	protected.GET("/articles/liked", func(c *gin.Context) {
		GetLikedArticles(c, logger)
	})
	protected.GET("/articles/:id/likes", func(c *gin.Context) {
		GetLikesInfo(c, logger)
	})

	public.GET("/articles/topics/example", func(c *gin.Context) {
		GetRandomTopics(c, logger)
	})

	protected.PUT("/articles/:id", func(c *gin.Context) {
		EditArticle(c, logger)
	})

	protected.DELETE("/articles", func(c *gin.Context) {
		DeleteAllArticles(c, logger)
	})
	protected.DELETE("/articles/id", func(c *gin.Context) {
		DeleteArticle(c, logger)
	})
	protected.DELETE("/articles/:id/likes", func(c *gin.Context) {
		RemoveLike(c, logger)
	})
}
