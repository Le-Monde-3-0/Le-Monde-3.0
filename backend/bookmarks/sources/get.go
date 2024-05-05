package sources

import (
	"encoding/json"
	"errors"
	"net/http"
	"strconv"
	"github.com/gin-gonic/gin"
	"github.com/lib/pq"
	"gorm.io/gorm"
)

type Article struct {
	Id      int32
	UserId  int32
	Title   string
	Subtitle  string
	Topic  string
	Content string
	Likes   pq.Int32Array `gorm:"type:integer[]"`
}

type BindArticles struct {
	AuthorName string
    Content string
    CreatedAt string
    DeletedAt string
    Draft bool
    ID int32
    Id int32
    Likes pq.Int32Array
    Subtitle string
    Title string
    Topic string
    UpdatedAt string
    UserId int32
}

type ReturnedBookmark struct {
	Id       int32
	UserId   int32
	Title    string
	Description string
	Articles []BindArticles
}

type CallBody struct {
	Ids pq.Int32Array
}

func GetArticlesForBookmark(c *gin.Context, Ids pq.Int32Array) ([]BindArticles, error) {
	if len(Ids) == 0 {
		return nil, nil
	}

	var articles []BindArticles
    body := new(CallBody)
    body.Ids = Ids

    responseBody, _, err := MakeHTTPRequest(c, http.MethodPost, "http://articles-lemonde3-0:8082/articles/multiples", body)
    if err != nil {
        return nil, err
    }

	json.Unmarshal(responseBody, &articles)

    return articles, nil
}

func GetBookmark(c *gin.Context, db *gorm.DB) {
	bookmark := new(Bookmark)

	userId, err := getUserId(c)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	bookmarkId, err := strconv.ParseInt(c.Param("id"), 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"get": "Bookmark id could not be retrieved"})
		return
	}

	result := db.Where(Bookmark{Id: int32(bookmarkId), UserId: userId}).Find(&bookmark)
	if result.Error != nil {
		if errors.Is(result.Error, gorm.ErrRecordNotFound) {
			c.JSON(http.StatusNotFound, gin.H{"error": "No corresponding bookmark"})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error interacting with database"})
		return
	} else if bookmark.Title == "" {
		c.JSON(http.StatusNotFound, gin.H{"error": "Bookmark not found"})
		return
	}

	var responseBody []BindArticles
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

func GetAllBookmarks(c *gin.Context, db *gorm.DB) {
	var bookmarks []Bookmark

	userId, err := getUserId(c)
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
		var responseBody []BindArticles
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

func GetAllArticlesBookmark(c *gin.Context, db *gorm.DB) {
	bookmark := new(Bookmark)
	var articlesBookmark []Article

	userId, err := getUserId(c)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
	}

	bookmarkId, err := strconv.ParseInt(c.Param("id"), 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"get": "Bookmark id could not be retrieved"})
		return
	}

	result := db.Where(Bookmark{Id: int32(bookmarkId), UserId: userId}).Find(&bookmark)
	if result.Error != nil {
		if errors.Is(result.Error, gorm.ErrRecordNotFound) {
			c.JSON(http.StatusNotFound, gin.H{"error": "No conresponding bookmark"})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error interacting with database"})
		return
	} else if bookmark.Title == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Bookmark not found"})
		return
	}

	articlesBookmark, err = getArticlesFromBookmark(c, bookmark.Articles)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	
	c.JSON(http.StatusOK, articlesBookmark)
}
