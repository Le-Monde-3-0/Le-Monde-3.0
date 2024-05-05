package articles

import (
	"github.com/gin-gonic/gin"
)

func ApplyArticlesRoutes(protected *gin.RouterGroup) {

	protected.POST("/articles", AddArticle)
	protected.POST("/articles/:id/likes", AddLike)
	protected.POST("/articles/multiples", GetMultipleArticlesFromIds)

	protected.GET("/articles", GetAllArticles)
	protected.GET("/articles/:id", GetArticle)
	protected.GET("/articles/me", GetMyArticles)
	protected.GET("/articles/latest/created", GetLastCreatedArticles)
	protected.GET("/articles/latest/modified", GetLastModifiedArticles)
	protected.GET("/articles/liked", GetLikedArticles)
	protected.GET("/articles/:id/likes", GetLikesInfo)
	protected.GET("/articles/topic/:topic", GetArticlesByTopic)
	protected.GET("/articles/topics", GetAllTopics)
	protected.GET("/articles/:id/topic", GetArticlesTopic)
	protected.GET("/articles/search/:keyword", GetArticlesByKeyword)

	protected.PUT("/articles/:id", EditArticle)
	protected.GET("/articles/:id/draft", IsArticleDraft)
	protected.PUT("/articles/:id/draft", ChangeDraftState)

	protected.DELETE("/articles", DeleteAllArticles)
	protected.DELETE("/articles/id", DeleteArticle)
	protected.DELETE("/articles/:id/likes", RemoveLike)
}
