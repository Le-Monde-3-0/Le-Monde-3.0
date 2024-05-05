package router

import (
	"bytes"
	"encoding/json"
	"github.com/dgrijalva/jwt-go"
	"github.com/gin-gonic/gin"
	"github.com/go-playground/assert/v2"
	"github.com/lib/pq"
	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
	"log"
	src "main/sources"
	"net/http"
	"net/http/httptest"
	"os"
	"testing"
	"time"
)

type Article struct {
	ID         uint   `gorm:"primaryKey"`
	CreatedAt  time.Time
	UpdatedAt  time.Time
	DeletedAt  *time.Time `gorm:"index"`
	Id      int32
	UserId  int32
	AuthorName string
	Title   string
	Subtitle string
	Content string
	Topic string
	Draft bool
	Likes   pq.Int32Array `gorm:"type:integer[]"`
}

func fakeDB() *gorm.DB {
	if _, err := os.Stat("fakeArticles.db"); err == nil {
		if err := os.Remove("fakeArticles.db"); err != nil {
			log.Fatal("failed to remove existing database:", err)
		}
	}

	db, err := gorm.Open(sqlite.Open("fakeArticles.db"), &gorm.Config{})
	if err != nil {
		log.Fatal("failed to connect database:", err)
	}

	db.AutoMigrate(&src.Article{})

	return db
}

var db *gorm.DB
var token string
var fakeArticle src.Article
var fakeOldArticle Article
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
	fakeArticle = src.Article{
		Id:      2,
		Title:   "TestTitle",
		Subtitle:	"TestSubTitle",
		Topic:	"TestTopic",
		AuthorName:	"TestAuthorName",
		Content: "TestContent",
		Draft:	true,
		UserId:  1,
		Likes:   pq.Int32Array{7},
	}
	fakeOldArticle = Article{
		ID: 0,
		CreatedAt: time.Now().Add(-3 * time.Hour),
		UpdatedAt: time.Now().Add(-3 * time.Hour),
		DeletedAt: nil,
		Id:      3,
		Title:   "TestTitle2",
		Subtitle:	"TestSubTitle2",
		Topic:	"TestTopic2",
		AuthorName:	"TestAuthorName2",
		Content: "TestContent2",
		Draft:	true,
		UserId:  1,
		Likes:   pq.Int32Array{7},
	}
	router = Router(db)
}

func TestAddArticle(t *testing.T) {

	setUp()

	articleJSON, _ := json.Marshal(fakeArticle)
	w := httptest.NewRecorder()
	req, err := http.NewRequest("POST", "/articles", bytes.NewReader(articleJSON))
	if err != nil {
		log.Fatalf("impossible to build request: %s", err)
	}

	req.Header.Set("Authorization", "Bearer "+token)
	req.Header.Set("Content-Type", "application/json")

	router.ServeHTTP(w, req)

	assert.Equal(t, 201, w.Code)

	var responseArticle src.Article
	err = json.Unmarshal([]byte(w.Body.String()), &responseArticle)
	if err != nil {
		log.Fatalf("error unmarshaling response: %s", err)
	}
	assert.Equal(t, "TestTitle", responseArticle.Title)
	assert.Equal(t, "TestContent", responseArticle.Content)
}

func TestAddLike(t *testing.T) {
	setUp()

	result := db.Create(&fakeArticle)
	if result.Error != nil {
		panic(result.Error)
	}
	w := httptest.NewRecorder()
	req, err := http.NewRequest("POST", "/articles/2/likes", nil)
	if err != nil {
		log.Fatalf("impossible to build request: %s", err)
	}

	req.Header.Set("Authorization", "Bearer "+token)
	req.Header.Set("Content-Type", "application/json")

	router.ServeHTTP(w, req)

	assert.Equal(t, 200, w.Code)

	var responseArticle src.Article
	err = json.Unmarshal([]byte(w.Body.String()), &responseArticle)
	if err != nil {
		log.Fatalf("error unmarshaling response: %s", err)
	}
	fakeArticle.Likes = append(fakeArticle.Likes, 1)
	assert.Equal(t, fakeArticle.Likes, responseArticle.Likes)
}

func TestGetAllArticles(t *testing.T) {
	setUp()

	result := db.Create(&fakeArticle)
	if result.Error != nil {
		panic(result.Error)
	}
	w := httptest.NewRecorder()
	req, err := http.NewRequest("GET", "/articles", nil)
	if err != nil {
		log.Fatalf("impossible to build request: %s", err)
	}

	req.Header.Set("Authorization", "Bearer "+token)
	req.Header.Set("Content-Type", "application/json")

	router.ServeHTTP(w, req)

	assert.Equal(t, 200, w.Code)

	var responseArticle []src.Article
	err = json.Unmarshal([]byte(w.Body.String()), &responseArticle)
	if err != nil {
		log.Fatalf("error unmarshaling response: %s", err)
	}
	assert.Equal(t, []src.Article{fakeArticle}, responseArticle)
}

func TestGetArticle(t *testing.T) {
	setUp()

	result := db.Create(&fakeArticle)
	if result.Error != nil {
		panic(result.Error)
	}
	w := httptest.NewRecorder()
	req, err := http.NewRequest("GET", "/articles/2", nil)
	if err != nil {
		log.Fatalf("impossible to build request: %s", err)
	}

	req.Header.Set("Authorization", "Bearer "+token)
	req.Header.Set("Content-Type", "application/json")

	router.ServeHTTP(w, req)

	assert.Equal(t, 200, w.Code)

	var responseArticle src.Article
	err = json.Unmarshal([]byte(w.Body.String()), &responseArticle)
	if err != nil {
		log.Fatalf("error unmarshaling response: %s", err)
	}
	assert.Equal(t, fakeArticle, responseArticle)
}

func TestGetMyArticles(t *testing.T) {
	setUp()

	result := db.Create(&fakeArticle)
	if result.Error != nil {
		panic(result.Error)
	}

	result = db.Create(&src.Article{Title: "TestTitle2", Content: "TestContent2", UserId: 2})
	if result.Error != nil {
		panic(result.Error)
	}
	w := httptest.NewRecorder()
	req, err := http.NewRequest("GET", "/articles/me", nil)
	if err != nil {
		log.Fatalf("impossible to build request: %s", err)
	}

	req.Header.Set("Authorization", "Bearer "+token)
	req.Header.Set("Content-Type", "application/json")

	router.ServeHTTP(w, req)

	assert.Equal(t, 200, w.Code)

	var responseArticle []src.Article
	err = json.Unmarshal([]byte(w.Body.String()), &responseArticle)
	if err != nil {
		log.Fatalf("error unmarshaling response: %s", err)
	}
	assert.Equal(t, []src.Article{fakeArticle}, responseArticle)
}

func TestGetLikesInfo(t *testing.T) {
	setUp()

	result := db.Create(&fakeArticle)
	if result.Error != nil {
		panic(result.Error)
	}
	w := httptest.NewRecorder()
	req, err := http.NewRequest("GET", "/articles/2/likes", nil)
	if err != nil {
		log.Fatalf("impossible to build request: %s", err)
	}

	req.Header.Set("Authorization", "Bearer "+token)
	req.Header.Set("Content-Type", "application/json")

	router.ServeHTTP(w, req)

	assert.Equal(t, 200, w.Code)

	var likesResponse src.LikesResponse
	err = json.Unmarshal([]byte(w.Body.String()), &likesResponse)
	if err != nil {
		log.Fatalf("error unmarshaling response: %s", err)
	}
	assert.Equal(t, src.LikesResponse{Amount: 1, Accounts: pq.Int32Array{7}}, likesResponse)
}

type Response struct {
	Articles []src.Article `json:"articles"`
}

func TestGetGetArticlesByTopic(t *testing.T) {
	setUp()

	result := db.Create(&fakeArticle)
	if result.Error != nil {
		panic(result.Error)
	}

	w := httptest.NewRecorder()
	req, err := http.NewRequest("GET", "/articles/topic/TestTopic", nil)
	if err != nil {
		log.Fatalf("impossible to build request: %s", err)
	}

	req.Header.Set("Authorization", "Bearer "+token)
	req.Header.Set("Content-Type", "application/json")

	router.ServeHTTP(w, req)

	assert.Equal(t, 200, w.Code)

	var response Response
	err = json.Unmarshal([]byte(w.Body.String()), &response)
	if err != nil {
		log.Fatalf("error unmarshaling response: %s", err)
	}
	assert.Equal(t, []src.Article{fakeArticle}, response.Articles)
}

func TestGetAllTopics(t *testing.T) {
	setUp()

	result := db.Create(&fakeArticle)
	if result.Error != nil {
		panic(result.Error)
	}

	w := httptest.NewRecorder()
	req, err := http.NewRequest("GET", "/articles/topics", nil)
	if err != nil {
		log.Fatalf("impossible to build request: %s", err)
	}

	req.Header.Set("Authorization", "Bearer "+token)
	req.Header.Set("Content-Type", "application/json")

	router.ServeHTTP(w, req)

	assert.Equal(t, 200, w.Code)

	var response []string
    err = json.Unmarshal([]byte(w.Body.String()), &response)
    if err != nil {
        log.Fatalf("error unmarshaling response: %s", err)
    }
	
	found := false
    for _, topic := range response {
        if topic == "TestTopic" {
            found = true
            break
        }
    }

    if !found {
        t.Error("Expected topic 'TestTopic' not found in the response")
    }
}

func TestGetLastCreatedArticles(t *testing.T) {
	setUp()

	result := db.Create(&fakeOldArticle)
	if result.Error != nil {
		panic(result.Error)
	}

	result2 := db.Create(&fakeArticle)
	if result2.Error != nil {
		panic(result2.Error)
	}

	w := httptest.NewRecorder()
	req, err := http.NewRequest("GET", "/articles/latest/created", nil)
	if err != nil {
		log.Fatalf("impossible to build request: %s", err)
	}

	req.Header.Set("Authorization", "Bearer "+token)
	req.Header.Set("Content-Type", "application/json")

	router.ServeHTTP(w, req)

	assert.Equal(t, 200, w.Code)

	var responseArticle []Article
	err = json.Unmarshal([]byte(w.Body.String()), &responseArticle)
	if err != nil {
		log.Fatalf("error unmarshaling response: %s", err)
	}
	assert.Equal(t, len(responseArticle), 1)
}

func TestGetLastModifiedArticles(t *testing.T) {
	setUp()

	result := db.Create(&fakeOldArticle)
	if result.Error != nil {
		panic(result.Error)
	}

	result2 := db.Create(&fakeArticle)
	if result2.Error != nil {
		panic(result2.Error)
	}

	w := httptest.NewRecorder()
	req, err := http.NewRequest("GET", "/articles/latest/modified", nil)
	if err != nil {
		log.Fatalf("impossible to build request: %s", err)
	}

	req.Header.Set("Authorization", "Bearer "+token)
	req.Header.Set("Content-Type", "application/json")

	router.ServeHTTP(w, req)	

	assert.Equal(t, 200, w.Code)

	var responseArticle []Article
	err = json.Unmarshal([]byte(w.Body.String()), &responseArticle)
	if err != nil {
		log.Fatalf("error unmarshaling response: %s", err)
	}
	assert.Equal(t, len(responseArticle), 1)
}

type responseGetTopic struct {
	Topic string
}

type responseGetTopicError struct {
	Error string
}

func TestGetArticlesByKeyword(t *testing.T) {
	setUp()

	result := db.Create(&fakeArticle)
	if result.Error != nil {
		panic(result.Error)
	}
	w := httptest.NewRecorder()
	req, err := http.NewRequest("GET", "/articles/search/Test", nil)
	if err != nil {
		log.Fatalf("impossible to build request: %s", err)
	}

	req.Header.Set("Authorization", "Bearer "+token)
	req.Header.Set("Content-Type", "application/json")

	router.ServeHTTP(w, req)	

	assert.Equal(t, 200, w.Code)

	var responseArticle []src.Article
	err = json.Unmarshal([]byte(w.Body.String()), &responseArticle)
	if err != nil {
		log.Fatalf("error unmarshaling response: %s", err)
	}
	assert.Equal(t, []src.Article{fakeArticle}, responseArticle)
}

func TestGetArticlesTopic200(t *testing.T) {
	setUp()

	result := db.Create(&fakeArticle)
	if result.Error != nil {
		panic(result.Error)
	}
	w := httptest.NewRecorder()
	req, err := http.NewRequest("GET", "/articles/2/topic", nil)
	if err != nil {
		log.Fatalf("impossible to build request: %s", err)
	}

	req.Header.Set("Authorization", "Bearer "+token)
	req.Header.Set("Content-Type", "application/json")

	router.ServeHTTP(w, req)	

	assert.Equal(t, 200, w.Code)

	var responseTopic responseGetTopic
	err = json.Unmarshal([]byte(w.Body.String()), &responseTopic)
	if err != nil {
		log.Fatalf("error unmarshaling response: %s", err)
	}
	assert.Equal(t, fakeArticle.Topic, responseTopic.Topic)
}

func TestGetArticlesTopic401(t *testing.T) {
	setUp()

	result := db.Create(&fakeArticle)
	if result.Error != nil {
		panic(result.Error)
	}
	w := httptest.NewRecorder()
	req, err := http.NewRequest("GET", "/articles/2/topic", nil)
	if err != nil {
		log.Fatalf("impossible to build request: %s", err)
	}

	req.Header.Set("Content-Type", "application/json")

	router.ServeHTTP(w, req)

	assert.Equal(t, 400, w.Code)
}

func TestGetArticlesTopic404(t *testing.T) {
	setUp()

	result := db.Create(&fakeArticle)
	if result.Error != nil {
		panic(result.Error)
	}
	w := httptest.NewRecorder()
	req, err := http.NewRequest("GET", "/articles/10/topic", nil)
	if err != nil {
		log.Fatalf("impossible to build request: %s", err)
	}

	req.Header.Set("Authorization", "Bearer "+token)
	req.Header.Set("Content-Type", "application/json")

	router.ServeHTTP(w, req)	

	assert.Equal(t, 404, w.Code)
}

func TestGetArticlesTopic400(t *testing.T) {
	setUp()

	result := db.Create(&fakeArticle)
	if result.Error != nil {
		panic(result.Error)
	}
	w := httptest.NewRecorder()
	req, err := http.NewRequest("GET", "/articles/fwef/topic", nil)
	if err != nil {
		log.Fatalf("impossible to build request: %s", err)
	}

	req.Header.Set("Authorization", "Bearer "+token)
	req.Header.Set("Content-Type", "application/json")

	router.ServeHTTP(w, req)	

	assert.Equal(t, 400, w.Code)
}

func TestIsArticleDraft(t *testing.T) {
	setUp()

	result := db.Create(&fakeArticle)
	if result.Error != nil {
		panic(result.Error)
	}
	w := httptest.NewRecorder()
	req, err := http.NewRequest("GET", "/articles/2/draft", nil)
	if err != nil {
		log.Fatalf("impossible to build request: %s", err)
	}

	req.Header.Set("Authorization", "Bearer "+token)
	req.Header.Set("Content-Type", "application/json")

	router.ServeHTTP(w, req)

	assert.Equal(t, 200, w.Code)
	var body map[string]string
	err = json.Unmarshal([]byte(w.Body.String()), &body)
	if err != nil {
		log.Fatalf("error unmarshaling response: %s", err)
	}
	assert.Equal(t, "Article is a draft", body["true"])
}

func TestChangeDraftState(t *testing.T) {
	setUp()

	result := db.Create(&fakeArticle)
	if result.Error != nil {
		panic(result.Error)
	}
	draftJSON, _ := json.Marshal(src.ChangeDraftStateObject{Draft: false})
	w := httptest.NewRecorder()
	req, err := http.NewRequest("PUT", "/articles/2/draft", bytes.NewReader(draftJSON))
	if err != nil {
		log.Fatalf("impossible to build request: %s", err)
	}

	req.Header.Set("Authorization", "Bearer "+token)
	req.Header.Set("Content-Type", "application/json")

	router.ServeHTTP(w, req)

	assert.Equal(t, 200, w.Code)
	var responseArticle src.Article
	err = json.Unmarshal([]byte(w.Body.String()), &responseArticle)
	if err != nil {
		log.Fatalf("error unmarshaling response: %s", err)
	}
	assert.Equal(t, false, responseArticle.Draft)
}

func TestEditArticle(t *testing.T) {
	setUp()

	result := db.Create(&fakeArticle)
	if result.Error != nil {
		panic(result.Error)
	}
	articleJSON, _ := json.Marshal(src.EditedArticle{Title: "EditedTitle", Content: "EditedContent", Topic: "EditedTopic", Subtitle: "EditedSubtitle"})
	w := httptest.NewRecorder()
	req, err := http.NewRequest("PUT", "/articles/2", bytes.NewReader(articleJSON))
	if err != nil {
		log.Fatalf("impossible to build request: %s", err)
	}

	req.Header.Set("Authorization", "Bearer "+token)
	req.Header.Set("Content-Type", "application/json")

	router.ServeHTTP(w, req)

	assert.Equal(t, 200, w.Code)

	var responseArticle src.Article
	err = json.Unmarshal([]byte(w.Body.String()), &responseArticle)
	if err != nil {
		log.Fatalf("error unmarshaling response: %s", err)
	}
	assert.Equal(t, "EditedTitle", responseArticle.Title)
	assert.Equal(t, "EditedContent", responseArticle.Content)
	assert.Equal(t, "EditedTopic", responseArticle.Topic)
	assert.Equal(t, "EditedSubtitle", responseArticle.Subtitle)
}

func TestDeleteAllArticles(t *testing.T) {
	setUp()

	result := db.Create(&fakeArticle)
	if result.Error != nil {
		panic(result.Error)
	}

	result = db.Create(&src.Article{Title: "TestTitle2", Content: "TestContent2", UserId: 2})
	if result.Error != nil {
		panic(result.Error)
	}
	w := httptest.NewRecorder()
	req, err := http.NewRequest("DELETE", "/articles", nil)
	if err != nil {
		log.Fatalf("impossible to build request: %s", err)
	}

	req.Header.Set("Authorization", "Bearer "+token)
	req.Header.Set("Content-Type", "application/json")

	router.ServeHTTP(w, req)

	assert.Equal(t, 200, w.Code)

	var body map[string]string
	err = json.Unmarshal([]byte(w.Body.String()), &body)
	if err != nil {
		log.Fatalf("error unmarshaling response: %s", err)
	}
	assert.Equal(t, "All articles have been successfully deleted", body["delete"])
}

func TestDeleteArticle(t *testing.T) {
	setUp()

	result := db.Create(&fakeArticle)
	if result.Error != nil {
		panic(result.Error)
	}

	w := httptest.NewRecorder()
	req, err := http.NewRequest("DELETE", "/articles/2", nil)
	if err != nil {
		log.Fatalf("impossible to build request: %s", err)
	}

	req.Header.Set("Authorization", "Bearer "+token)
	req.Header.Set("Content-Type", "application/json")

	router.ServeHTTP(w, req)

	assert.Equal(t, 200, w.Code)

	var body map[string]string
	err = json.Unmarshal([]byte(w.Body.String()), &body)
	if err != nil {
		log.Fatalf("error unmarshaling response: %s", err)
	}
	assert.Equal(t, "Article has been successfully deleted", body["delete"])
}

func TestRemoveLike(t *testing.T) {
	setUp()

	fakeArticle.Likes = pq.Int32Array{1}
	result := db.Create(&fakeArticle)
	if result.Error != nil {
		panic(result.Error)
	}

	w := httptest.NewRecorder()
	req, err := http.NewRequest("DELETE", "/articles/2/likes", nil)
	if err != nil {
		log.Fatalf("impossible to build request: %s", err)
	}

	req.Header.Set("Authorization", "Bearer "+token)
	req.Header.Set("Content-Type", "application/json")

	router.ServeHTTP(w, req)
	assert.Equal(t, 200, w.Code)

	var responseArticle src.Article
	err = json.Unmarshal([]byte(w.Body.String()), &responseArticle)
	if err != nil {
		log.Fatalf("error unmarshaling response: %s", err)
	}
	fakeArticle.Likes = append(fakeArticle.Likes, 1)
	assert.Equal(t, pq.Int32Array{}, responseArticle.Likes)
}
