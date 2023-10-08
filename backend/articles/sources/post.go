package sources

import (
	"github.com/gin-gonic/gin"
	"github.com/lib/pq"
	"gorm.io/gorm"
	"net/http"
	"strconv"
)

func AddArticle(c *gin.Context, db *gorm.DB) {
	article := new(Article)

	userId, err := getUserId(c)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if err := c.Bind(&article); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if article.Content == "" || article.Title == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "article must have content and a title"})
		return
	}

	var existingArticle Article
	if db.Where("title = ? AND user_id = ?", article.Title, userId).First(&existingArticle).Error == nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Article with the same title already exists"})
		return
	}

	article.UserId = userId
	article.Likes = pq.Int32Array{}

	result := db.Create(&article)
	if result.Error != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": result.Error.Error()})
		return
	}
	c.JSON(http.StatusCreated, article)
}

func AddLike(c *gin.Context, db *gorm.DB) {
	article := new(Article)

	userId, err := getUserId(c)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	id, err := strconv.ParseInt(c.Param("id"), 10, 64)
	if err != nil {
		panic(err)
	}

	result := db.Where(Article{Id: int32(id)}).Find(&article)
	if result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": result.Error})
		return
	} else if article.Title == "" {
		c.JSON(http.StatusNotFound, gin.H{"error": "article not found"})
		return
	}
	article.Likes = addIfNotPresent(article.Likes, userId)
	db.Save(&article)
	c.JSON(http.StatusOK, article)
}
