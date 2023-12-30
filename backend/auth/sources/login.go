package auth

import (
	"github.com/dgrijalva/jwt-go"
	"github.com/gin-gonic/gin"
	"golang.org/x/crypto/bcrypt"
	"gorm.io/gorm"
	"net/http"
	"os"
	"time"
)

type LoginInput struct {
	Email    string `json:"email" binding:"required"`
	Password string `json:"password" binding:"required"`
}

/*
Login is the function which checks that the given parameters are correct and generates a token for the user
*/
func Login(c *gin.Context, db *gorm.DB) {
	var input LoginInput

	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	u := new(User)

	u.Email = input.Email
	u.Password = input.Password

	token, err := LoginCheck(u.Email, u.Password, db)

	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "email or password is incorrect."})
		return
	}

	c.JSON(http.StatusOK, gin.H{"token": token})
}

/*
GenerateToken generates the required token
*/
func GenerateToken(user_id int32) (string, error) {
	claims := jwt.MapClaims{}
	claims["authorized"] = true
	claims["user_id"] = user_id
	claims["exp"] = time.Now().Add(time.Hour * time.Duration(1)).Unix()
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)

	return token.SignedString([]byte(os.Getenv("secret_key")))
}

/*
LoginCheck is called in Login to check if the parameters are correct
*/
func LoginCheck(username string, password string, db *gorm.DB) (string, error) {

	var err error

	u := new(User)

	err = db.Model(User{}).Where("email = ?", username).Take(&u).Error

	if err != nil {
		return "", err
	}

	err = VerifyPassword(password, u.Password)

	if err != nil && err == bcrypt.ErrMismatchedHashAndPassword {
		return "", err
	}

	token, err := GenerateToken(u.Id)

	if err != nil {
		return "", err
	}

	return token, nil

}

/*
VerifyPassword checks that the given password corresponds to the one in database
*/
func VerifyPassword(password, hashedPassword string) error {
	return bcrypt.CompareHashAndPassword([]byte(hashedPassword), []byte(password))
}
