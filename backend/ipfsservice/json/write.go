package json

import (
	a "main/api"
	"encoding/json"
	"fmt"
	"os"
)

//* Function used to write the articles into a json file
func WriteInFile(ipfsArticles []a.IPFSArticle) {
	jsonData, err := json.MarshalIndent(ipfsArticles, "", "    ")
	if err != nil {
		fmt.Println("Error marshaling to JSON:", err)
		return
	}

	// Join the parent directory and filename to get the complete path
	filePath := "../articles.json"

	// Write JSON data to file
	file, err := os.Create(filePath)
	if err != nil {
		fmt.Println("Error creating file:", err)
		return
	}
	defer file.Close()

	_, err = file.Write(jsonData)
	if err != nil {
		fmt.Println("Error writing JSON data to file:", err)
		return
	}

	fmt.Println("JSON data written to articles.json successfully.")
}