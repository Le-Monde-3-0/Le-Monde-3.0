package auth

import (
	src "auth/sources"
	"bytes"
	"encoding/json"
	"log"
	"net/http"
	"net/http/httptest"
	"os"
	"testing"
	"time"

	"github.com/dgrijalva/jwt-go"
	"github.com/gin-gonic/gin"
	"github.com/go-playground/assert/v2"
	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
)

type TestUser struct {
	Id        uint `gorm:"primarykey"`
	Email     string
	Username  string
	Public    bool
	Bookmarks []src.UserBookmarks
}

func fakeDB() *gorm.DB {
	if _, err := os.Stat("fakeAuth.db"); err == nil {
		if err := os.Remove("fakeAuth.db"); err != nil {
			log.Fatal("failed to remove existing database:", err)
		}
	}

	db, err := gorm.Open(sqlite.Open("fakeAuth.db"), &gorm.Config{})
	if err != nil {
		log.Fatal("failed to connect database:", err)
	}

	db.AutoMigrate(&src.User{})

	return db
}

var db *gorm.DB
var token string
var user src.User
var returnedUser TestUser
var router *gin.Engine

func generateFakeToken() (string, error) {
	claims := jwt.MapClaims{}
	claims["authorized"] = true
	claims["user_id"] = 1
	claims["exp"] = time.Now().Add(time.Hour * time.Duration(1)).Unix()
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	return token.SignedString([]byte(os.Getenv("secret_key")))
}

func setUp() {
	db = fakeDB()
	token, _ = generateFakeToken()
	user = src.User{
		Id:        1,
		Email:     "test@test.com",
		Username:  "Bob",
		Password:  "$2a$10$CZ4GTkQUTzM32wYykH5msuHuh5tZtnRpRZGEsBlk2Vhu4tsiSn1B2",
		Public: false,
	}
	returnedUser = TestUser{
		Id:        1,
		Email:     "test@test.com",
		Username:  "Bob",
		Public: false,
		Bookmarks: []src.UserBookmarks{},
	}
	router = Router(db)
}

func TestLogin(t *testing.T) {
	setUp()

	result := db.Create(&user)
	if result.Error != nil {
		panic(result.Error)
	}
	requestBody := src.LoginInput{
		Identifier: "test@test.com",
		Password:   "pass",
	}

	jsonBody, err := json.Marshal(requestBody)
	if err != nil {
		t.Fatalf("Failed to marshal request body: %s", err)
	}

	w := httptest.NewRecorder()
	req, _ := http.NewRequest("POST", "/login", bytes.NewBuffer(jsonBody))
	router.ServeHTTP(w, req)

	assert.Equal(t, 200, w.Code)
}

func TestRegister(t *testing.T) {
	setUp()

	requestBody := src.RegisterInput{
		Email:    "test@test.com",
		Username: "Bob",
		Password: "pass",
	}
	jsonBody, err := json.Marshal(requestBody)
	if err != nil {
		t.Fatalf("Failed to marshal request body: %s", err)
	}

	w := httptest.NewRecorder()
	req, err := http.NewRequest("POST", "/register", bytes.NewBuffer(jsonBody))
	if err != nil {
		log.Fatalf("impossible to build request: %s", err)
	}
	router.ServeHTTP(w, req)

	assert.Equal(t, 201, w.Code)
	assert.Equal(t, "{\"created\":\"User created successfully\"}", w.Body.String())
}

func TestChangeUserUsername(t *testing.T) {
	setUp()

	result := db.Create(&user)
	if result.Error != nil {
		panic(result.Error)
	}

	requestBody := src.UserChangeUsername{
		NewUsername: "Boby",
	}

	jsonBody, err := json.Marshal(requestBody)
	if err != nil {
		t.Fatalf("Failed to marshal request body: %s", err)
	}

	w := httptest.NewRecorder()
	req, err := http.NewRequest("PATCH", "/user/username", bytes.NewBuffer(jsonBody))
	if err != nil {
		log.Fatalf("impossible to build request: %s", err)
	}
	req.Header.Set("Authorization", "Bearer "+token)
	req.Header.Set("Content-Type", "application/json")

	router.ServeHTTP(w, req)

	assert.Equal(t, 200, w.Code)
	assert.Equal(t, "{\"ok\":\"User name changed\"}", w.Body.String())
}

func TestChangeUserMail(t *testing.T) {
	setUp()

	result := db.Create(&user)
	if result.Error != nil {
		panic(result.Error)
	}

	requestBody := src.UserChangeUserMail{
		NewEmail: "testtest@test.com",
	}

	jsonBody, err := json.Marshal(requestBody)
	if err != nil {
		t.Fatalf("Failed to marshal request body: %s", err)
	}

	w := httptest.NewRecorder()
	req, err := http.NewRequest("PATCH", "/user/mail", bytes.NewBuffer(jsonBody))
	if err != nil {
		log.Fatalf("impossible to build request: %s", err)
	}

	req.Header.Set("Authorization", "Bearer "+token)
	req.Header.Set("Content-Type", "application/json")

	router.ServeHTTP(w, req)

	assert.Equal(t, 200, w.Code)
	assert.Equal(t, "{\"ok\":\"User mail changed\"}", w.Body.String())
}

func TestChangeUserPassword(t *testing.T) {
	setUp()

	result := db.Create(&user)
	if result.Error != nil {
		panic(result.Error)
	}

	requestBody := src.UserChangePassword{
		CurrentPassword:	"pass",
		NewPassword:    "thisispassword",
	}

	jsonBody, err := json.Marshal(requestBody)
	if err != nil {
		t.Fatalf("Failed to marshal request body: %s", err)
	}

	w := httptest.NewRecorder()
	req, err := http.NewRequest("PATCH", "/user/password", bytes.NewBuffer(jsonBody))
	if err != nil {
		log.Fatalf("impossible to build request: %s", err)
	}

	req.Header.Set("Authorization", "Bearer "+token)
	req.Header.Set("Content-Type", "application/json")

	router.ServeHTTP(w, req)

	assert.Equal(t, 200, w.Code)
	assert.Equal(t, "{\"ok\":\"User password changed\"}", w.Body.String())
}

func TestGetUserInfoByUsername(t *testing.T) {
	setUp()

	result := db.Create(&user)
	if result.Error != nil {
		panic(result.Error)
	}

	w := httptest.NewRecorder()
	req, err := http.NewRequest("GET", "/users/username/Bob", nil)
	if err != nil {
		log.Fatalf("impossible to build request: %s", err)
	}

	req.Header.Set("Authorization", "Bearer "+token)
	req.Header.Set("Content-Type", "application/json")

	router.ServeHTTP(w, req)

	assert.Equal(t, 200, w.Code)

	var responseUser TestUser
	err = json.Unmarshal(w.Body.Bytes(), &responseUser)
	if err != nil {
		log.Fatalf("error unmarshaling response: %s", err)
	}

	assert.Equal(t, returnedUser, responseUser)
}

func TestCheckUser(t *testing.T) {
	setUp()

	result := db.Create(&user)
	if result.Error != nil {
		panic(result.Error)
	}

	rest, _ := src.CheckUser("test@test.com", "pass", db)

	assert.Equal(t, rest, true)
}

func TestGetMyInfo(t *testing.T) {
	setUp()

	result := db.Create(&user)
	if result.Error != nil {
		panic(result.Error)
	}

	w := httptest.NewRecorder()
	req, err := http.NewRequest("GET", "/user", nil)
	if err != nil {
		log.Fatalf("impossible to build request: %s", err)
	}

	req.Header.Set("Authorization", "Bearer "+token)
	req.Header.Set("Content-Type", "application/json")

	router.ServeHTTP(w, req)

	assert.Equal(t, 200, w.Code)

	var responseUser TestUser
	err = json.Unmarshal(w.Body.Bytes(), &responseUser)
	if err != nil {
		log.Fatalf("error unmarshaling response: %s", err)
	}
	assert.Equal(t, returnedUser, responseUser)
}

func TestGetUser(t *testing.T) {
	setUp()

	result := db.Create(&user)
	if result.Error != nil {
		panic(result.Error)
	}

	w := httptest.NewRecorder()
	req, err := http.NewRequest("GET", "/users/users/1", nil)
	if err != nil {
		log.Fatalf("impossible to build request: %s", err)
	}

	req.Header.Set("Authorization", "Bearer "+token)
	req.Header.Set("Content-Type", "application/json")

	router.ServeHTTP(w, req)

	assert.Equal(t, 200, w.Code)

	var responseUser TestUser
	err = json.Unmarshal(w.Body.Bytes(), &responseUser)
	if err != nil {
		log.Fatalf("error unmarshaling response: %s", err)
	}
	assert.Equal(t, returnedUser, responseUser)
}

func TestChangeUserVisibility(t *testing.T) {
	setUp()

	result := db.Create(&user)
	if result.Error != nil {
		panic(result.Error)
	}

	tmpBool := true
	requestBody := src.UserVisibility{
		Public: &tmpBool,
	}

	jsonBody, err := json.Marshal(requestBody)
	if err != nil {
		t.Fatalf("Failed to marshal request body: %s", err)
	}

	w := httptest.NewRecorder()
	req, err := http.NewRequest("PATCH", "/user/status", bytes.NewBuffer(jsonBody))
	if err != nil {
		log.Fatalf("impossible to build request: %s", err)
	}

	req.Header.Set("Authorization", "Bearer "+token)
	req.Header.Set("Content-Type", "application/json")

	router.ServeHTTP(w, req)

	assert.Equal(t, 200, w.Code)

	var responseUser TestUser
	err = json.Unmarshal(w.Body.Bytes(), &responseUser)
	if err != nil {
		log.Fatalf("error unmarshaling response: %s", err)
	}

	assert.Equal(t, "{\"ok\":\"User visibility changed\"}", w.Body.String())
}
