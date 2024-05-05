package articles

import (
	"github.com/gin-gonic/gin"
	"github.com/lib/pq"
	req "main/http"
	"net/http"
)

type ArticleInput struct {
	AuthorName string `json:"authorname" binding:"required"`
	Title   string `json:"title" binding:"required"`
	SubTitle string `json:"subtitle" binding:"required"`
	Content string `json:"content" binding:"required"`
	Topic string `json:"topic" binging:"required"`
	Draft bool `json:"draft" binging:"required"`
}

type EditArticleInput struct {
	Title   string `json:"title" binding:"required"`
	SubTitle string `json:"subtitle" binding:"required"`
	Content string `json:"content" binding:"required"`
	Topic string `json:"topic" binging:"required"`
}

type MultipleArticlesIdsInput struct {
	Ids pq.Int32Array `json:"ids" binging:"required"`
}

type DraftStateInput struct {
	Draft bool `json:"draft" binding:"required"`
}

type MultipleArticlesIds struct {
	Ids []int32 `json:"ids" binding:"required"`
}

type Article struct {
	Id      int32
	UserId  int32
	AuthorName string
	Title   string
	Subtitle string
	Content string
	Topic string
	Draft bool
	Likes   []int32
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
// @Failure      404  {object}  req.HTTPError
// @Failure      500  {object}  req.HTTPError
// @Router /articles [post]
func AddArticle(c *gin.Context) {
	var articlesParams ArticleInput

	if err := c.ShouldBindJSON(&articlesParams); err != nil {
		c.String(http.StatusBadRequest, "Invalid request body")
		return
	}

	responseBody, statusCode, err := req.MakeHTTPRequest(c, http.MethodPost, "http://articles-lemonde3-0:8082/articles", articlesParams)
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
// @Failure      400  {object}  req.HTTPError
// @Failure      500  {object}  req.HTTPError
// @Router /articles/:id/likes [post]
func AddLike(c *gin.Context) {

	responseBody, statusCode, err := req.MakeHTTPRequest(c, http.MethodPost, "http://articles-lemonde3-0:8082/articles/"+c.Param("id")+"/likes", nil)
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
// @Failure      400  {object}  req.HTTPError
// @Failure      500  {object}  req.HTTPError
// @Router /articles [get]
func GetAllArticles(c *gin.Context) {

	responseBody, statusCode, err := req.MakeHTTPRequest(c, http.MethodGet, "http://articles-lemonde3-0:8082/articles", nil)
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
// @Failure      400  {object}  req.HTTPError
// @Failure      500  {object}  req.HTTPError
// @Router /articles/:id [get]
func GetArticle(c *gin.Context) {

	responseBody, statusCode, err := req.MakeHTTPRequest(c, http.MethodGet, "http://articles-lemonde3-0:8082/articles/"+c.Param("id"), nil)
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
// @Failure      400  {object}  req.HTTPError
// @Failure      500  {object}  req.HTTPError
// @Router /articles/me [get]
func GetMyArticles(c *gin.Context) {

	responseBody, statusCode, err := req.MakeHTTPRequest(c, http.MethodGet, "http://articles-lemonde3-0:8082/articles/me", nil)
	if err != nil {
		c.String(statusCode, "Error making the request")
		return
	}
	c.Data(statusCode, "application/json", responseBody)
}

// GetMyArticles godoc
// @Schemes
// @Description Retrived articles created in the last two hours
// @Tags articles
// @Accept json
// @Produce json
// @Success 200 {object} []Article
// @Failure      400  {object}  req.HTTPError
// @Failure      401  {object}  req.HTTPError
// @Failure      500  {object}  req.HTTPError
// @Router /articles/latest/created [get]
func GetLastCreatedArticles(c *gin.Context) {
	responseBody, statusCode, err := req.MakeHTTPRequest(c, http.MethodGet, "http://articles-lemonde3-0:8082/articles/latest/created", nil)
	if err != nil {
		c.String(statusCode, "Error making the request")
		return
	}
	c.Data(statusCode, "application/json", responseBody)
}

// GetMyArticles godoc
// @Schemes
// @Description Retrived articles modified in the last two hours
// @Tags articles
// @Accept json
// @Produce json
// @Success 200 {object} []Article
// @Failure      400  {object}  req.HTTPError
// @Failure      401  {object}  req.HTTPError
// @Failure      500  {object}  req.HTTPError
// @Router /articles/latest/modified [get]
func GetLastModifiedArticles(c *gin.Context) {
	responseBody, statusCode, err := req.MakeHTTPRequest(c, http.MethodGet, "http://articles-lemonde3-0:8082/articles/latest/modified", nil)
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
// @Failure      400  {object}  req.HTTPError
// @Failure      500  {object}  req.HTTPError
// @Router /articles/liked [get]
func GetLikedArticles(c *gin.Context) {

	responseBody, statusCode, err := req.MakeHTTPRequest(c, http.MethodGet, "http://articles-lemonde3-0:8082/articles/liked", nil)
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
// @Failure      400  {object}  req.HTTPError
// @Failure      500  {object}  req.HTTPError
// @Router /articles/:id/likes [get]
func GetLikesInfo(c *gin.Context) {

	responseBody, statusCode, err := req.MakeHTTPRequest(c, http.MethodGet, "http://articles-lemonde3-0:8082/articles/"+c.Param("id")+"/likes", nil)
	if err != nil {
		c.String(statusCode, "Error making the request")
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
// @Param EditArticleInput body EditArticleInput true "Params to edit an article"
// @Success 200 {object} Article
// @Failure      400  {object}  req.HTTPError
// @Failure      500  {object}  req.HTTPError
// @Router /articles [put]
func EditArticle(c *gin.Context) {
	var articlesParams ArticleInput

	if err := c.ShouldBindJSON(&articlesParams); err != nil {
		c.String(http.StatusBadRequest, "Invalid request body")
		return
	}

	responseBody, statusCode, err := req.MakeHTTPRequest(c, http.MethodPut, "http://articles-lemonde3-0:8082/articles/"+c.Param("id"), articlesParams)
	if err != nil {
		c.String(statusCode, "Error making the request")
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
// @Failure      400  {object}  req.HTTPError
// @Failure      500  {object}  req.HTTPError
// @Router /articles [delete]
func DeleteAllArticles(c *gin.Context) {

	responseBody, statusCode, err := req.MakeHTTPRequest(c, http.MethodDelete, "http://articles-lemonde3-0:8082/articles/me", nil)
	if err != nil {
		c.String(statusCode, "Error making the request")
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
// @Failure      400  {object}  req.HTTPError
// @Failure      500  {object}  req.HTTPError
// @Router /articles/:id [delete]
func DeleteArticle(c *gin.Context) {

	responseBody, statusCode, err := req.MakeHTTPRequest(c, http.MethodDelete, "http://articles-lemonde3-0:8082/articles/"+c.Param("id"), nil)
	if err != nil {
		c.String(statusCode, "Error making the request")
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
// @Failure      400  {object}  req.HTTPError
// @Failure      500  {object}  req.HTTPError
// @Router /articles/:id/likes [delete]
func RemoveLike(c *gin.Context) {

	responseBody, statusCode, err := req.MakeHTTPRequest(c, http.MethodDelete, "http://articles-lemonde3-0:8082/articles/"+c.Param("id")+"/likes", nil)
	if err != nil {
		c.String(statusCode, "Error making the request")
		return
	}
	c.Data(statusCode, "application/json", responseBody)
}

// GetArticlesByTopic godoc
// @Schemes
// @Description Get all articles by topic
// @Tags articles
// @Accept json
// @Produce json
// @Success 200 {object} []Article
// @Failure      400  {object}  req.HTTPError
// @Failure      404  {object}  req.HTTPError
// @Failure      500  {object}  req.HTTPError
// @Router /articles/topic/:topic [get]
func GetArticlesByTopic(c *gin.Context) {

	responseBody, statusCode, err := req.MakeHTTPRequest(c, http.MethodGet, "http://articles-lemonde3-0:8082/articles/topic", nil)
	if err != nil {
		c.String(statusCode, "Error making the request")
		return
	}
	c.Data(statusCode, "application/json", responseBody)
}

// GetAllTopics godoc
// @Schemes
// @Description Get all articles by topic
// @Tags articles
// @Accept json
// @Produce json
// @Success 200 {object} []Article
// @Failure      400  {object}  req.HTTPError
// @Failure      500  {object}  req.HTTPError
// @Router /articles/topics [get]
func GetAllTopics(c *gin.Context) {

	responseBody, statusCode, err := req.MakeHTTPRequest(c, http.MethodGet, "http://articles-lemonde3-0:8082/articles/topics", nil)
	if err != nil {
		c.String(statusCode, "Error making the request")
		return
	}
	c.Data(statusCode, "application/json", responseBody)
}

// GetArticlesByTopic godoc
// @Schemes
// @Description Get all topics
// @Tags articles
// @Accept json
// @Produce json
// @Success 200 {object} IsArticleDraftResponse
// @Failure 422 {object} req.HTTPError
// @Failure      500  {object}  req.HTTPError
// @Router /articles/:id/draft [get]
func IsArticleDraft(c *gin.Context) {
	responseBody, statusCode, err := req.MakeHTTPRequest(c, http.MethodGet, "http://articles-lemonde3-0:8082/articles/"+c.Param("id")+"/draft", nil)
	if err != nil {
		c.String(statusCode, "Error making the request")
		return
	}
	c.Data(statusCode, "application/json", responseBody)
}

// ChangeDraftState godoc
// @Schemes
// @Description Change the state of a draft
// @Tags articles
// @Accept json
// @Produce json
// @Success 200 {object} Article
// @Failure      404  {object}  req.HTTPError
// @Failure      500  {object}  req.HTTPError
// @Router /articles/:id/draft [put]
func ChangeDraftState(c *gin.Context) {
	var changeDraftStateParams DraftStateInput

	if err := c.ShouldBindJSON(&changeDraftStateParams); err != nil {
		c.String(http.StatusBadRequest, "Invalid request body")
		return
	}

	responseBody, statusCode, err := req.MakeHTTPRequest(c, http.MethodPut, "http://articles-lemonde3-0:8082/articles/"+c.Param("id")+"/draft", changeDraftStateParams)
	if err != nil {
		c.String(statusCode, "Error making the request")
		return
	}
	c.Data(statusCode, "application/json", responseBody)
}

// GetArticlesByKeyword godoc
// @Schemes
// @Description Find Articles by a keyword and search if it correspond
// @Tags articles
// @Accept json
// @Produce json
// @Success 200 {object} []Article
// @Failure      401  {object}  req.HTTPError
// @Failure      404  {object}  req.HTTPError
// @Failure      500  {object}  req.HTTPError
// @Router /articles/search/:keyword [post]
func GetArticlesByKeyword(c *gin.Context) {
	responseBody, statusCode, err := req.MakeHTTPRequest(c, http.MethodGet, "http://articles-lemonde3-0:8082/articles/search/"+c.Param("keyword"), nil)
	if err != nil {
		c.String(statusCode, "Error making the request")
		return
	}
	c.Data(statusCode, "application/json", responseBody)
}

// GetArticlesTopic godoc
// @Schemes
// @Description Get the topic of a Article
// @Tags articles
// @Accept json
// @Produce json
// @Success 200 {object} GetArticlesTopicRespond
// @Failure      404  {object}  req.HTTPError
// @Failure      500  {object}  req.HTTPError
// @Router /articles/:id/topic [get]
func GetArticlesTopic(c *gin.Context) {
	responseBody, statusCode, err := req.MakeHTTPRequest(c, http.MethodGet, "http://articles-lemonde3-0:8082/articles/"+c.Param("id")+"/topic", nil)
	if err != nil {
		c.String(statusCode, "Error making the request")
		return
	}
	c.Data(statusCode, "application/json", responseBody)
}

// GetMultipleArticlesFromIds godoc
// @Schemes
// @Description Get Articles by there Ids
// @Tags articles
// @Accept json
// @Produce json
// @Param MultipleArticlesIdsInput body MultipleArticlesIdsInput true "	Ids of the Articles research"
// @Success 200 {object} []Article
// @Failure      404  {object}  req.HTTPError
// @Failure      500  {object}  req.HTTPError
// @Router /articles/multiples [post]
func GetMultipleArticlesFromIds(c *gin.Context) {
	var multipleArticlesIds MultipleArticlesIds

	if err := c.ShouldBindJSON(&multipleArticlesIds); err != nil {
		c.String(http.StatusBadRequest, "Invalid request body")
		return
	}

	responseBody, statusCode, err := req.MakeHTTPRequest(c, http.MethodPost, "http://articles-lemonde3-0:8082/articles/multiples", multipleArticlesIds)
	if err != nil {
		c.String(statusCode, "Error making the request")
		return
	}
	c.Data(statusCode, "application/json", responseBody)
}

type GetArticlesTopicRespond struct {
	Topic string `json:"true" example:"TestTopic"`
}

type IsArticleDraftResponse struct {
	Ok string `json:"true" example:"Article is draft"`
}
