package trigger

import (
	api "main/api"
	myjson "main/json"
	"encoding/json"
	"time"
	"fmt"
	"os"

)

//* function used to check if two our are elapsed 
func TwoHourTime(startTime time.Time) (time.Time, bool) {
	currentTime := time.Now()

	duration := currentTime.Sub(startTime)

    // Define a duration of two hours
    twoHours := 2 * time.Hour

    // Check if the duration is greater than or equal to two hours
    if duration >= twoHours {
        fmt.Println("Two hours have elapsed.")
		return currentTime, true
    } else {
        fmt.Println("Less than two hours have elapsed.")
		return startTime, false
    }
}

//* function that check if the file articles,json exist or is empty
func IsFileEmpty() bool {
	filePath := "articles.json"

	if _, err := os.Stat(filePath); os.IsNotExist(err) {
		fmt.Println("File does not exist:", filePath)
		return true
	}

	file, err := os.Open(filePath)
	if err != nil {
		fmt.Println("Error opening file:", err)
		return true
	}
	defer file.Close()

	var articles []api.IPFSArticle
	decoder := json.NewDecoder(file)
	if err := decoder.Decode(&articles); err != nil {
		fmt.Println("Error decoding JSON:", err)
		return true
	}

	// Check if there is data in the JSON file
	if len(articles) == 0 {
		return true
	}
	return false
}

//* function that will pin the article.json file on IPFS and call the scaleway API
func IFPSPart(newCID string) {

	// api.UpdateNameWithCID(newcid)
	var _ []api.Names = api.GetPins()
	// api.DeletePins(pins)
	// api.PinCid(newCID)
	// api.CheckPinStatus()
}

func DeleteNonCreatedArticles(modifiedArticles []api.IPFSArticle) []api.IPFSArticle {
	var newArticles []api.IPFSArticle

	for _,article := range modifiedArticles  {
		if article.CreationDate != article.ModificationDate {
			newArticles = append(newArticles, article)
		}
	}
	return newArticles
}

func DeleteDoubledArticle(articles []api.IPFSArticle, tocheck []api.IPFSArticle) []api.IPFSArticle {
	var newArticles []api.IPFSArticle
	for _, article := range articles {
		if !articleExistsIn(article, tocheck) {
			newArticles = append(newArticles, article)
		}
	}
	return newArticles
}

func articleExistsIn(article api.IPFSArticle, articles []api.IPFSArticle) bool {
	for _, a := range articles {
		if a.Id == article.Id {
			return true
		}
	}
	return false
}

//* main function of this service, check the elapsed time, the status of the file
//* and what function to call from the DB
func IPFSTrigger() {
	ticker := time.NewTicker(2 * time.Hour)
	defer ticker.Stop()

	for {
		select {
		case <-ticker.C:
			var articles []api.IPFSArticle
			var modifiedArticles []api.IPFSArticle
			var previousArticles []api.IPFSArticle

			if IsFileEmpty() == true {
				articles = api.GetAllArticles()
				fmt.Println("Get all articles")
			} else {
				articles = api.GetArticleInfo()
				modifiedArticles = api.GetModifiedArticles()
				previousArticles = myjson.GetPreviousArticles()

				modifiedArticles = DeleteNonCreatedArticles(modifiedArticles)
				articles = DeleteDoubledArticle(articles, previousArticles)
				fmt.Println("Get latest articles")
				fmt.Println("Modified: ")
				fmt.Println(modifiedArticles)
				fmt.Println("Created: ")
				fmt.Println(articles)
			}
			var allArticles[]api.IPFSArticle

			allArticles = append(previousArticles, articles...)
			allArticles = append(allArticles, modifiedArticles...)
			fmt.Println("All Articles:", allArticles)

			if len(allArticles) != 0 {
				myjson.WriteInFile(allArticles)
				api.AddFileToIPFS()
				// if newCID != "" {
				// 	IFPSPart(newCID)
				// }
			}
		}
	}
}