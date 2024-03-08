package auth

import (
	"github.com/dgrijalva/jwt-go"
	"github.com/gin-gonic/gin"
	"golang.org/x/crypto/bcrypt"
	"gorm.io/gorm"
	"net/http"
	"os"
	"regexp"
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
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	token, err := LoginCheck(input.Identifier, input.Password, db)

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

	if isEmail(identifier) {
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

	token, err := GenerateToken(int32(u.Id))

	if err != nil {
		return "", err
	}

	return token, nil

}

/*
isEmail return true if the given string is an email, false otherwise
*/
func isEmail(identifier string) bool {
	emailRegex := regexp.MustCompile(`^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$`)
	return emailRegex.MatchString(identifier)
}

/*
VerifyPassword checks that the given password corresponds to the one in database
*/
func VerifyPassword(password, hashedPassword string) error {
	return bcrypt.CompareHashAndPassword([]byte(hashedPassword), []byte(password))
}
