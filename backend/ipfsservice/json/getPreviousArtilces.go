package json

import (
	a "main/api"
	"encoding/json"
	"io/ioutil"
	"os"
	"fmt"
)

func GetPreviousArticles() []a.IPFSArticle{
	jsonFile, err := os.Open("articles.json")
	if err != nil {
		fmt.Println(err)
	}
	defer jsonFile.Close()

	byteValue, _ := ioutil.ReadAll(jsonFile)

	var articles []a.IPFSArticle
	json.Unmarshal(byteValue, &articles)

	return articles
}