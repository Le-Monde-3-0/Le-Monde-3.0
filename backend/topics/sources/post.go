package sources

import (
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
	"net/http"
)

func AddTopics(c *gin.Context, db *gorm.DB) {
	topic := new(Topic)

	if err := c.Bind(&topic); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if topic.name == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "topic must have a name"})
		return
	}

	result := db.Create(&topic)

	if result.Error != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": result.Error})
		return
	}
	c.JSON(http.StatusCreated, topic)
}