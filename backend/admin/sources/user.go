package admin

import (
	"github.com/gin-gonic/gin"
	"golang.org/x/crypto/bcrypt"
	"gorm.io/gorm"
	"html"
	"net/http"
	"strings"
)

type User struct {
	gorm.Model
	Id       int32
	Email    string
	Username string
	Password string
}

type ReceiveUser struct {
	Email string `json:"email"`
}

/*
AddUser adds a new User object in the database
*/
func AddUser(email string, username string, password string, c *gin.Context, db *gorm.DB) {
	user := new(User)

	user.Email = html.EscapeString(strings.TrimSpace(email))
	user.Username = html.EscapeString(strings.TrimSpace(username))
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)

	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error})
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
