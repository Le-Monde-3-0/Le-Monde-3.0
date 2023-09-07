package sources

import (
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
	"net/http"
)

type deleteTopic struct {
	name string
}

func DeleteTopics(c *gin.Context, db *gorm.DB) {
	topic := new(Topic)

	deleteTopic := deleteTopic{}

	if err := c.Bind(&deleteTopic); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if deleteTopic.name == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "no topic name given"})
		return
	}

	result := db.Where(Topic{name: deleteTopic.name}).Delete(&Topic{})
	if result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": result.Error})
		return
	} else if topic.name == "" {
		c.JSON(http.StatusNotFound, gin.H{"error": "Topic not found"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"delete": "topic has been successfully deleted"})
}