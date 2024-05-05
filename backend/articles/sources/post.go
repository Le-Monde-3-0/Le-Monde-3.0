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
		c.JSON(http.StatusBadRequest, gin.H{"error": "Create article parameter Incorect"})
		return
	}

	if article.Content == "" || article.Title == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Article must have a content and a title"})
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
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error while creating article"})
		return
	}
	//AddInIPFS(article) // TODO regenerer les .env info
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
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error interacting with database"})
		return
	} else if article.Title == "" {
		c.JSON(http.StatusNotFound, gin.H{"error": "Article not found"})
		return
	}
	article.Likes = addIfNotPresent(article.Likes, userId)
	db.Save(&article)

	article.HasConnectedUserLiked = true

	c.JSON(http.StatusOK, article)
}

type ArticleIds struct {
	Ids pq.Int32Array
}

func GetMultipleArticlesFromIds(c *gin.Context, db *gorm.DB) {
	var articles []Article

	articleIds := ArticleIds{}
	if err := c.ShouldBindJSON(&articleIds); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid arguments"})
		return
	}

	for _, id := range articleIds.Ids {
		var article Article
		db.Where(Article{Id: uint(id)}).Find(&article)

		if article.Id != 0 {
			articles = append(articles, article)
		}
	}
	c.JSON(http.StatusOK, articles)
}
