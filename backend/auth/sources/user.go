package auth

import (
	"html"
	"net/http"
	"strconv"
	"strings"
	"time"
	utils "github.com/Le-Monde-3-0/utils/sources"
	"github.com/gin-gonic/gin"
	"golang.org/x/crypto/bcrypt"
	"gorm.io/gorm"
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

type UserChangePassword struct {
	Email       string `json:"email" binding:"required"`
	Password    string `json:"password" binding:"required"`
	NewPassword string `json:"newpassword" binding:"required"`
}

func CheckUser(username string, password string, db *gorm.DB) (bool, error) {
	var err error

	u := new(User)

	err = db.Model(User{}).Where("email = ?", username).Take(&u).Error

	if err != nil {
		return false, err
	}

	err = VerifyPassword(password, u.Password)

	if err != nil && err == bcrypt.ErrMismatchedHashAndPassword {
		return false, err
	}
	return true, err
}

func ChangeUserPassword(c *gin.Context, db *gorm.DB) {
	var input UserChangePassword

	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid Arguments"})
		return
	}

	_, err := utils.GetUserId(c)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	u := new(User)

	u.Email = input.Email
	u.Password = input.Password

	check, err := CheckUser(u.Email, u.Password, db)

	if err != nil || check == false {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Email or Password is incorrect."})
		return
	}

	err = db.Model(User{}).Where("email = ?", u.Email).Take(&u).Error

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error while fetching database"})
	}

	newhashedPassword, err := bcrypt.GenerateFromPassword([]byte(input.NewPassword), bcrypt.DefaultCost)

	u.Password = string(newhashedPassword)

	db.Save(&u)

	c.JSON(http.StatusCreated, gin.H{"created": "User password changed"})
}

type UserChangeUsername struct {
	Email       string `json:"email" binding:"required"`
	Password    string `json:"password" binding:"required"`
	NewUsername string `json:"newusername" binding:"required"`
}

type ChangeArticlesAuthornameObject struct {
	Oldname string `json:"oldname"`
	Newname string `json:"newname"`
}

func ChangeUsername(c *gin.Context, db *gorm.DB) {
	var input UserChangeUsername

	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid Arguments"})
		return
	}

	_, err := utils.GetUserId(c)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	u := new(User)

	u.Email = input.Email
	u.Password = input.Password

	check, err := CheckUser(u.Email, u.Password, db)

	if err != nil || !check {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Email or Password is incorrect."})
		return
	}

	err = db.Model(User{}).Where("email = ?", u.Email).Take(&u).Error

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error while fetching database"})
	}

	var body =ChangeArticlesAuthornameObject{}
	body.Oldname = u.Username
	body.Newname = input.NewUsername

	utils.MakeHTTPRequest(c, http.MethodPut, "http://articles-lemonde3-0:8082/articles/authorname", body)

	u.Username = input.NewUsername

	db.Save(&u)

	c.JSON(http.StatusCreated, gin.H{"created": "User name changed"})
}

type UserChangeUserMail struct {
	Email    string `json:"email" binding:"required"`
	Password string `json:"password" binding:"required"`
	NewEmail string `json:"newemail" binding:"required"`
}

func ChangeUserMail(c *gin.Context, db *gorm.DB) {
	var input UserChangeUserMail

	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid Arguments"})
		return
	}

	_, err := utils.GetUserId(c)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	u := new(User)

	u.Email = input.Email
	u.Password = input.Password

	check, err := CheckUser(u.Email, u.Password, db)

	if err != nil || check == false {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Email or Password is incorrect."})
		return
	}

	err = db.Model(User{}).Where("email = ?", u.Email).Take(&u).Error

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error while fetching database"})
	}

	u.Email = input.NewEmail

	db.Save(&u)

	c.JSON(http.StatusCreated, gin.H{"created": "User mail changed"})
}

func GetUserInfoByUsername(c *gin.Context, db *gorm.DB) {
	user := new(User)

	var username = c.Param("username")

	var _ = db.Model(User{}).Where("username = ?", username).Take(&user).Error

	if user.Username == "" {
		c.JSON(http.StatusNotFound, gin.H{"error": "No user with this username"})
	}

	c.JSON(http.StatusOK, user)
}
