package model

import (
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
	"net/http"
)

/*
ExampleId function for model
*/
func ExampleId(c *gin.Context, db *gorm.DB) {
	c.JSON(http.StatusOK, gin.H{"exampleId": "model"})
}
