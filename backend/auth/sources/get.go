package auth

import (
	"encoding/json"
	"fmt"
	"net/http"
	"strconv"

	adtos "github.com/Le-Monde-3-0/articles_dtos/sources"
	utils "github.com/Le-Monde-3-0/utils/sources"
	"github.com/gin-gonic/gin"
	"github.com/lib/pq"
	"gorm.io/gorm"
)

func GetUserBookmarks(c *gin.Context, userId int) []UserBookmarks{
	var bookmarks []adtos.BookmarksResponse
	var userBookmarks []UserBookmarks

	responseBody, _, err := utils.MakeHTTPRequest(c, http.MethodGet, "http://bookmarks-lemonde3-0:8084/bookmarks/user/"+strconv.Itoa(userId), nil)
	if err != nil {
		return []UserBookmarks{}
	}

	err = json.Unmarshal(responseBody, &bookmarks)
	if err != nil {
		return []UserBookmarks{}
	}

	if len(bookmarks) == 0 {
		return []UserBookmarks{}
	}

	for _,bookmark := range bookmarks {
		var userBookmark UserBookmarks
		userBookmark.Number = pq.Int32Array{}

		for _, article := range bookmark.Articles {
			userBookmark.Number = append(userBookmark.Number, int32(article.Id))
			fmt.Println(article)
		}

		userBookmark.Label = bookmark.Title
		userBookmarks = append(userBookmarks, userBookmark)
	}

	return userBookmarks
}

/*
GetMyInfo returns the information of the connected user
*/
func GetMyInfo(c *gin.Context, db *gorm.DB) {
	user := new(User)

	userId, err := utils.GetUserId(c)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	result := db.Where(User{Id: uint(userId)}).Find(&user)
	if result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": result.Error})
		return
	}

	userBookmarks := GetUserBookmarks(c, int(userId))

	c.JSON(http.StatusOK, FormatUserStruct(user, userBookmarks))
}

/*
GetUser returns the information of a user
*/
func GetUser(c *gin.Context, db *gorm.DB) {
	user := new(User)

	userId, err := utils.GetUserId(c)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	id, err := strconv.ParseInt(c.Param("id"), 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Id could not be retrieved"})
		return
	}

	result := db.Where(User{Id: uint(id)}).Find(&user)
	if result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": result.Error})
		return
	}

	if user.Id == 0 {
		c.JSON(http.StatusNotFound, gin.H{"error": "User not found"})
		return
	}

	if !user.Public && userId != int32(user.Id) {
		c.JSON(http.StatusForbidden, gin.H{"error": "User is status is private"})
		return
	}

	userBookmarks := GetUserBookmarks(c, int(id))

	c.JSON(http.StatusOK, FormatUserStruct(user, userBookmarks))
}

func GetUserInfoByUsername(c *gin.Context, db *gorm.DB) {
	user := new(User)

	userId, err := utils.GetUserId(c)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	var username = c.Param("username")

	if username == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Username could not be retrieved"})
		return
	}

	var _ = db.Model(User{}).Where("username = ?", username).Take(&user).Error

	if user.Username == "" {
		c.JSON(http.StatusNotFound, gin.H{"error": "User not found"})
		return
	}

	if !user.Public && userId != int32(user.Id) {
		c.JSON(http.StatusForbidden, gin.H{"error": "User is status is private"})
		return
	}

	userBookmarks := GetUserBookmarks(c, int(user.Id))

	c.JSON(http.StatusOK, FormatUserStruct(user, userBookmarks))
}
