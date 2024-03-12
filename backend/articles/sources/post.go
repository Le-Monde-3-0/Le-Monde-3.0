package articles

import (
	utils "github.com/Le-Monde-3-0/utils/sources"
	"github.com/gin-gonic/gin"
	"github.com/lib/pq"
	"gorm.io/gorm"
	"net/http"
	"strconv"
)

/*
AddArticle creates a new article
*/
func AddArticle(c *gin.Context, db *gorm.DB) {
	article := new(Article)

	userId, err := utils.GetUserId(c)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if err := c.Bind(&article); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if article.Content == "" || article.Title == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "article must have a content and a title"})
		return
	}

	if err := db.Where(Article{UserId: userId, Title: article.Title}).First(article).Error; err == nil {
		c.JSON(http.StatusConflict, gin.H{"error": "you have already created an article with this title"})
		return
	}
	article.UserId = userId
	article.Likes = pq.Int32Array{}

	result := db.Create(&article)
	if result.Error != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": result.Error})
		return
	}
	//AddInIPFS(article) // TODO generates Post "": unsupported protocol scheme "" error
	c.JSON(http.StatusCreated, article)
}

/*
AddLike adds a like to a given article
*/
func AddLike(c *gin.Context, db *gorm.DB) {
	article := new(Article)

	userId, err := utils.GetUserId(c)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	id, err := strconv.ParseInt(c.Param("id"), 10, 64)
	if err != nil {
		panic(err)
	}

	result := db.Where(Article{Id: uint(id)}).Find(&article)
	if result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": result.Error})
		return
	} else if article.Title == "" {
		c.JSON(http.StatusNotFound, gin.H{"error": "article not found"})
		return
	}
	article.Likes = addIfNotPresent(article.Likes, userId)
	db.Save(&article)

	article.HasConnectedUserLiked = true

	c.JSON(http.StatusOK, article)
}
