package bookmarks

import (
	"encoding/json"
	adtos "github.com/Le-Monde-3-0/articles_dtos/sources"
	utils "github.com/Le-Monde-3-0/utils/sources"
	"github.com/gin-gonic/gin"
	"github.com/lib/pq"
	"gorm.io/gorm"
	"net/http"
	"strconv"
	"time"
)

/*
getArticlesFromBookmark retrieves all the article of a given bookmark
*/
func getArticlesFromBookmark(c *gin.Context, articlesId []int32) ([]adtos.ArticleResponse, error) {
	var articlesBookmark []adtos.ArticleResponse

	for i := 0; i < len(articlesId); i++ {
		article, err := getArticleById(c, articlesId[i])
		if err != nil {
			return nil, err
		}
		articlesBookmark = append(articlesBookmark, article)
	}
	return articlesBookmark, nil
}

/*
getArticleById retrieves an article in the database using the given id
*/
func getArticleById(c *gin.Context, articleId int32) (adtos.ArticleResponse, error) {
	var article adtos.ArticleResponse
	strArticleId := strconv.Itoa(int(articleId))
	responseBody, _, err := utils.MakeHTTPRequest(c, http.MethodGet, "http://articles-lemonde3-0:8082/articles/"+strArticleId, nil)
	if err != nil {
		return adtos.ArticleResponse{}, err
	}
	err = json.Unmarshal(responseBody, &article)
	if err != nil {
		return adtos.ArticleResponse{}, err
	}
	return article, nil
}

type Bookmark struct {
	Id        uint `gorm:"primarykey"`
	CreatedAt time.Time
	UpdatedAt time.Time
	DeletedAt gorm.DeletedAt `gorm:"index"`
	UserId    int32
	Title     string
	Articles  pq.Int32Array `gorm:"type:integer[]"`
	IsPrivate bool
	Description string
}
