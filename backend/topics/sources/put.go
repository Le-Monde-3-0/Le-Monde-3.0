package sources

import (
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
	"net/http"
)

type changedTopic struct {
	name string
}

func PutTopics(c *gin.Context, db *gorm.DB) {
	topic := new(Topic)

	changedTopic := changedTopic{}

	if err := c.Bind(&changedTopic); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if changedTopic.name == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "topic must have a name"})
		return
	}

	result := db.Where(Topic{name: changedTopic.name}).Find(&topic)
	if result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": result.Error})
		return
	} else if topic.name == "" {
		c.JSON(http.StatusNotFound, gin.H{"error": "Topic not found"})
		return
	}

	topic.name = changedTopic.name

	db.Save(&topic)
	c.JSON(http.StatusOK, topic)
}