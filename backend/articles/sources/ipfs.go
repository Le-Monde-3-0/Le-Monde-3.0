package articles

import (
	"bytes"
	"encoding/json"
	"fmt"
	shell "github.com/ipfs/go-ipfs-api"
	"io/ioutil"
	"net/http"
	"os"
	"strings"
)

func ipfsRequest(method string, url string, requestBody interface{}) ([]byte, int, error) {
	jsonParams, err := json.Marshal(requestBody)
	if err != nil {
		return nil, http.StatusInternalServerError, err
	}

	request, err := http.NewRequest(method, url, bytes.NewBuffer(jsonParams))
	if err != nil {
		return nil, http.StatusInternalServerError, err
	}

	request.Header.Set("Content-Type", "application/json")
	request.Header.Set("X-Auth-Token", os.Getenv("X_AUTH_TOKEN"))
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

type PinnedArticle struct {
	Volume_id string `json:"volume_id" binding:"required"`
	Cid       string `json:"cid" binding:"required"`
	Name      string `json:"name" binding:"required"`
}

func AddInIPFS(article *Article) {
	sh := shell.NewShell("ipfs:5001")
	cid, err := sh.Add(strings.NewReader(article.Content))
	if err != nil {
		fmt.Fprintf(os.Stderr, "error: %s", err)
		os.Exit(1)
	}
	newPin := PinnedArticle{os.Getenv("VOLUME_ID"), cid, cid} // TODO add Name choice feature
	_, _, err = ipfsRequest(http.MethodPost, os.Getenv("SCALEWAY_PINNING_URL"), newPin)
	if err != nil {
		fmt.Println(err)
		return
	}
	fmt.Println("Successfully pinned") // TODO add get pin to check
}
