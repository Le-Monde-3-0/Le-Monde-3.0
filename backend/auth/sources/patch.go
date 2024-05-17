package auth

import (
	"net/http"

	utils "github.com/Le-Monde-3-0/utils/sources"
	"github.com/gin-gonic/gin"
	"golang.org/x/crypto/bcrypt"
	"gorm.io/gorm"
)

type UserVisibility struct {
	Public *bool `json:"public"" binding:"required"`
}

/*
ChangeUserVisibility allows to switch the visibility of the connected user (either public or private)
*/
func ChangeUserVisibility(c *gin.Context, db *gorm.DB) {
	var input UserVisibility

	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request body"})
		return
	}

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

	user.Public = *input.Public

	db.Save(&user)

	c.JSON(http.StatusOK, gin.H{"ok": "User visibility changed"})
}

type UserChangePassword struct {
	CurrentPassword string `json:"current_password" binding:"required"`
	NewPassword     string `json:"new_password" binding:"required"`
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
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request body"})
		return
	}

	userId, err := utils.GetUserId(c)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	u := new(User)

	err = db.Model(User{}).Where("id = ?", userId).Take(&u).Error

	if u.Id == 0 {
		c.JSON(http.StatusNotFound, gin.H{"error": "User not found"})
		return
	} else if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error while fetching database"})
		return
	}

	err = VerifyPassword(input.CurrentPassword, u.Password)

	if err != nil && err == bcrypt.ErrMismatchedHashAndPassword {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Password does not match"})
		return
	}

	newHashedPassword, _ := bcrypt.GenerateFromPassword([]byte(input.NewPassword), bcrypt.DefaultCost)

	u.Password = string(newHashedPassword)

	db.Save(&u)

	c.JSON(http.StatusOK, gin.H{"ok": "User password changed"})
}

type UserChangeUsername struct {
	NewUsername string `json:"new_username" binding:"required"`
}

type ChangeArticlesAuthornameObject struct {
	Oldname string `json:"oldname"`
	Newname string `json:"newname"`
}

func ChangeUsername(c *gin.Context, db *gorm.DB) {
	var input UserChangeUsername

	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request body"})
		return
	}

	existingUser := new(User)
	if err := db.Where("username = ?", input.NewUsername).First(existingUser).Error; err == nil {
		c.JSON(http.StatusConflict, gin.H{"error": "An account with this username already exists"})
		return
	}

	userId, err := utils.GetUserId(c)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	u := new(User)

	err = db.Model(User{}).Where("id = ?", userId).Take(&u).Error

	if u.Id == 0 {
		c.JSON(http.StatusNotFound, gin.H{"error": "User not found"})
		return
	}

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error while fetching database"})
		return
	}

	var body = ChangeArticlesAuthornameObject{}
	body.Oldname = u.Username
	body.Newname = input.NewUsername

	utils.MakeHTTPRequest(c, http.MethodPut, "http://articles-lemonde3-0:8082/articles/authorname", body)

	u.Username = input.NewUsername

	db.Save(&u)

	c.JSON(http.StatusOK, gin.H{"ok": "User name changed"})
}

type UserChangeUserMail struct {
	NewEmail string `json:"new_mail" binding:"required"`
}

func ChangeUserMail(c *gin.Context, db *gorm.DB) {
	var input UserChangeUserMail

	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request body"})
		return
	}

	existingUser := new(User)
	if err := db.Where("email = ?", input.NewEmail).First(existingUser).Error; err == nil {
		c.JSON(http.StatusConflict, gin.H{"error": "An account with this email already exists"})
		return
	}

	userId, err := utils.GetUserId(c)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	u := new(User)

	err = db.Model(User{}).Where("id = ?", userId).Take(&u).Error

	if u.Id == 0 {
		c.JSON(http.StatusNotFound, gin.H{"error": "User not found"})
		return
	}

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error while fetching database"})
		return
	}

	u.Email = input.NewEmail

	db.Save(&u)

	c.JSON(http.StatusOK, gin.H{"ok": "User mail changed"})
}
