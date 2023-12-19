package articles

import (
	"github.com/gin-gonic/gin"
	"go.uber.org/zap"
)

func ApplyBookmarksRoutes(protected *gin.RouterGroup, logger *zap.Logger) {

	protected.POST("/bookmarks", func(c *gin.Context) {
		AddBookmark(c, logger)
	})
	protected.POST("/bookmarks/:id/articles/:id-article", func(c *gin.Context) {
		AddArticleInBookmark(c, logger)
	})

	protected.GET("/bookmarks", func(c *gin.Context) {
		GetAllBookmarks(c, logger)
	})
	protected.GET("/bookmarks/:id", func(c *gin.Context) {
		GetBookmark(c, logger)
	})
	protected.GET("/bookmarks/:id/articles", func(c *gin.Context) {
		GetAllArticlesBookmark(c, logger)
	})

	protected.PUT("/bookmarks/:id", func(c *gin.Context) {
		EditBookmark(c, logger)
	})

	protected.DELETE("/bookmarks", func(c *gin.Context) {
		DeleteAllBookmarks(c, logger)
	})
	protected.DELETE("/bookmarks/:id", func(c *gin.Context) {
		DeleteBookmark(c, logger)
	})
	protected.DELETE("/bookmarks/:id/articles", func(c *gin.Context) {
		DeleteAllArticlesBookmark(c, logger)
	})
	protected.DELETE("/bookmarks/:id/articles/:id-article", func(c *gin.Context) {
		DeleteArticleBookmark(c, logger)
	})
}
