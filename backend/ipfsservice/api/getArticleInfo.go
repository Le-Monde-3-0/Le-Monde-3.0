package api

import (
	"encoding/json"
	"net/http"
	"io/ioutil"
	"bytes"
)

//! This file contain all interaction with our database to get the articles

//* custom function to get make http request
func MakeHTTPRequest(method string, url string, requestBody interface{}) ([]byte, int, error) {
	jsonParams, err := json.Marshal(requestBody)
	if err != nil {
		return nil, http.StatusInternalServerError, err
	}

	request, err := http.NewRequest(method, url, bytes.NewBuffer(jsonParams))
	if err != nil {
		return nil, http.StatusInternalServerError, err
	}

	request.Header.Set("Content-Type", "application/json")

	client := &http.Client{}
	response, err := client.Do(request)
	if err != nil {
		return nil, http.StatusInternalServerError, err
	}

	defer response.Body.Close()

	responseBody, err := ioutil.ReadAll(response.Body)
	if err != nil {
		return nil, http.StatusInternalServerError, err
	}

	return responseBody, response.StatusCode, nil
}

//* function used to transform a Article from the database to a Article that will be
//* added on IPFS
func BindtoUsableArticles(bindArticle BindArticles) IPFSArticle {
	var article IPFSArticle

	article.Id = bindArticle.Id
	article.Cid = "fwefewfwe"
	article.Titre = bindArticle.Title
	article.Subtitle = bindArticle.Subtitle
	article.Content = bindArticle.Content
	article.Topic = bindArticle.Topic
	article.AuthorName = bindArticle.AuthorName
	article.CreationDate = bindArticle.CreatedAt
	article.ModificationDate = bindArticle.UpdatedAt
	article.Likes = int32(len(bindArticle.Likes))

	return article
}

//* In this function we transform an Array of articles form the db into IPFS Articles
func TreatArticles(bindArticles []BindArticles) []IPFSArticle{
	var articles []IPFSArticle

	for _,article := range bindArticles {
		var tmpArticle = BindtoUsableArticles(article)

		articles = append(articles, tmpArticle)
	}

	return articles
}

//* Function used to retreive all articles from the db
func GetAllArticles() []IPFSArticle {
	var articles []IPFSArticle

	// responseBody, _, err := MakeHTTPRequest(http.MethodGet, "http://articles-lemonde3-0:8082/articles", nil)
	responseBody, _, err := MakeHTTPRequest(http.MethodGet, "http://localhost:8082/articles", nil)
	if err != nil {
		return articles
	}

	var tmparticles []BindArticles
	json.Unmarshal(responseBody, &tmparticles)

	articles = TreatArticles(tmparticles)

	return articles
}

//* Function used to retreive the latest modified articles from the db
func GetModifiedArticles() []IPFSArticle {
	var articles []IPFSArticle

	// responseBody, _, err := MakeHTTPRequest(http.MethodGet, "http://articles-lemonde3-0:8082/articles/latest/modified", nil)
	responseBody, _, err := MakeHTTPRequest(http.MethodGet, "http://localhost:8082/articles/latest/modified", nil)
	if err != nil {
		return articles
	}

	var tmparticles []BindArticles
	json.Unmarshal(responseBody, &tmparticles)

	articles = TreatArticles(tmparticles)

	return articles
}

//* Function used to retreive the latest created articles from the db
func GetArticleInfo() []IPFSArticle {
	var articles []IPFSArticle

	// responseBody, _, err := MakeHTTPRequest(http.MethodGet, "http://articles-lemonde3-0:8082/articles/latest/created", nil)
	responseBody, _, err := MakeHTTPRequest(http.MethodGet, "http://localhost:8082/articles/latest/created", nil)
	if err != nil {
		return articles
	}

	var tmparticles []BindArticles
	json.Unmarshal(responseBody, &tmparticles)

	articles = TreatArticles(tmparticles)

	return articles
}