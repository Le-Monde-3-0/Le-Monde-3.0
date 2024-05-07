package articles

import (
	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
	src "main/sources"
)

/*
Router implements the routes of the microservice
*/
func Router(db *gorm.DB) *gin.Engine {

	r := gin.Default()

	r.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"http://localhost:8080"},
		AllowMethods:     []string{"PUT", "PATCH", "GET", "POST", "DELETE"},
		AllowHeaders:     []string{"*"},
		ExposeHeaders:    []string{"Content-Length", "Content-Type"},
		AllowCredentials: true,
	}))

	r.POST("/articles", func(c *gin.Context) {
		src.AddArticle(c, db)
	})

	r.POST("/articles/:id/likes", func(c *gin.Context) {
		src.AddLike(c, db)
	})

	r.GET("/articles", func(c *gin.Context) {
		src.GetAllArticles(c, db)
	})

	r.GET("/articles/:id", func(c *gin.Context) {
		src.GetArticle(c, db)
	})

	r.GET("/articles/me", func(c *gin.Context) {
		src.GetMyArticles(c, db)
	})

	r.GET("/articles/latest/created", func(c *gin.Context) {
		src.GetLastCreatedArticles(c, db)
	})

	r.GET("/articles/latest/modified", func(c *gin.Context) {
		src.GetLastModifiedArticles(c, db)
	})

	r.GET("/articles/liked", func(c *gin.Context) {
		src.GetMyLikedArticles(c, db)
	})

	r.GET("/articles/:id/likes", func(c *gin.Context) {
		src.GetLikesInfo(c, db)
	})

	r.GET("/articles/topics/example", src.GetRandomTopics)

	r.GET("/articles/topic/:topic", func(c *gin.Context) {
		src.GetArticlesByTopic(c, db)
	})

	r.GET("/articles/topics", func(c *gin.Context) {
		src.GetAllTopics(c, db)
	})

	r.GET("/articles/:id/draft", func(c *gin.Context) {
		src.IsArticleDraft(c, db)
	})

	r.PUT("/articles/:id/draft", func(c *gin.Context) {
		src.ChangeDraftState(c, db)
	})

	r.PUT("/articles/:id", func(c *gin.Context) {
		src.EditArticle(c, db)
	})

	r.GET("/articles/:id/topic", func(c *gin.Context) {
		src.GetArticlesTopic(c, db)
	})

	r.DELETE("/articles", func(c *gin.Context) {
		src.DeleteAllArticles(c, db)
	})

	r.DELETE("/articles/:id", func(c *gin.Context) {
		src.DeleteArticle(c, db)
	})

	r.DELETE("/articles/:id/likes", func(c *gin.Context) {
		src.RemoveLike(c, db)
	})

	r.GET("/articles/search/:keyword", func(c *gin.Context) {
		src.GetArticlesByKeyword(c, db)
	})

	r.POST("/articles/multiples", func(c *gin.Context) {
		src.GetMultipleArticlesFromIds(c, db)
	})

	r.GET("/articles/user/stats", func(c *gin.Context) {
		src.GetUserStats(c, db)
	})

	return r
}
