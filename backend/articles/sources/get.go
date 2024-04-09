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
		c.JSON(http.StatusInternalServerError, gin.H{"error": result.Error})
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
		c.JSON(http.StatusBadRequest, gin.H{"get": "article id could not be retrieved"})
		return
	}

	result := db.Where(Article{Id: uint(id)}).Find(&article)
	if result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": result.Error})
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
		c.JSON(http.StatusInternalServerError, gin.H{"error": result.Error})
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
		c.JSON(http.StatusInternalServerError, gin.H{"error": result.Error})
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
			c.JSON(http.StatusNotFound, gin.H{"error": result.Error})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": result.Error})
		return
	} else if article.Id == 0 {
		c.JSON(http.StatusNotFound, gin.H{"error": "article not found"})
		return
	}

	c.JSON(http.StatusOK, LikesResponse{len(article.Likes), article.Likes})
}

func GetRandomTopics(c *gin.Context) {
	data, err := os.ReadFile("sources/.topics.txt")
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
