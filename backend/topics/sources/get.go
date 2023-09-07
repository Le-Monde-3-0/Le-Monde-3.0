package sources

import (
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
	"net/http"
)

type getTopic struct {
	name string
}

func GetTopics(c *gin.Context, db *gorm.DB) {
	topic := new(Topic)

	getTopic := getTopic{}

	if err := c.Bind(&getTopic); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	result := db.Where(Topic{name: getTopic.name}).Find(&topic)
	if result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": result.Error})
		return
	} else if topic.name == "" {
		c.JSON(http.StatusNotFound, gin.H{"error": "Topic not found"})
		return
	}

	c.JSON(http.StatusOK, topic)
}