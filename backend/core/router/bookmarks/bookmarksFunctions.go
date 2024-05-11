package core

import (
	utils "github.com/Le-Monde-3-0/utils/sources"
	"github.com/gin-gonic/gin"
	"go.uber.org/zap"
	"net/http"
)

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

type BookmarkInput struct {
	Title string `json:"title" binding:"required"`
	Description string `json:"description" bingind:"required"`
}

type Bookmark struct {
	Id       int32
	UserId   int32
	Title    string
	Description string
	Articles []int32
}

type GetBookmarkObject struct {
	Id       int32
	UserId   int32
	Title    string
	Description string
	Articles []Article	
}

type DeletedResponse struct {
	Delete string `json:"delete" example:"all articles have been successfully deleted"`
}

// AddBookmark godoc
// @Schemes
// @Description Add a bookmark
// @Tags bookmarks
// @Accept json
// @Produce json
// @Param BookmarkInput body BookmarkInput true "Params to create a bookmark"
// @Success 200 {object} Bookmark
// @Failure      400  {object}  HTTPError400
// @Failure      409  {object}  HTTPError409
// @Failure      500  {object}  HTTPError500
// @Router /bookmarks [post]
func AddBookmark(c *gin.Context, logger *zap.Logger) {
	var bookmarksParams BookmarkInput

	if err := c.ShouldBindJSON(&bookmarksParams); err != nil {
		c.String(http.StatusBadRequest, "Invalid request body")
		return
	}

	responseBody, statusCode, err := utils.MakeHTTPRequest(c, http.MethodPost, "http://bookmarks-lemonde3-0:8084/bookmarks", bookmarksParams)
	if err != nil {
		logger.Error(err.Error())
		c.String(statusCode, "Error making the request")
		return
	}

	c.Data(statusCode, "application/json", responseBody)
}

// AddArticleInBookmark godoc
// @Schemes
// @Description Add an article in a bookmark
// @Tags bookmarks
// @Accept json
// @Produce json
// @Success 200 {object} Bookmark
// @Failure      400  {object}  HTTPError400
// @Failure      404  {object}  HTTPError404
// @Failure      500  {object}  HTTPError500
// @Router /bookmarks/:id/articles/:id-article [post]
func AddArticleInBookmark(c *gin.Context, logger *zap.Logger) {

	responseBody, statusCode, err := utils.MakeHTTPRequest(c, http.MethodPost, "http://bookmarks-lemonde3-0:8084/bookmarks/"+c.Param("id")+"/articles/"+c.Param("id-article"), nil)
	if err != nil {
		logger.Error(err.Error())
		c.String(statusCode, "Error making the request")
		return
	}

	c.Data(statusCode, "application/json", responseBody)
}

// ChangeBookmarkVisibility godoc
// @Schemes
// @Description Change the visibility of a bookmark
// @Tags bookmarks
// @Accept json
// @Produce json
// @Success 200 {object} Bookmark
// @Failure      400  {object}  HTTPError400
// @Failure      404  {object}  HTTPError404
// @Failure      500  {object}  HTTPError500
// @Router /bookmarks/:id/visibility [post]
func ChangeBookmarkVisibility(c *gin.Context, logger *zap.Logger) {

	responseBody, statusCode, err := utils.MakeHTTPRequest(c, http.MethodPost, "http://bookmarks-lemonde3-0:8084/bookmarks/"+c.Param("id")+"/visibility", nil)
	if err != nil {
		logger.Error(err.Error())
		c.String(statusCode, "Error making the request")
		return
	}

	c.Data(statusCode, "application/json", responseBody)
}

// GetAllBookmarks godoc
// @Schemes
// @Description Retrieve the connected user bookmarks
// @Tags bookmarks
// @Accept json
// @Produce json
// @Success 200 {object} []Bookmark
// @Failure      400  {object}  HTTPError400
// @Failure      404  {object}  HTTPError404
// @Failure      500  {object}  HTTPError500
// @Router /bookmarks [get]
func GetAllBookmarks(c *gin.Context, logger *zap.Logger) {

	responseBody, statusCode, err := utils.MakeHTTPRequest(c, http.MethodGet, "http://bookmarks-lemonde3-0:8084/bookmarks", nil)
	if err != nil {
		logger.Error(err.Error())
		c.String(statusCode, "Error making the request")
		return
	}

	c.Data(statusCode, "application/json", responseBody)
}

// GetBookmark godoc
// @Schemes
// @Description Retrieve the connected user bookmark
// @Tags bookmarks
// @Accept json
// @Produce json
// @Success 200 {object} Bookmark
// @Failure      400  {object}  HTTPError400
// @Failure      403  {object}  HTTPError403
// @Failure      404  {object}  HTTPError404
// @Failure      500  {object}  HTTPError500
// @Router /bookmarks/:id [get]
func GetBookmark(c *gin.Context, logger *zap.Logger) {

	responseBody, statusCode, err := utils.MakeHTTPRequest(c, http.MethodGet, "http://bookmarks-lemonde3-0:8084/bookmarks/"+c.Param("id"), nil)
	if err != nil {
		logger.Error(err.Error())
		c.String(statusCode, "Error making the request")
		return
	}

	c.Data(statusCode, "application/json", responseBody)
}

// GetAllArticlesBookmark godoc
// @Schemes
// @Description Retrieve the articles of a given bookmark
// @Tags bookmarks
// @Accept json
// @Produce json
// @Success 200 {object} []Article
// @Failure      400  {object}  HTTPError400
// @Failure      404  {object}  HTTPError404
// @Failure      500  {object}  HTTPError500
// @Router /bookmarks/:id/articles [get]
func GetAllArticlesBookmark(c *gin.Context, logger *zap.Logger) {

	responseBody, statusCode, err := utils.MakeHTTPRequest(c, http.MethodGet, "http://bookmarks-lemonde3-0:8084/bookmarks/"+c.Param("id")+"/articles", nil)
	if err != nil {
		logger.Error(err.Error())
		c.String(statusCode, "Error making the request")
		return
	}

	c.Data(statusCode, "application/json", responseBody)
}

// EditBookmark godoc
// @Schemes
// @Description Edit a bookmark
// @Tags bookmarks
// @Accept json
// @Produce json
// @Param BookmarkInput body BookmarkInput true "Params to edit a bookmark"
// @Success 200 {object} Bookmark
// @Failure      400  {object}  HTTPError400
// @Failure      403  {object}  HTTPError403
// @Failure      404  {object}  HTTPError404
// @Failure      500  {object}  HTTPError500
// @Router /bookmarks/:id [put]
func EditBookmark(c *gin.Context, logger *zap.Logger) {
	var bookmarksParams BookmarkInput

	if err := c.ShouldBindJSON(&bookmarksParams); err != nil {
		logger.Error(err.Error())
		c.String(http.StatusBadRequest, "Invalid request body")
		return
	}

	responseBody, statusCode, err := utils.MakeHTTPRequest(c, http.MethodPut, "http://bookmarks-lemonde3-0:8084/bookmarks/"+c.Param("id"), bookmarksParams)
	if err != nil {
		logger.Error(err.Error())
		c.String(statusCode, "Error making the request")
		return
	}

	c.Data(statusCode, "application/json", responseBody)
}

// DeleteAllBookmarks godoc
// @Schemes
// @Description Delete the connected user bookmarks
// @Tags bookmarks
// @Accept json
// @Produce json
// @Success 200 {object} DeletedResponse
// @Failure      400  {object}  HTTPError400
// @Failure      404  {object}  HTTPError404
// @Failure      500  {object}  HTTPError500
// @Router /bookmarks [delete]
func DeleteAllBookmarks(c *gin.Context, logger *zap.Logger) {

	responseBody, statusCode, err := utils.MakeHTTPRequest(c, http.MethodDelete, "http://bookmarks-lemonde3-0:8084/bookmarks", nil)
	if err != nil {
		c.String(statusCode, "Error making the request")
		logger.Error(err.Error())
		return
	}

	c.Data(statusCode, "application/json", responseBody)
}

// DeleteBookmark godoc
// @Schemes
// @Description Delete the connected user bookmark
// @Tags bookmarks
// @Accept json
// @Produce json
// @Success 200 {object} DeletedResponse
// @Failure      400  {object}  HTTPError400
// @Failure      404  {object}  HTTPError404
// @Failure      500  {object}  HTTPError500
// @Router /bookmarks/:id [delete]
func DeleteBookmark(c *gin.Context, logger *zap.Logger) {

	responseBody, statusCode, err := utils.MakeHTTPRequest(c, http.MethodDelete, "http://bookmarks-lemonde3-0:8084/bookmarks/"+c.Param("id"), nil)
	if err != nil {
		c.String(statusCode, "Error making the request")
		logger.Error(err.Error())
		return
	}

	c.Data(statusCode, "application/json", responseBody)
}

// DeleteAllArticlesBookmark godoc
// @Schemes
// @Description Remove all articles of a bookmark
// @Tags bookmarks
// @Accept json
// @Produce json
// @Success 200 {object} Bookmark
// @Failure      400  {object}  HTTPError400
// @Failure      404  {object}  HTTPError404
// @Failure      500  {object}  HTTPError500
// @Router /bookmarks/:id/articles [delete]
func DeleteAllArticlesBookmark(c *gin.Context, logger *zap.Logger) {

	responseBody, statusCode, err := utils.MakeHTTPRequest(c, http.MethodDelete, "http://bookmarks-lemonde3-0:8084/bookmarks/"+c.Param("id")+"/articles", nil)
	if err != nil {
		c.String(statusCode, "Error making the request")
		logger.Error(err.Error())
		return
	}

	c.Data(statusCode, "application/json", responseBody)
}

// DeleteArticleBookmark godoc
// @Schemes
// @Description Remove an article of a bookmark
// @Tags bookmarks
// @Accept json
// @Produce json
// @Success 200 {object} Bookmark
// @Failure      400  {object}  HTTPError400
// @Failure      404  {object}  HTTPError404
// @Failure      500  {object}  HTTPError500
// @Router /bookmarks/:id/articles/id-article [delete]
func DeleteArticleBookmark(c *gin.Context, logger *zap.Logger) {

	responseBody, statusCode, err := utils.MakeHTTPRequest(c, http.MethodDelete, "http://bookmarks-lemonde3-0:8084/bookmarks/"+c.Param("id")+"/"+c.Param("id-article"), nil)
	if err != nil {
		c.String(statusCode, "Error making the request")
		logger.Error(err.Error())
		return
	}

	c.Data(statusCode, "application/json", responseBody)
}
