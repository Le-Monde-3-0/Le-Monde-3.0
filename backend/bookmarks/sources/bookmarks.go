package bookmarks

import (
	"bytes"
	"encoding/json"
	"errors"
	adtos "github.com/Le-Monde-3-0/articles_dtos/sources"
	jwt "github.com/dgrijalva/jwt-go"
	"github.com/gin-gonic/gin"
	"github.com/lib/pq"
	"gorm.io/gorm"
	"io/ioutil"
	"net/http"
	"os"
	"strconv"
	"strings"
)

/*
getUserId retrieves the userId of a token
*/
func getUserId(c *gin.Context) (int32, error) {

	bearerToken := c.Request.Header.Get("Authorization")
	tokenString := ""

	if len(strings.Split(bearerToken, " ")) == 2 {
		tokenString = strings.Split(bearerToken, " ")[1]
	} else {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid token format"})
	}

	tokenPure, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
		return []byte(os.Getenv("secret_key")), nil
	})

	if err != nil {
		return 0, err
	}

	if claims, ok := tokenPure.Claims.(jwt.MapClaims); ok && tokenPure.Valid {
		userID, _ := claims["user_id"].(float64)
		return int32(userID), nil
	} else {
		return 0, errors.New("invalid token")
	}
}

/*
ExtractToken retrieves the userId of a token
*/
func ExtractToken(c *gin.Context) string {
	token := c.Query("token")
	if token != "" {
		return token
	}
	bearerToken := c.Request.Header.Get("Authorization")
	if len(strings.Split(bearerToken, " ")) == 2 {
		return strings.Split(bearerToken, " ")[1]
	}
	return ""
}

/*
MakeHTTPRequest allows the microservice to query another one
*/
func MakeHTTPRequest(c *gin.Context, method string, url string, requestBody interface{}) ([]byte, int, error) {
	jsonParams, err := json.Marshal(requestBody)
	if err != nil {
		return nil, http.StatusInternalServerError, err
	}

	request, err := http.NewRequest(method, url, bytes.NewBuffer(jsonParams))
	if err != nil {
		return nil, http.StatusInternalServerError, err
	}

	request.Header.Set("Content-Type", "application/json")
	request.Header.Set("Authorization", "Bearer "+ExtractToken(c))

	client := &http.Client{}
	response, err := client.Do(request)
	if err != nil {
		return nil, http.StatusInternalServerError, err
	}

	defer response.Body.Close()

	responseBody, err := ioutil.ReadAll(response.Body)
	if err != nil {
		return nil, http.StatusInternalServerError, err
	}

	return responseBody, response.StatusCode, nil
}

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
	responseBody, _, err := MakeHTTPRequest(c, http.MethodGet, "http://articles-lemonde3-0:8082/articles/"+strArticleId, nil)
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
	gorm.Model
	Id       int32
	UserId   int32
	Title    string
	Public   bool
	Articles pq.Int32Array `gorm:"type:integer[]"`
}
