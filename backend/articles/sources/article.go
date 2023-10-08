package sources

import (
	"errors"
	"net/http"
	"os"
	"strings"

	"github.com/dgrijalva/jwt-go"
	"github.com/gin-gonic/gin"
	"github.com/lib/pq"
	"gorm.io/gorm"
)

type Article struct {
	gorm.Model
	Id      int32         `json:"id"`
	UserId  int32         `json:"userId"`
	Title   string        `json:"title"`
	Content string        `json:"content"`
	Likes   pq.Int32Array `json:"likes"gorm:"type:integer[]"`
}

func getUserId(c *gin.Context) (int32, error) {

	bearerToken := c.Request.Header.Get("Authorization")
	tokenString := ""

	if len(strings.Split(bearerToken, " ")) == 2 {
		tokenString = strings.Split(bearerToken, " ")[1]
	} else {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid token format"})
	}

	tokenPure, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
		return []byte(os.Getenv("secret_key")), nil
	})

	if err != nil {
		return 0, err
	}

	if claims, ok := tokenPure.Claims.(jwt.MapClaims); ok && tokenPure.Valid {
		userID, _ := claims["user_id"].(float64)
		return int32(userID), nil
	} else {
		return 0, errors.New("invalid token")
	}
}
