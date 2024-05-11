package bookmarks

import (
	"errors"
	utils "github.com/Le-Monde-3-0/utils/sources"
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
	"net/http"
	"strconv"
)

type EditedBookmark struct {
	Title string `json:"title"`
	Desccription string `json:"description"`
}

/*
EditBookmark edits a bookmark
*/
func EditBookmark(c *gin.Context, db *gorm.DB) {
	bookmark := new(Bookmark)

	userId, err := utils.GetUserId(c)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	editedBookmark := EditedBookmark{}
	if err := c.ShouldBindJSON(&editedBookmark); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid arguments"})
		return
	}

	bookmarkId, err := strconv.ParseInt(c.Param("id"), 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"get": "Bookmark id could not be retrieved"})
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
	}
	if bookmark.UserId != userId {
		c.JSON(http.StatusForbidden, gin.H{"error": "you are not allowed to edit this bookmark"})
		return
	}
	if (editedBookmark.Title != "") {
		bookmark.Title = editedBookmark.Title
	}
	bookmark.Description = editedBookmark.Desccription

	db.Save(&bookmark)
	c.JSON(http.StatusOK, bookmark)
}
