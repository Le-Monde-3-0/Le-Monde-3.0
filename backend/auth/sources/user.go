package auth

import (
	"errors"
	"github.com/dgrijalva/jwt-go"
	"github.com/gin-gonic/gin"
	"golang.org/x/crypto/bcrypt"
	"gorm.io/gorm"
	"html"
	"net/http"
	"os"
	"strings"
	"time"
)

type User struct {
	Id        uint `gorm:"primarykey"`
	CreatedAt time.Time
	UpdatedAt time.Time
	DeletedAt gorm.DeletedAt `gorm:"index"`
	Email     string
	Username  string
	Password  string
}

type ReceiveUser struct {
	Email string `json:"email"`
}

/*
AddUser adds a new User object in the database
*/
func AddUser(email string, username string, password string, c *gin.Context, db *gorm.DB) {
	existingUser := new(User)
	if err := db.Where("username = ?", username).First(existingUser).Error; err == nil {
		c.JSON(http.StatusConflict, gin.H{"error": "Username already exists"})
		return
	}

	user := new(User)
	user.Email = html.EscapeString(strings.TrimSpace(email))
	user.Username = html.EscapeString(strings.TrimSpace(username))
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)

	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	user.Password = string(hashedPassword)

	result := db.Create(&user)
	if result.Error != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": result.Error})
	} else {
		c.JSON(http.StatusCreated, gin.H{"created": "User created successfully"})
	}
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

/*
GetMyInfo returns the information of the connected user
*/
func GetMyInfo(c *gin.Context, db *gorm.DB) {
	user := new(User)

	userId, err := getUserId(c)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	result := db.Where(User{Id: uint(userId)}).Find(&user)
	if result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": result.Error})
		return
	}
	c.JSON(http.StatusOK, user)
}
