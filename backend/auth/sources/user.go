package auth

import (
	utils "github.com/Le-Monde-3-0/utils/sources"
	"github.com/gin-gonic/gin"
	"golang.org/x/crypto/bcrypt"
	"gorm.io/gorm"
	"html"
	"net/http"
	"strconv"
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
	IsPrivate bool
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
		c.JSON(http.StatusConflict, gin.H{"error": "an account with this username already exists"})
		return
	}
	if err := db.Where("email = ?", email).First(existingUser).Error; err == nil {
		c.JSON(http.StatusConflict, gin.H{"error": "an account with this email already exists"})
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
	user.IsPrivate = false

	result := db.Create(&user)
	if result.Error != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": result.Error})
	} else {
		c.JSON(http.StatusCreated, gin.H{"created": "User created successfully"})
	}
}

/*
GetMyInfo returns the information of the connected user
*/
func GetMyInfo(c *gin.Context, db *gorm.DB) {
	user := new(User)

	userId, err := utils.GetUserId(c)
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

/*
GetUser returns the information of a user
*/
func GetUser(c *gin.Context, db *gorm.DB) {
	user := new(User)

	userId, err := utils.GetUserId(c)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	id, err := strconv.ParseInt(c.Param("id"), 10, 64)
	if err != nil {
		panic(err)
	}

	if id == int64(userId) {
		GetMyInfo(c, db)
		return
	}

	result := db.Where(User{Id: uint(id)}).Find(&user)
	if result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": result.Error})
		return
	}

	if user.Id == 0 || user.IsPrivate {
		c.JSON(http.StatusForbidden, gin.H{"error": "user is private"})
		return
	}
	c.JSON(http.StatusOK, user)
}

/*
ChangeUserVisibility allows to switch the visibility of the connected user (either public or private)
*/
func ChangeUserVisibility(c *gin.Context, db *gorm.DB) {
	user := new(User)

	userId, err := utils.GetUserId(c)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	result := db.Where(User{Id: uint(userId)}).Find(&user)
	if result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": result.Error})
		return
	}

	user.IsPrivate = !user.IsPrivate

	db.Save(&user)

	c.JSON(http.StatusOK, user)
}
