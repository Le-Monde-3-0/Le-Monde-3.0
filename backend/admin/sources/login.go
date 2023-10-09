package sources

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
type LoginToken struct {
	Token  string `json:"token"`
	UserId int32  `json:"userId"`
}

func Login(c *gin.Context, db *gorm.DB) {
	var input LoginInput
	var loginToken LoginToken

	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	u := new(User)

	u.Email = input.Email
	u.Password = input.Password

	token, uId, err := LoginCheck(u.Email, u.Password, db)

	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "email or password is incorrect."})
		return
	}

	loginToken.Token = token
	loginToken.UserId = uId
	c.JSON(http.StatusOK, loginToken)
}

func GenerateToken(user_id int32) (string, error) {
	claims := jwt.MapClaims{}
	claims["authorized"] = true
	claims["user_id"] = user_id
	claims["exp"] = time.Now().Add(time.Hour * time.Duration(1)).Unix()
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)

	return token.SignedString([]byte(os.Getenv("secret_key")))
}

func LoginCheck(username string, password string, db *gorm.DB) (string, int32, error) {

	var err error

	u := new(User)

	err = db.Model(User{}).Where("email = ?", username).Take(&u).Error

	if err != nil {
		return "", 0, err
	}

	err = VerifyPassword(password, u.Password)

	if err != nil && err == bcrypt.ErrMismatchedHashAndPassword {
		return "", 0, err
	}

	token, err := GenerateToken(u.Id)

	if err != nil {
		return "", 0, err
	}

	return token, u.Id, nil

}

func VerifyPassword(password, hashedPassword string) error {
	return bcrypt.CompareHashAndPassword([]byte(hashedPassword), []byte(password))
}
