package core

import (
	utils "github.com/Le-Monde-3-0/utils/sources"
	"github.com/gin-gonic/gin"
	"go.uber.org/zap"
	"net/http"
)

type ArticleInput struct {
	Title   string `json:"title" binding:"required"`
	Content string `json:"content" binding:"required"`
}

type Article struct {
	Id                    uint `gorm:"primarykey"`
	UserId                int32
	Title                 string
	Content               string
	Likes                 []int32
	HasConnectedUserLiked bool
}

type LikesResponse struct {
	Amount   int
	Accounts []int32
}

type DeletedResponse struct {
	Delete string `json:"delete" example:"all articles have been successfully deleted"`
}

// AddArticle godoc
// @Schemes
// @Description Add an article
// @Tags articles
// @Accept json
// @Produce json
// @Param ArticleInput body ArticleInput true "Params to create an article"
// @Success 200 {object} Article
// @Failure      400  {object}  HTTPError400
// @Failure      409  {object}  HTTPError409
// @Failure      500  {object}  HTTPError500
// @Router /articles [post]
func AddArticle(c *gin.Context, logger *zap.Logger) {
	var articlesParams ArticleInput

	if err := c.ShouldBindJSON(&articlesParams); err != nil {
		c.String(http.StatusBadRequest, "Invalid request body")
		return
	}

	responseBody, statusCode, err := utils.MakeHTTPRequest(c, http.MethodPost, "http://articles-lemonde3-0:8082/articles", articlesParams)
	if err != nil {
		c.String(statusCode, "Error making the request")
		return
	}
	c.Data(statusCode, "application/json", responseBody)
}

// AddLike godoc
// @Schemes
// @Description Add a like to an article
// @Tags articles
// @Accept json
// @Produce json
// @Success 200 {object} Article
// @Failure      400  {object}  HTTPError400
// @Failure      404  {object}  HTTPError404
// @Failure      500  {object}  HTTPError500
// @Router /articles/:id/likes [post]
func AddLike(c *gin.Context, logger *zap.Logger) {

	responseBody, statusCode, err := utils.MakeHTTPRequest(c, http.MethodPost, "http://articles-lemonde3-0:8082/articles/"+c.Param("id")+"/likes", nil)
	if err != nil {
		c.String(statusCode, "Error making the request")
		return
	}
	c.Data(statusCode, "application/json", responseBody)
}

// GetAllArticles godoc
// @Schemes
// @Description Retrieve all articles
// @Tags articles
// @Accept json
// @Produce json
// @Success 200 {object} []Article
// @Failure      400  {object}  HTTPError400
// @Failure      500  {object}  HTTPError500
// @Router /articles [get]
func GetAllArticles(c *gin.Context, logger *zap.Logger) {

	responseBody, statusCode, err := utils.MakeHTTPRequest(c, http.MethodGet, "http://articles-lemonde3-0:8082/articles", nil)
	if err != nil {
		c.String(statusCode, "Error making the request")
		return
	}
	c.Data(statusCode, "application/json", responseBody)
}

// GetArticle godoc
// @Schemes
// @Description Retrieve an article
// @Tags articles
// @Accept json
// @Produce json
// @Success 200 {object} Article
// @Failure      400  {object}  HTTPError400
// @Failure      404  {object}  HTTPError500
// @Failure      500  {object}  HTTPError500
// @Router /articles/:id [get]
func GetArticle(c *gin.Context, logger *zap.Logger) {

	responseBody, statusCode, err := utils.MakeHTTPRequest(c, http.MethodGet, "http://articles-lemonde3-0:8082/articles/"+c.Param("id"), nil)
	if err != nil {
		c.String(statusCode, "Error making the request")
		return
	}
	c.Data(statusCode, "application/json", responseBody)
}

// GetMyArticles godoc
// @Schemes
// @Description Retrieve connected user articles
// @Tags articles
// @Accept json
// @Produce json
// @Success 200 {object} []Article
// @Failure      400  {object}  HTTPError400
// @Failure      500  {object}  HTTPError500
// @Router /articles/me [get]
func GetMyArticles(c *gin.Context, logger *zap.Logger) {

	responseBody, statusCode, err := utils.MakeHTTPRequest(c, http.MethodGet, "http://articles-lemonde3-0:8082/articles/me", nil)
	if err != nil {
		c.String(statusCode, "Error making the request")
		return
	}
	c.Data(statusCode, "application/json", responseBody)
}

// GetLikedArticles godoc
// @Schemes
// @Description Retrieve liked articles
// @Tags articles
// @Accept json
// @Produce json
// @Success 200 {object} []Article
// @Failure      400  {object}  HTTPError400
// @Failure      500  {object}  HTTPError500
// @Router /articles/liked [get]
func GetLikedArticles(c *gin.Context, logger *zap.Logger) {

	responseBody, statusCode, err := utils.MakeHTTPRequest(c, http.MethodGet, "http://articles-lemonde3-0:8082/articles/liked", nil)
	if err != nil {
		c.String(statusCode, "Error making the request")
		return
	}
	c.Data(statusCode, "application/json", responseBody)
}

// GetLikesInfo godoc
// @Schemes
// @Description Retrieve likes information related to an article
// @Tags articles
// @Accept json
// @Produce json
// @Success 200 {object} LikesResponse
// @Failure      400  {object}  HTTPError400
// @Failure      404  {object}  HTTPError404
// @Failure      500  {object}  HTTPError500
// @Router /articles/:id/likes [get]
func GetLikesInfo(c *gin.Context, logger *zap.Logger) {

	responseBody, statusCode, err := utils.MakeHTTPRequest(c, http.MethodGet, "http://articles-lemonde3-0:8082/articles/"+c.Param("id")+"/likes", nil)
	if err != nil {
		c.String(statusCode, "Error making the request")
		logger.Error(err.Error())
		return
	}
	c.Data(statusCode, "application/json", responseBody)
}

// GetRandomTopics godoc
// @Schemes
// @Description Return random ideas of topics
// @Tags articles
// @Accept json
// @Produce json
// @Success 200 {object} []string
// @Failure      500  {object}  HTTPError500
// @Router /articles/topics/example [get]
func GetRandomTopics(c *gin.Context, logger *zap.Logger) {

	responseBody, statusCode, err := utils.MakeHTTPRequest(c, http.MethodGet, "http://articles-lemonde3-0:8082/articles/topics/example", nil)
	if err != nil {
		c.String(statusCode, "Error making the request")
		logger.Error(err.Error())
		return
	}
	c.Data(statusCode, "application/json", responseBody)
}

// EditArticle godoc
// @Schemes
// @Description Edit an article
// @Tags articles
// @Accept json
// @Produce json
// @Param ArticleInput body ArticleInput true "Params to edit an article"
// @Success 200 {object} Article
// @Failure      400  {object}  HTTPError400
// @Failure      404  {object}  HTTPError500
// @Failure      500  {object}  HTTPError500
// @Router /articles/:id [put]
func EditArticle(c *gin.Context, logger *zap.Logger) {
	var articlesParams ArticleInput

	if err := c.ShouldBindJSON(&articlesParams); err != nil {
		c.String(http.StatusBadRequest, "Invalid request body")
		logger.Error(err.Error())
		return
	}

	responseBody, statusCode, err := utils.MakeHTTPRequest(c, http.MethodPut, "http://articles-lemonde3-0:8082/articles/"+c.Param("id"), articlesParams)
	if err != nil {
		c.String(statusCode, "Error making the request")
		logger.Error(err.Error())
		return
	}
	c.Data(statusCode, "application/json", responseBody)
}

// DeleteAllArticles godoc
// @Schemes
// @Description Delete all the connected user articles
// @Tags articles
// @Accept json
// @Produce json
// @Success 200 {object} DeletedResponse
// @Failure      400  {object}  HTTPError400
// @Failure      500  {object}  HTTPError500
// @Router /articles [delete]
func DeleteAllArticles(c *gin.Context, logger *zap.Logger) {

	responseBody, statusCode, err := utils.MakeHTTPRequest(c, http.MethodDelete, "http://articles-lemonde3-0:8082/articles/me", nil)
	if err != nil {
		c.String(statusCode, "Error making the request")
		logger.Error(err.Error())
		return
	}
	c.Data(statusCode, "application/json", responseBody)
}

// DeleteArticle godoc
// @Schemes
// @Description Delete an article
// @Tags articles
// @Accept json
// @Produce json
// @Success 200 {object} DeletedResponse
// @Failure      400  {object}  HTTPError400
// @Failure      404  {object}  HTTPError500
// @Failure      500  {object}  HTTPError500
// @Router /articles/:id [delete]
func DeleteArticle(c *gin.Context, logger *zap.Logger) {

	responseBody, statusCode, err := utils.MakeHTTPRequest(c, http.MethodDelete, "http://articles-lemonde3-0:8082/articles/"+c.Param("id"), nil)
	if err != nil {
		c.String(statusCode, "Error making the request")
		logger.Error(err.Error())
		return
	}
	c.Data(statusCode, "application/json", responseBody)
}

// RemoveLike godoc
// @Schemes
// @Description Remove a like from an article
// @Tags articles
// @Accept json
// @Produce json
// @Success 200 {object} Article
// @Failure      400  {object}  HTTPError400
// @Failure      404  {object}  HTTPError404
// @Failure      500  {object}  HTTPError500
// @Router /articles/:id/likes [delete]
func RemoveLike(c *gin.Context, logger *zap.Logger) {

	responseBody, statusCode, err := utils.MakeHTTPRequest(c, http.MethodDelete, "http://articles-lemonde3-0:8082/articles/"+c.Param("id")+"/likes", nil)
	if err != nil {
		c.String(statusCode, "Error making the request")
		logger.Error(err.Error())
		return
	}
	c.Data(statusCode, "application/json", responseBody)
}

type HTTPError400 struct {
	Code    int    `json:"code" example:"400"`
	Message string `json:"message" example:"status bad request"`
}

type HTTPError403 struct {
	Code    int    `json:"code" example:"403"`
	Message string `json:"message" example:"forbidden"`
}

type HTTPError404 struct {
	Code    int    `json:"code" example:"404"`
	Message string `json:"message" example:"not found"`
}

type HTTPError409 struct {
	Code    int    `json:"code" example:"409"`
	Message string `json:"message" example:"conflict"`
}

type HTTPError500 struct {
	Code    int    `json:"code" example:"500"`
	Message string `json:"message" example:"internal server error"`
}
