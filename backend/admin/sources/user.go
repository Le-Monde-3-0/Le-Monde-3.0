package sources

import (
	"errors"
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

// func GetUserFromId(c *gin.Context, db *gorm.DB) {
// 	user := new(User)

// 	if err := c.Bind(&user); err != nil {
// 		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
// 		return
// 	}

// 	id, err := strconv.ParseInt(c.Param("id"), 10, 64)

// 	if err != nil {
// 		c.JSON(http.StatusBadRequest, gin.H{"error": "User id could not be retrieved"})
// 		return
// 	}

// 	result := db.Where(User{Id: int32(id)}).Find(&user)
// 	if result.Error != nil {
// 		if errors.Is(result.Error, gorm.ErrRecordNotFound) {
// 			c.JSON(http.StatusNotFound, gin.H{"error": result.Error})
// 		}
// 		c.JSON(http.StatusInternalServerError, gin.H{"error": result.Error})
// 	} else if user.Id == 0 {
// 		c.JSON(http.StatusNotFound, gin.H{"error": "user not found"})
// 	} else {
// 		c.JSON(http.StatusOK, user)
// 	}
// }

func GetUser(c *gin.Context, db *gorm.DB) {
	user := new(User)

	if err := c.Bind(&user); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	email := c.Query("email")
	result := db.Where(User{Email: email}).Find(&user)
	if result.Error != nil {
		if errors.Is(result.Error, gorm.ErrRecordNotFound) {
			c.JSON(http.StatusNotFound, gin.H{"error": result.Error})
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": result.Error})
	} else if user.Id == 0 {
		c.JSON(http.StatusNotFound, gin.H{"error": "user not found"})
	} else {
		c.JSON(http.StatusOK, user)
	}
}

func DeleteUser(c *gin.Context, db *gorm.DB) {
	user := new(User)

	if err := c.Bind(&user); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	email := c.Query("email")
	res := db.Where(User{Email: email}).Find(&user)
	if res.Error != nil {
		if errors.Is(res.Error, gorm.ErrRecordNotFound) {
			c.JSON(http.StatusNotFound, gin.H{"error": res.Error})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": res.Error})
		return
	}
	if user.Id == 0 {
		c.JSON(http.StatusNotFound, gin.H{"error": "User not found"})
		return
	}

	id := user.Id
	condition := User{Id: id}

	result := db.Delete(&condition)
	if result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": result.Error})
	} else {
		c.JSON(http.StatusOK, gin.H{"delete": "User deleted successfully"})
	}
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
	return true, err;
}

type UserChangePassword struct {
	Email    string `json:"email" binding:"required"`
	Password string `json:"password" binding:"required"`
	NewPassword string `json:"newpassword" binding:"required"`
}

func ChangeUserPassword(c *gin.Context, db *gorm.DB) {
	var input UserChangePassword

	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid Arguments"})
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
	Email    string `json:"email" binding:"required"`
	Password string `json:"password" binding:"required"`
	NewUsername string `json:"newusername" binding:"required"`
}

func ChangeUsername(c *gin.Context, db *gorm.DB) {
	var input UserChangeUsername

	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid Arguments"})
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