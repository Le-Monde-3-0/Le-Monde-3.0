package model

import (
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
	"net/http"
)

/*
Example function for model
*/
func Example(c *gin.Context, db *gorm.DB) {
	c.JSON(http.StatusOK, gin.H{"example": "model"})
}
