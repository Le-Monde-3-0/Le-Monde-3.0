package sources

import (
	"errors"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	"github.com/lib/pq"
	"gorm.io/gorm"
)

type LikesResponse struct {
	Amount   int
	Accounts pq.Int32Array `gorm:"type:integer[]"`
}

func addIfNotPresent(arr pq.Int32Array, key int32) pq.Int32Array {
	for _, val := range arr {
		if val == key {
			return arr
		}
	}
	return append(arr, key)
}

func GetAllArticles(c *gin.Context, db *gorm.DB) {
	articles := new([]Article)

	result := db.Where(Article{}).Find(&articles)
	if result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error interacting with database"})
		return
	}
	c.JSON(http.StatusOK, articles)
}

func GetArticle(c *gin.Context, db *gorm.DB) {
	article := new(Article)

	id, err := strconv.ParseInt(c.Param("id"), 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"get": "Article id could not be retrieved"})
		return
	}

	result := db.Where(Article{Id: int32(id)}).Find(&article)
	if result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error interacting with database"})
		return
	} else if article.Title == "" {
		c.JSON(http.StatusNotFound, gin.H{"error": "Article not found"})
		return
	}
	c.JSON(http.StatusOK, article)
}

func GetMyArticles(c *gin.Context, db *gorm.DB) {
	articles := new([]Article)

	userId, err := getUserId(c)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	result := db.Where(Article{UserId: userId}).Find(&articles)
	if result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error interacting with database"})
		return
	}
	c.JSON(http.StatusOK, articles)
}

func GetMyLikedArticles(c *gin.Context, db *gorm.DB) {
	var articles []Article

	userId, err := getUserId(c)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	result := db.Find(&articles)
	if result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error interacting with database"})
		return
	}
	var filteredArticles []Article
	filteredArticles = []Article{}
	for _, article := range articles {
		for _, like := range article.Likes {
			if like == userId {
				filteredArticles = append(filteredArticles, article)
				break
			}
		}
	}

	c.JSON(http.StatusOK, filteredArticles)
}

func GetLikesInfo(c *gin.Context, db *gorm.DB) {
	article := new(Article)

	id, err := strconv.ParseInt(c.Param("id"), 10, 64)
	if err != nil {
		panic(err)
	}

	result := db.Where(Article{Id: int32(id)}).Find(&article)
	if result.Error != nil {
		if errors.Is(result.Error, gorm.ErrRecordNotFound) {
			c.JSON(http.StatusNotFound, gin.H{"error": "Article not found"})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error interacting with database"})
		return
	} else if article.Id == 0 {
		c.JSON(http.StatusNotFound, gin.H{"error": "Article not found"})
		return
	}

	c.JSON(http.StatusOK, LikesResponse{len(article.Likes), article.Likes})
}

// * string topic as parameter, fetch the db -> 404 if no article with this topic -> 400 no args -> 200 lists of articles with given topic
func GetArticlesByTopic(c *gin.Context, db *gorm.DB) {
	var articles []Article

	var topic = c.Param("topic")

	// Check if the required parameters are missing
	if topic == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Missing 'topic' parameter"})
		return
	}

	// Fetch articles from the database based on the topic
	result := db.Where("Topic = ?", topic).Find(&articles)

	if result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error interacting with database"})
		return
	}

	// Check if any articles were found
	if result.RowsAffected == 0 {
		c.JSON(http.StatusNotFound, gin.H{"error": "No articles found with the specified topic"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"articles": articles})
}

// * ID as parameter fetch in db chek draft value -> true 200 OK / false 422 Uprocess entity
func IsArticleDraft(c *gin.Context, db *gorm.DB) {
	article := new(Article)

	id, err := strconv.ParseInt(c.Param("id"), 10, 64)
	if err != nil {
		panic(err)
	}

	result := db.Where(Article{Id: int32(id)}).Find(&article)

	if result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error interacting with database"})
		return
	} else if article.Title == "" {
		c.JSON(http.StatusNotFound, gin.H{"error": "Article not found or was not created by the current user"})
		return
	}

	if article.Draft == true {
		c.JSON(http.StatusOK, gin.H{"true": "Article is a draft"})
	} else {
		c.JSON(http.StatusUnprocessableEntity, gin.H{"false": "Article is not a draft"})
	}
}

func GetAllTopics(c *gin.Context, db *gorm.DB) {
	var topics []string

	result := db.Model(&Article{}).Distinct("topic").Pluck("topic", &topics)
	if result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error interacting with database"})
		return
	}
	c.JSON(http.StatusOK, topics)
}
