package bookmarks

import (
	"encoding/json"
	"errors"
	adtos "github.com/Le-Monde-3-0/articles_dtos/sources"
	utils "github.com/Le-Monde-3-0/utils/sources"
	"github.com/gin-gonic/gin"
	"github.com/lib/pq"
	"gorm.io/gorm"
	"net/http"
	"strconv"
	"time"
)

type ReturnedBookmark struct {
	Id          uint `gorm:"primarykey"`
	CreatedAt   time.Time
	UpdatedAt   time.Time
	DeletedAt   gorm.DeletedAt `gorm:"index"`
	UserId      int32
	Title       string
	Articles    []adtos.ArticleResponse
	IsPrivate   bool
	Description string
}

type CallBody struct {
	Ids pq.Int32Array
}

func GetArticlesForBookmark(c *gin.Context, Ids pq.Int32Array) ([]adtos.ArticleResponse, error) {
	if len(Ids) == 0 {
		return nil, nil
	}

	var articles []adtos.ArticleResponse
	body := new(CallBody)
	body.Ids = Ids

	responseBody, _, err := utils.MakeHTTPRequest(c, http.MethodPost, "http://articles-lemonde3-0:8082/articles/multiples", body)
	if err != nil {
		return nil, err
	}

	json.Unmarshal(responseBody, &articles)

	return articles, nil
}

/*
GetBookmark retrieves a bookmark of the connected user
*/
func GetBookmark(c *gin.Context, db *gorm.DB) {
	bookmark := new(Bookmark)

	bookmarkId, err := strconv.ParseInt(c.Param("id"), 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"get": "Bookmark id could not be retrieved"})
		return
	}

	userId, err := utils.GetUserId(c)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	result := db.Where(Bookmark{Id: uint(bookmarkId)}).Find(&bookmark)
	if result.Error != nil {
		if errors.Is(result.Error, gorm.ErrRecordNotFound) {
			c.JSON(http.StatusNotFound, gin.H{"error": "No corresponding bookmark"})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error interacting with database"})
		return
	} else if bookmark.Title == "" {
		c.JSON(http.StatusNotFound, gin.H{"error": "bookmark not found"})
		return
	} else if bookmark.IsPrivate && bookmark.UserId != userId {
		c.JSON(http.StatusForbidden, gin.H{"error": "bookmark is private"})
		return
	}

	var responseBody []adtos.ArticleResponse
	responseBody, err = GetArticlesForBookmark(c, bookmark.Articles)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error getting articles for bookmark"})
		return
	}

	returnedBookmark := ReturnedBookmark{
		Id:          bookmark.Id,
		UserId:      bookmark.UserId,
		Title:       bookmark.Title,
		Description: bookmark.Description,
		Articles:    responseBody,
	}

	// gin.H{"bookmark": bookmark, "articles": responseBody}
	// c.JSON(http.StatusOK, bookmark)

	c.JSON(http.StatusOK, returnedBookmark)

	// c.JSON(http.StatusOK, gin.H{"bookmark": bookmark, "articles": responseBody})
}

/*
GetAllBookmarks retrieves every bookmark of the connected user
*/
func GetAllBookmarks(c *gin.Context, db *gorm.DB) {
	var bookmarks []Bookmark

	userId, err := utils.GetUserId(c)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
	}

	result := db.Where(Bookmark{UserId: userId}).Find(&bookmarks)
	if result.Error != nil {
		if errors.Is(result.Error, gorm.ErrRecordNotFound) {
			c.JSON(http.StatusNotFound, gin.H{"error": "No corresponding bookmarks"})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error interacting with database"})
		return
	}

	var returnedBookmarks []ReturnedBookmark

	for _, bookmark := range bookmarks {
		var responseBody []adtos.ArticleResponse
		responseBody, err = GetArticlesForBookmark(c, bookmark.Articles)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Error getting articles for bookmark"})
			return
		}

		returnedBookmark := ReturnedBookmark{
			Id:          bookmark.Id,
			UserId:      bookmark.UserId,
			Title:       bookmark.Title,
			Description: bookmark.Description,
			Articles:    responseBody,
		}
		returnedBookmarks = append(returnedBookmarks, returnedBookmark)
	}

	c.JSON(http.StatusOK, returnedBookmarks)
}

/*
GetAllArticlesBookmark retrieves all the articles of a bookmark
*/
func GetAllArticlesBookmark(c *gin.Context, db *gorm.DB) {
	bookmark := new(Bookmark)
	var articlesBookmark []adtos.ArticleResponse

	userId, err := utils.GetUserId(c)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
	}

	bookmarkId, err := strconv.ParseInt(c.Param("id"), 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"get": "Bookmark id could not be retrieved"})
		return
	}

	result := db.Where(Bookmark{Id: uint(bookmarkId), UserId: userId}).Find(&bookmark)
	if result.Error != nil {
		if errors.Is(result.Error, gorm.ErrRecordNotFound) {
			c.JSON(http.StatusNotFound, gin.H{"error": "No conresponding bookmark"})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error interacting with database"})
		return
	} else if bookmark.Title == "" {
		c.JSON(http.StatusNotFound, gin.H{"error": "bookmark not found"})
		return
	}

	articlesBookmark, err = getArticlesFromBookmark(c, bookmark.Articles)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, articlesBookmark)
}
