package bookmarks

import (
	"errors"
	adtos "github.com/Le-Monde-3-0/articles_dtos/sources"
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
	"net/http"
	"strconv"
)

/*
GetBookmark retrieves a bookmark of the connected user
*/
func GetBookmark(c *gin.Context, db *gorm.DB) {
	bookmark := new(Bookmark)

	bookmarkId, err := strconv.ParseInt(c.Param("id"), 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"get": "bookmark id could not be retrieved"})
		return
	}

	result := db.Where(Bookmark{Id: uint(bookmarkId), Public: true}).Find(&bookmark)
	if result.Error != nil {
		if errors.Is(result.Error, gorm.ErrRecordNotFound) {
			c.JSON(http.StatusNotFound, gin.H{"error": result.Error})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": result.Error})
		return
	} else if bookmark.Title == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "bookmark not found"})
		return
	}
	c.JSON(http.StatusOK, bookmark)
}

/*
GetAllBookmarks retrieves every bookmark of the connected user
*/
func GetAllBookmarks(c *gin.Context, db *gorm.DB) {
	bookmarks := new([]Bookmark)

	userId, err := getUserId(c)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
	}

	result := db.Where(Bookmark{UserId: userId}).Find(&bookmarks)
	if result.Error != nil {
		if errors.Is(result.Error, gorm.ErrRecordNotFound) {
			c.JSON(http.StatusNotFound, gin.H{"error": result.Error})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": result.Error})
		return
	}
	c.JSON(http.StatusOK, bookmarks)
}

/*
GetAllArticlesBookmark retrieves all the articles of a bookmark
*/
func GetAllArticlesBookmark(c *gin.Context, db *gorm.DB) {
	bookmark := new(Bookmark)
	var articlesBookmark []adtos.ArticleResponse

	userId, err := getUserId(c)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
	}

	bookmarkId, err := strconv.ParseInt(c.Param("id"), 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"get": "bookmark id could not be retrieved"})
		return
	}

	result := db.Where(Bookmark{Id: uint(bookmarkId), UserId: userId}).Find(&bookmark)
	if result.Error != nil {
		if errors.Is(result.Error, gorm.ErrRecordNotFound) {
			c.JSON(http.StatusNotFound, gin.H{"error": result.Error})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": result.Error})
		return
	} else if bookmark.Title == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "bookmark not found"})
		return
	}

	articlesBookmark, err = getArticlesFromBookmark(c, bookmark.Articles)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, articlesBookmark)
}
