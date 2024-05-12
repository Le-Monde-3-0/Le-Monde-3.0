package articles

import (
	"bytes"
	"encoding/json"
	"log"
	articles "main/sources"
	"net/http"
	"net/http/httptest"
	"os"
	"testing"
	"time"

	"github.com/dgrijalva/jwt-go"
	"github.com/gin-gonic/gin"
	"github.com/go-playground/assert/v2"
	"github.com/lib/pq"
	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
)

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

	db.AutoMigrate(&articles.Article{})
	db.AutoMigrate(&articles.RecordLike{})
	db.AutoMigrate(&articles.RecordView{})

	return db
}

var db *gorm.DB
var token string
var fakeArticle articles.Article
var fakeOldArticle articles.Article
var router *gin.Engine
var likes []articles.RecordLike

func generateFakeToken() (string, error) {
	claims := jwt.MapClaims{}
	claims["authorized"] = true
	claims["user_id"] = 1
	claims["username"] = "bob"
	claims["exp"] = time.Now().Add(time.Hour * time.Duration(1)).Unix()
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	return token.SignedString([]byte(os.Getenv("secret_key")))
}

func setUp() {
	likes = []articles.RecordLike{
		{
			ID:        1,
			ArticleID: 2,
			UserId:    1,
			LikeTime:  time.Now(),
		},
	}
	db = fakeDB()
	token, _ = generateFakeToken()
	fakeArticle = articles.Article{
		Id:                    2,
		CreatedAt:             time.Now(),
		UpdatedAt:             time.Now(),
		UserId:                1,
		Title:                 "TestTitle",
		Subtitle:              "TestSubTitle",
		Content:               "TestContent",
		Topic:                 "TestTopic",
		Draft:                 true,
		HasConnectedUserLiked: false,
	}
	fakeOldArticle = articles.Article{
		Id:                    0,
		CreatedAt:             time.Now().Add(-3 * time.Hour),
		UpdatedAt:             time.Now().Add(-3 * time.Hour),
		UserId:                1,
		Title:                 "TestTitle2",
		Subtitle:              "TestSubTitle2",
		Topic:                 "TestTopic2",
		AuthorName:            "TestAuthorName2",
		Content:               "TestContent2",
		Draft:                 true,
		HasConnectedUserLiked: false,
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

	var responseArticle articles.Article
	err = json.Unmarshal([]byte(w.Body.String()), &responseArticle)
	if err != nil {
		log.Fatalf("error unmarshaling response: %s", err)
	}
	assert.Equal(t, "TestTitle", responseArticle.Title)
	assert.Equal(t, "TestContent", responseArticle.Content)
	assert.Equal(t, "bob", responseArticle.AuthorName)
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

	var responseArticle articles.Article
	err = json.Unmarshal([]byte(w.Body.String()), &responseArticle)
	if err != nil {
		log.Fatalf("error unmarshaling response: %s", err)
	}
	tmp := articles.RecordLike{
		ID:        2,
		ArticleID: 2,
		UserId:    2,
		LikeTime:  time.Now(),
	}

	likes[0].LikeTime = time.Now()
	tmp.LikeTime = time.Now()

	fakeArticle.Likes = append(fakeArticle.Likes, tmp)
	assert.Equal(t, likes[0].ID, responseArticle.Likes[0].ID)
	assert.Equal(t, likes[0].ArticleID, responseArticle.Likes[0].ArticleID)
	assert.Equal(t, likes[0].UserId, responseArticle.Likes[0].UserId)
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

	var responseArticle []articles.Article
	err = json.Unmarshal([]byte(w.Body.String()), &responseArticle)
	if err != nil {
		log.Fatalf("error unmarshaling response: %s", err)
	}
	currentTime := time.Now()
	responseArticle[0].CreatedAt = currentTime
	responseArticle[0].UpdatedAt = currentTime
	fakeArticle.CreatedAt = currentTime
	fakeArticle.UpdatedAt = currentTime
	// assert.Equal(t, []articles.Article{fakeArticle}, responseArticle)
	assert.Equal(t, fakeArticle.AuthorName, responseArticle[0].AuthorName)
	assert.Equal(t, fakeArticle.Content, responseArticle[0].Content)
	assert.Equal(t, fakeArticle.Draft, responseArticle[0].Draft)
	assert.Equal(t, fakeArticle.HasConnectedUserLiked, responseArticle[0].HasConnectedUserLiked)
	assert.Equal(t, fakeArticle.Id, responseArticle[0].Id)
	assert.Equal(t, fakeArticle.Subtitle, responseArticle[0].Subtitle)
	assert.Equal(t, fakeArticle.Title, responseArticle[0].Title)
	assert.Equal(t, fakeArticle.Topic, responseArticle[0].Topic)
	assert.Equal(t, fakeArticle.UserId, responseArticle[0].UserId)
}

func TestGetIPFSAllArticles(t *testing.T) {
	setUp()

	result := db.Create(&fakeArticle)
	if result.Error != nil {
		panic(result.Error)
	}
	w := httptest.NewRecorder()
	req, err := http.NewRequest("GET", "/ipfs/articles", nil)
	if err != nil {
		log.Fatalf("impossible to build request: %s", err)
	}

	req.Header.Set("Authorization", "Bearer "+token)
	req.Header.Set("Content-Type", "application/json")

	router.ServeHTTP(w, req)

	assert.Equal(t, 200, w.Code)

	var responseArticle []articles.Article
	err = json.Unmarshal([]byte(w.Body.String()), &responseArticle)
	if err != nil {
		log.Fatalf("error unmarshaling response: %s", err)
	}
	currentTime := time.Now()
	responseArticle[0].CreatedAt = currentTime
	responseArticle[0].UpdatedAt = currentTime
	fakeArticle.CreatedAt = currentTime
	fakeArticle.UpdatedAt = currentTime
	// assert.Equal(t, []articles.Article{fakeArticle}, responseArticle)
	assert.Equal(t, fakeArticle.AuthorName, responseArticle[0].AuthorName)
	assert.Equal(t, fakeArticle.Content, responseArticle[0].Content)
	assert.Equal(t, fakeArticle.Draft, responseArticle[0].Draft)
	assert.Equal(t, fakeArticle.HasConnectedUserLiked, responseArticle[0].HasConnectedUserLiked)
	assert.Equal(t, fakeArticle.Id, responseArticle[0].Id)
	assert.Equal(t, fakeArticle.Subtitle, responseArticle[0].Subtitle)
	assert.Equal(t, fakeArticle.Title, responseArticle[0].Title)
	assert.Equal(t, fakeArticle.Topic, responseArticle[0].Topic)
	assert.Equal(t, fakeArticle.UserId, responseArticle[0].UserId)
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

	var responseArticle articles.Article
	err = json.Unmarshal([]byte(w.Body.String()), &responseArticle)
	if err != nil {
		log.Fatalf("error unmarshaling response: %s", err)
	}
	currentTime := time.Now()
	responseArticle.CreatedAt = currentTime
	responseArticle.UpdatedAt = currentTime
	fakeArticle.CreatedAt = currentTime
	fakeArticle.UpdatedAt = currentTime
	responseArticle.Views = []articles.RecordView{}

	assert.Equal(t, fakeArticle.AuthorName, responseArticle.AuthorName)
	assert.Equal(t, fakeArticle.Content, responseArticle.Content)
	assert.Equal(t, fakeArticle.Draft, responseArticle.Draft)
	assert.Equal(t, fakeArticle.Id, responseArticle.Id)
	assert.Equal(t, fakeArticle.Subtitle, responseArticle.Subtitle)
	assert.Equal(t, fakeArticle.Title, responseArticle.Title)
	assert.Equal(t, fakeArticle.Topic, responseArticle.Topic)
	assert.Equal(t, fakeArticle.UserId, responseArticle.UserId)
}

func TestGetMyArticles(t *testing.T) {
	setUp()

	result := db.Create(&fakeArticle)
	if result.Error != nil {
		panic(result.Error)
	}

	result = db.Create(&articles.Article{Title: "TestTitle2", Content: "TestContent2", UserId: 2})
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

	var responseArticle []articles.Article
	err = json.Unmarshal([]byte(w.Body.String()), &responseArticle)
	if err != nil {
		log.Fatalf("error unmarshaling response: %s", err)
	}
	currentTime := time.Now()
	responseArticle[0].CreatedAt = currentTime
	responseArticle[0].UpdatedAt = currentTime
	fakeArticle.CreatedAt = currentTime
	fakeArticle.UpdatedAt = currentTime

	assert.Equal(t, fakeArticle.AuthorName, responseArticle[0].AuthorName)
	assert.Equal(t, fakeArticle.Content, responseArticle[0].Content)
	assert.Equal(t, fakeArticle.Draft, responseArticle[0].Draft)
	assert.Equal(t, fakeArticle.Id, responseArticle[0].Id)
	assert.Equal(t, fakeArticle.Subtitle, responseArticle[0].Subtitle)
	assert.Equal(t, fakeArticle.Title, responseArticle[0].Title)
	assert.Equal(t, fakeArticle.Topic, responseArticle[0].Topic)
	assert.Equal(t, fakeArticle.UserId, responseArticle[0].UserId)
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

	var likesResponse articles.LikesResponse
	err = json.Unmarshal([]byte(w.Body.String()), &likesResponse)
	if err != nil {
		log.Fatalf("error unmarshaling response: %s", err)
	}
	tmp := articles.LikesResponse{Amount: 0, Accounts: pq.Int32Array{}}
	assert.Equal(t, tmp.Amount, likesResponse.Amount)
}

func TestGetRandomTopics(t *testing.T) {
	setUp()

	type Topics struct {
		Topics []string
	}

	w := httptest.NewRecorder()
	req, err := http.NewRequest("GET", "/articles/topics/example", nil)
	if err != nil {
		log.Fatalf("impossible to build request: %s", err)
	}

	req.Header.Set("Content-Type", "application/json")

	router.ServeHTTP(w, req)

	assert.Equal(t, 200, w.Code)

	var responseTopics Topics
	err = json.Unmarshal([]byte(w.Body.String()), &responseTopics)
	if err != nil {
		log.Fatalf("error unmarshaling response: %s", err)
	}
	assert.Equal(t, 10, len(responseTopics.Topics))
	uniqueTopic := make(map[string]bool)
	for _, element := range responseTopics.Topics {
		uniqueTopic[element] = true
	}
	assert.Equal(t, 10, len(uniqueTopic))
}

type Response struct {
	Articles []articles.Article `json:"articles"`
}

func TestGetGetArticlesByTopic(t *testing.T) {
	setUp()

	result := db.Create(&fakeArticle)
	if result.Error != nil {
		panic(result.Error)
	}

	w := httptest.NewRecorder()
	req, err := http.NewRequest("GET", "/articles/topics/TestTopic", nil)
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
	currentTime := time.Now()
	response.Articles[0].CreatedAt = currentTime
	response.Articles[0].UpdatedAt = currentTime
	fakeArticle.CreatedAt = currentTime
	fakeArticle.UpdatedAt = currentTime
	assert.Equal(t, []articles.Article{fakeArticle}, response.Articles)
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

	var responseArticle []articles.Article
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

	var responseArticle []articles.Article
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

	var responseArticle []articles.Article
	err = json.Unmarshal([]byte(w.Body.String()), &responseArticle)
	if err != nil {
		log.Fatalf("error unmarshaling response: %s", err)
	}

	var tmp []articles.Article

	tmp = append(tmp, fakeArticle)

	tmp[0].Likes = []articles.RecordLike{}
	tmp[0].Views = []articles.RecordView{}

	assert.Equal(t, len(tmp), len(responseArticle))
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
	w := httptest.NewRecorder()
	req, err := http.NewRequest("PUT", "/articles/2/draft", nil)
	if err != nil {
		log.Fatalf("impossible to build request: %s", err)
	}

	req.Header.Set("Authorization", "Bearer "+token)
	req.Header.Set("Content-Type", "application/json")

	router.ServeHTTP(w, req)

	assert.Equal(t, 200, w.Code)
	var responseArticle articles.Article
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
	articleJSON, _ := json.Marshal(articles.EditedArticle{Title: "EditedTitle", Content: "EditedContent", Topic: "EditedTopic", Subtitle: "EditedSubtitle"})
	w := httptest.NewRecorder()
	req, err := http.NewRequest("PUT", "/articles/2", bytes.NewReader(articleJSON))
	if err != nil {
		log.Fatalf("impossible to build request: %s", err)
	}

	req.Header.Set("Authorization", "Bearer "+token)
	req.Header.Set("Content-Type", "application/json")

	router.ServeHTTP(w, req)

	assert.Equal(t, 200, w.Code)

	var responseArticle articles.Article
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

	result = db.Create(&articles.Article{Title: "TestTitle2", Content: "TestContent2", UserId: 2})
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

	fakeArticle.Likes = []articles.RecordLike{
		{
			ID:        1,
			ArticleID: 2,
			UserId:    1,
			LikeTime:  time.Now(),
		},
	}
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

	var responseArticle articles.Article
	err = json.Unmarshal([]byte(w.Body.String()), &responseArticle)
	if err != nil {
		log.Fatalf("error unmarshaling response: %s", err)
	}

	assert.Equal(t, 0, len(responseArticle.Likes))
}

func TestGetMyLikedArticles(t *testing.T) {
	setUp()

	result := db.Create(&fakeArticle)
	if result.Error != nil {
		panic(result.Error)
	}

	w := httptest.NewRecorder()
	req, err := http.NewRequest("GET", "/articles/liked", nil)
	if err != nil {
		log.Fatalf("impossible to build request: %s", err)
	}

	req.Header.Set("Authorization", "Bearer "+token)
	req.Header.Set("Content-Type", "application/json")

	router.ServeHTTP(w, req)
	assert.Equal(t, 200, w.Code)
}

func TestGetUserStats(t *testing.T) {
	setUp()

	result := db.Create(&fakeArticle)
	if result.Error != nil {
		panic(result.Error)
	}

	w := httptest.NewRecorder()
	req, err := http.NewRequest("GET", "/articles/user/stats", nil)
	if err != nil {
		log.Fatalf("impossible to build request: %s", err)
	}

	req.Header.Set("Authorization", "Bearer "+token)
	req.Header.Set("Content-Type", "application/json")

	router.ServeHTTP(w, req)
	assert.Equal(t, 200, w.Code)
}

type ArticleIds struct {
	Ids pq.Int32Array
}

func TestGetMultipleArticlesFromIds(t *testing.T) {
	setUp()

	result := db.Create(&fakeArticle)
	if result.Error != nil {
		panic(result.Error)
	}

	articleJSON, _ := json.Marshal(ArticleIds{Ids: pq.Int32Array{2}})
	w := httptest.NewRecorder()
	req, err := http.NewRequest("POST", "/articles/multiples", bytes.NewReader(articleJSON))
	if err != nil {
		log.Fatalf("impossible to build request: %s", err)
	}

	req.Header.Set("Authorization", "Bearer "+token)
	req.Header.Set("Content-Type", "application/json")

	router.ServeHTTP(w, req)
	assert.Equal(t, 200, w.Code)

	var responseArticle []articles.Article
	err = json.Unmarshal([]byte(w.Body.String()), &responseArticle)
	if err != nil {
		log.Fatalf("error unmarshaling response: %s", err)
	}

	assert.Equal(t, 1, len(responseArticle))
}
