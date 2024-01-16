package sources

import (
	"github.com/gin-gonic/gin"
	"github.com/lib/pq"
	"gorm.io/gorm"
	"net/http"
	"strconv"
)


type Notification struct {
	gorm.Model
	UserID     int32
	AuthorID   int32
	ArticleID  int32
	IsRead     bool
}

func createNotification(db *gorm.DB, userID, authorID, articleID int32) error {
	notification := Notification{
		UserID:    userID,
		AuthorID:  authorID,
		ArticleID: articleID,
		IsRead:    false,
	}

	result := db.Create(&notification)
	if result.Error != nil {
		return result.Error
	}

	return nil
}


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
		c.JSON(http.StatusBadRequest, gin.H{"error": "article must have a content and a title"})
		return
	}
	article.UserId = userId
	article.Likes = pq.Int32Array{}

	result := db.Create(&article)
	if result.Error != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": result.Error})
		return
	}

	// Créez des notifications pour les utilisateurs qui suivent cet auteur
	var followers []Follower
	db.Where(Follower{AuthorID: article.UserId}).Find(&followers)
	for _, follower := range followers {
		err := createNotification(db, follower.UserID, article.UserId, article.ID)
		if err != nil {
			return 
		}
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
