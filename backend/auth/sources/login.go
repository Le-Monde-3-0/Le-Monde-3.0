package auth

import (
	utils "github.com/Le-Monde-3-0/utils/sources"
	"github.com/dgrijalva/jwt-go"
	"github.com/gin-gonic/gin"
	"golang.org/x/crypto/bcrypt"
	"gorm.io/gorm"
	"net/http"
	"os"
	"time"
)

type LoginInput struct {
	Identifier string `json:"identifier" binding:"required"`
	Password   string `json:"password" binding:"required"`
}

/*
Login is the function which checks that the given parameters are correct and generates a token for the user
*/
func Login(c *gin.Context, db *gorm.DB) {
	var input LoginInput

	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid arguments"})
		return
	}

	token, err := LoginCheck(input.Identifier, input.Password, db)

	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Email or Password is incorrect."})
		return
	}

	c.JSON(http.StatusOK, gin.H{"token": token})
}

/*
GenerateToken generates the required token
*/
func GenerateToken(user_id int32, username string) (string, error) {
	claims := jwt.MapClaims{}
	claims["authorized"] = true
	claims["user_id"] = user_id
	claims["username"] = username
	claims["exp"] = time.Unix(1<<63-62135596801, 0).UTC().Unix()
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)

	return token.SignedString([]byte(os.Getenv("secret_key")))
}

/*
LoginCheck is called in Login to check if the parameters are correct
*/
func LoginCheck(identifier string, password string, db *gorm.DB) (string, error) {

	var err error

	u := new(User)

	if utils.IsEmail(identifier) {
		err = db.Model(User{}).Where("email = ?", identifier).Take(&u).Error
	} else {
		err = db.Model(User{}).Where("username = ?", identifier).Take(&u).Error
	}

	if err != nil {
		return "", err
	}

	err = VerifyPassword(password, u.Password)

	if err != nil && err == bcrypt.ErrMismatchedHashAndPassword {
		return "", err
	}

	token, err := GenerateToken(int32(u.Id), u.Username)

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
