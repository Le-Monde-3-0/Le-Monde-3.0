package articles

import (
	utils "github.com/Le-Monde-3-0/utils/sources"
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
	"net/http"
	"strconv"
)

/*
DeleteAllArticles deletes all the articles of the connected user
*/
func DeleteAllArticles(c *gin.Context, db *gorm.DB) {

	userId, err := utils.GetUserId(c)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	result := db.Where(Article{UserId: userId}).Delete(&Article{})
	if result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error interacting with database"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"delete": "All articles have been successfully deleted"})
}

/*
DeleteArticle deletes one of the articles of the connected user
*/
func DeleteArticle(c *gin.Context, db *gorm.DB) {
	userId, err := utils.GetUserId(c)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	id, err := strconv.ParseInt(c.Param("id"), 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"delete": "Article id could not be retrieved"})
		return
	}
	result := db.Where(Article{UserId: userId, Id: uint(id)}).Delete(&Article{})
	if result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error interacting with database"})
		return
	} else if result.RowsAffected == 0 {
		c.JSON(http.StatusNotFound, gin.H{"error": "Article not found or was not created by the current user"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"delete": "Article has been successfully deleted"})
}

func delRecordLike(articleID uint, key int32, db *gorm.DB) bool {
	var records []RecordLike

	result := db.Where(RecordLike{ArticleID: articleID}).Find(&records)
	if result.Error != nil {
		return false
	}

	for _, val := range records {
		if val.UserId == key {
			db.Where(RecordLike{UserId: val.UserId}).Delete(&RecordLike{})
			return true
		}
	}
	return false
}

/*
RemoveLike removes the like of a given post from the connected user
*/
func RemoveLike(c *gin.Context, db *gorm.DB) {
	article := new(Article)

	userId, err := utils.GetUserId(c)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	id, err := strconv.ParseInt(c.Param("id"), 10, 64)
	if err != nil {
		panic(err)
	}

	result := db.Where(Article{Id: uint(id)}).Find(&article)
	if result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error interacting with database"})
		return
	} else if article.Title == "" {
		c.JSON(http.StatusNotFound, gin.H{"error": "article not found"})
		return
	}

	if !delRecordLike(article.Id, userId, db) {
		c.JSON(http.StatusNotFound, gin.H{"error": "article not found"})
	}

	article.Likes = getRecordLike(article.Id, db)
	article.Views = getRecordView(article.Id, db)
	// for _, value := range article.Likes {
	// 	if value.UserId != userId {
	// 		article.Likes[i] = value
	// 		i++
	// 	}
	// }
	// article.Likes = article.Likes[:i]
	// db.Save(&article)
	c.JSON(http.StatusOK, article)
}
