package articles

import (
	utils "github.com/Le-Monde-3-0/utils/sources"
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
	"net/http"
	"strconv"
)

type EditedArticle struct {
	Title    string `json:"title"`
	Subtitle string `json:"subtitle"`
	Content  string `json:"content"`
	Topic    string `json:"topic"`
}

/*
EditArticle allows a user to edit one of its article
*/
func EditArticle(c *gin.Context, db *gorm.DB) {
	article := new(Article)

	userId, err := utils.GetUserId(c)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	editedArticle := EditedArticle{}
	if err := c.ShouldBindJSON(&editedArticle); err != nil {
		c.JSON(400, gin.H{"error": "Invalid arguments"})
		return
	}

	id, err := strconv.ParseInt(c.Param("id"), 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"put": "Article id could not be retrieved"})
		return
	}

	result := db.Where(Article{UserId: userId, Id: uint(id)}).Find(&article)
	if result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": result.Error})
		return
	} else if article.Title == "" {
		c.JSON(http.StatusNotFound, gin.H{"error": "Article not found or was not created by the current user"})
		return
	}
	article.Content = editedArticle.Content
	article.Title = editedArticle.Title
	// TODO : cases when the user wish to juste delete the subtitle or topic ? add routes delete topic delete subtitle ?
	article.Subtitle = editedArticle.Subtitle
	article.Topic = editedArticle.Topic

	db.Save(&article)

	if hasUserLikedArticle(id, article) {
		article.HasConnectedUserLiked = true
	}
	article.Likes = getRecordLike(article.Id, db)
	article.Views = getRecordView(article.Id, db)

	c.JSON(http.StatusOK, article)
}

func ChangeDraftState(c *gin.Context, db *gorm.DB) {
	article := new(Article)

	id, err := strconv.ParseInt(c.Param("id"), 10, 64)
	if err != nil {
		panic(err)
	}

	result := db.Where(Article{Id: uint(id)}).Find(&article)

	if result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error interacting with database"})
		return
	} else if article.Title == "" {
		c.JSON(http.StatusNotFound, gin.H{"error": "Article not found or was not created by the current user"})
		return
	}

	article.Draft = !article.Draft
	article.Likes = getRecordLike(article.Id, db)
	article.Views = getRecordView(article.Id, db)
	db.Save(&article)
	
	c.JSON(http.StatusOK, article)
}

type ChangeArticlesAuthornameObject struct {
	Oldname string `json:"oldname" required`
	Newname string `json:"newname" required`
}

func ChangeArticlesAuthorname(c *gin.Context, db *gorm.DB) {
	articles := new([]Article)

	_, err := utils.GetUserId(c)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	obj := ChangeArticlesAuthornameObject{}

	if err := c.ShouldBindJSON(&obj); err != nil {
		c.JSON(400, gin.H{"error": "Invalid arguments"})
		return
	}

	result := db.Where(Article{AuthorName: obj.Oldname}).Find(&articles)
	if result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": result.Error})
		return
	} else if len(*articles) == 0 {
		c.JSON(http.StatusNotFound, gin.H{"error": "Articles not found with this author name"})
		return
	}

	for _, article := range *articles {
		article.AuthorName = obj.Newname
		db.Save(&article)
	}

	c.JSON(http.StatusOK, gin.H{"message": "Author names updated successfully"})
}