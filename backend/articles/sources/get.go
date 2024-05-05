package articles

import (
	"errors"
	utils "github.com/Le-Monde-3-0/utils/sources"
	"github.com/gin-gonic/gin"
	"github.com/lib/pq"
	"gorm.io/gorm"
	"math/rand"
	"net/http"
	"os"
	"strconv"
	"strings"
	"time"
)

type LikesResponse struct {
	Amount   int
	Accounts pq.Int32Array `gorm:"type:integer[]"`
}

func GetLastCreatedArticles(c *gin.Context, db *gorm.DB) {
	articles := []Article{}
	currentTime := time.Now()
	twoHoursAgo := currentTime.Add(-2 * time.Hour)

	// Query to get articles created in the last 2 hours
	result := db.Where("created_at >= ?", twoHoursAgo).Find(&articles)
	if result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch articles"})
		return
	}

	c.JSON(http.StatusOK, articles)
}

func GetLastModifiedArticles(c *gin.Context, db *gorm.DB) {
	articles := []Article{}
	currentTime := time.Now()
	twoHoursAgo := currentTime.Add(-2 * time.Hour)

	// Query to get articles created in the last 2 hours
	result := db.Where("updated_at >= ?", twoHoursAgo).Find(&articles)
	if result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch articles"})
		return
	}

	c.JSON(http.StatusOK, articles)
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

	userId, err := utils.GetUserId(c)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	for i := range *articles {
		if hasUserLikedArticle(int64(userId), &(*articles)[i]) {
			(*articles)[i].HasConnectedUserLiked = true
		}
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

	result := db.Where(Article{Id: uint(id)}).Find(&article)
	if result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error interacting with database"})
		return
	} else if article.Title == "" {
		c.JSON(http.StatusNotFound, gin.H{"error": "Article not found"})
		return
	}

	userId, err := utils.GetUserId(c)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if hasUserLikedArticle(int64(userId), article) {
		article.HasConnectedUserLiked = true
	}
	c.JSON(http.StatusOK, article)
}

func hasUserLikedArticle(userId int64, article *Article) bool {

	for _, value := range article.Likes {
		if value == int32(userId) {
			return true
		}
	}
	return false
}

func GetMyArticles(c *gin.Context, db *gorm.DB) {
	articles := new([]Article)

	userId, err := utils.GetUserId(c)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	result := db.Where(Article{UserId: userId}).Find(&articles)
	if result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error interacting with database"})
		return
	}

	for _, article := range *articles {
		if hasUserLikedArticle(int64(userId), &article) {
			article.HasConnectedUserLiked = true
		}
	}

	c.JSON(http.StatusOK, articles)
}

func GetMyLikedArticles(c *gin.Context, db *gorm.DB) {
	var articles []Article

	userId, err := utils.GetUserId(c)
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

	result := db.Where(Article{Id: uint(id)}).Find(&article)
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

func GetRandomTopics(c *gin.Context) {
	data, err := os.ReadFile(".topics.txt")
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "Failed to read topics file",
		})
		return
	}

	topics := strings.Split(string(data), "\n")

	var filteredTopics []string
	for _, topic := range topics {
		if topic != "" {
			filteredTopics = append(filteredTopics, topic)
		}
	}

	rand.Shuffle(len(filteredTopics), func(i, j int) {
		filteredTopics[i], filteredTopics[j] = filteredTopics[j], filteredTopics[i]
	})

	var randomTopics []string
	if len(filteredTopics) <= 10 {
		randomTopics = filteredTopics
	} else {
		randomTopics = filteredTopics[:10]
	}

	c.JSON(http.StatusOK, gin.H{
		"topics": randomTopics,
	})
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

	result := db.Where(Article{Id: uint(id)}).Find(&article)

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

func GetArticlesByKeyword(c *gin.Context, db *gorm.DB) {
	articles := new([]Article)

	_, err := utils.GetUserId(c)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	var keyword = c.Param("keyword")

	if err := db.Where("Title LIKE ?", "%"+keyword+"%").Or("Subtitle LIKE ?", "%"+keyword+"%").Find(&articles).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "No Articles corresponding"})
	}
	c.JSON(http.StatusOK, articles)
}

func GetArticlesTopic(c *gin.Context, db *gorm.DB) {
	article := new(Article)

	_, err := utils.GetUserId(c)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	id, err := strconv.ParseInt(c.Param("id"), 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"put": "Article id could not be retrieved"})
		return
	}

	result := db.Where(Article{Id: uint(id)}).Find(&article)
	if result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error interacting with database"})
		return
	} else if article.Title == "" {
		c.JSON(http.StatusNotFound, gin.H{"error": "Article not found"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"topic": article.Topic})
}
