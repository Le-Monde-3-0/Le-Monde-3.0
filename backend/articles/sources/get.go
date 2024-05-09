package articles

import (
	"errors"
	"fmt"
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

type DailyInfo struct {
	Date   time.Time
	Daily  int
	Summed int
}

type TimeRecord struct {
	Total int
	Daily []DailyInfo
}

type UserStats struct {
	Likes TimeRecord
	Views TimeRecord
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

func addRecordLike(articleID uint, key int32, db *gorm.DB) []RecordLike {
	var records []RecordLike

	result := db.Where(RecordLike{ArticleID: articleID}).Find(&records)
	if result.Error != nil {
		fmt.Print(result.Error.Error())
		return nil
	}

	for _, val := range records {
		if val.UserId == key {
			return records
		}
	}
	records = append(records, RecordLike{UserId: key, LikeTime: time.Now()})

	return records
}

func getRecordLike(articleID uint, db *gorm.DB) []RecordLike {
	var records []RecordLike

	result := db.Where(RecordLike{ArticleID: articleID}).Find(&records)
	if result.Error != nil {
		fmt.Print(result.Error.Error())
		return nil
	}

	return records
}

func getRecordView(articleID uint, db *gorm.DB) []RecordView {
	var records []RecordView

	result := db.Where(RecordView{ArticleID: articleID}).Find(&records)
	if result.Error != nil {
		fmt.Print(result.Error.Error())
		return nil
	}

	return records
}

func addRecordView(articleID uint, key int32, db *gorm.DB) []RecordView {
	var records []RecordView

	result := db.Where(RecordView{ArticleID: articleID}).Find(&records)
	if result.Error != nil {
		fmt.Print(result.Error.Error())
		return nil
	}

	for _, val := range records {
		if val.UserId == key {
			return records
		}
	}
	records = append(records, RecordView{UserId: key, LikeTime: time.Now()})

	return records
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
	article.Views = addRecordView(article.Id, userId, db)
	article.Likes = getRecordLike(article.Id, db)
	if err := db.Save(&article).Error; err != nil {
		fmt.Print(err.Error())
	}

	if hasUserLikedArticle(int64(userId), article) {
		article.HasConnectedUserLiked = true
	}

	c.JSON(http.StatusOK, article)
}

func hasUserLikedArticle(userId int64, article *Article) bool {

	for _, value := range article.Likes {
		if value.UserId == int32(userId) {
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
			if like.UserId == userId {
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

	c.JSON(http.StatusOK, LikesResponse{len(article.Likes), nil})
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

func isSameDay(date1, date2 time.Time) bool {
	return date1.Year() == date2.Year() && date1.Month() == date2.Month() && date1.Day() == date2.Day()
}

func AddLikeRecord(article Article, userStats UserStats) UserStats {
	for _, articleLikesRecord := range article.Likes {
		found := false
		for _, userArticleRecord := range userStats.Likes.Daily {
			if isSameDay(articleLikesRecord.LikeTime, userArticleRecord.Date) {
				userArticleRecord.Daily += 1
				found = true
			}
		}
		if !found {
			userStats.Likes.Daily = append(userStats.Likes.Daily, DailyInfo{
				Date:  articleLikesRecord.LikeTime,
				Daily: 1,
			})
		}

	}
	return userStats
}

func AddViewRecord(article Article, userStats UserStats) UserStats {
	for _, articleViewsRecord := range article.Views {
		found := false
		for index, userArticleRecord := range userStats.Views.Daily {
			if isSameDay(articleViewsRecord.LikeTime, userArticleRecord.Date) {
				userStats.Views.Daily[index].Daily += 1
				found = true
				continue
			}
		}
		if !found {
			userStats.Views.Daily = append(userStats.Views.Daily, DailyInfo{
				Date:  articleViewsRecord.LikeTime,
				Daily: 1,
			})
		}
	}
	return userStats
}

func GetUserStats(c *gin.Context, db *gorm.DB) {
	var userStats UserStats
	userStats.Likes = TimeRecord{}
	userStats.Views = TimeRecord{}
	userStats.Likes.Daily = []DailyInfo{}
	userStats.Views.Daily = []DailyInfo{}

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
		article.Likes = getRecordLike(article.Id, db)
		article.Views = getRecordView(article.Id, db)
		userStats.Views.Total += len(article.Views)
		userStats.Likes.Total += len(article.Likes)
		userStats = AddViewRecord(article, userStats)
		userStats = AddLikeRecord(article, userStats)
	}
	if len(userStats.Likes.Daily) != 0 {
		userStats.Likes.Daily[0].Summed = userStats.Likes.Daily[0].Daily
	}
	if len(userStats.Views.Daily) != 0 {
		userStats.Views.Daily[0].Summed = userStats.Views.Daily[0].Daily

	}

	for i := 1; i < len(userStats.Views.Daily); i++ {
		userStats.Views.Daily[i].Summed = userStats.Views.Daily[i-1].Summed + userStats.Views.Daily[i].Daily
	}

	for i := 1; i < len(userStats.Likes.Daily); i++ {
		userStats.Likes.Daily[i].Summed = userStats.Likes.Daily[i-1].Summed + userStats.Likes.Daily[i].Daily
	}
	c.JSON(http.StatusOK, userStats)
}
