package api

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"net/http"
	"os"
)

//! globals
var (
	IPFS_HOST="ipfs_host"
	SCALEWAY_REGION_ID="fr-par"
	
	SCALEWAY_PIN_NAME="Le Monde 3.0 articles file"
	EXPORTFILENAME="articles.json"
)

//* Custom function to make http request with scalway auth
func MakeCustomHTTPRequest(method string, url string, requestBody interface{}) ([]byte, int, error) {
	jsonParams, err := json.Marshal(requestBody)
	if err != nil {
		return nil, http.StatusInternalServerError, err
	}

	request, err := http.NewRequest(method, url, bytes.NewBuffer(jsonParams))
	if err != nil {
		return nil, http.StatusInternalServerError, err
	}

	secretKey := os.Getenv("SCW_SECRET_KEY")

	request.Header.Set("Content-Type", "application/json")
	request.Header.Set("X-Auth-Token", secretKey)


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

//* Body for Update request
type UpdateBody struct {
	value string
}

//* Body for Pinning request
type PinCidBody struct {
	cid string
	name string
	volume_id string
}

//* Response from Update request
type UpdateResponse struct {
	NameID string `json:"name_id"`
	ProjectID string `json:"project_id"`
	CreatedAt string `json:"created_at"`
	UpdatedAt string `json:"updated_at"`
	Tags []string `json:"tags"`
	Name string `json:"name"`
	Key string `json:"key"`
	Status string `json:"status"`
	Value string `json:"value"`
	Region string `json:"region"`
}

//* Response from Pinning request
type PinCidResponse struct {
	NameID string `json:"name_id"`
	ProjectID string `json:"project_id"`
	CreatedAt string `json:"created_at"`
	UpdatedAt string `json:"updated_at"`
	Tags []string `json:"tags"`
	Name string `json:"name"`
	Key string `json:"key"`
	Status string `json:"status"`
	Value string `json:"value"`
	Region string `json:"region"`
}

//* Response from GET pins request
type GetPinsResponse struct {
	Pins []Names `json:"pins"`
	TotalCount string `json:"total_count"`
}
type Names struct {
	NameID string `json:"pin_id"`
	Status string `json:"status"`
	CreatedAt string `json:"created_at"`
}

//! In these function we use Scaleway API to interact with IPFS

//* function used to update our naming on IPFS with the new CID 
func UpdateNameWithCID(newCID string) {
	SCALEWAY_NAME_ID := os.Getenv("SCALEWAY_NAME_ID")

	url := "https://api.scaleway.com/ipfs/v1alpha1/regions/"+SCALEWAY_REGION_ID+"/names/"+SCALEWAY_NAME_ID
	body := UpdateBody{
		value: newCID,
	}

	responseBody, code, err := MakeCustomHTTPRequest(http.MethodPatch, url, body)
	println("code:", code)
	if err != nil {
		return
	}
	var response UpdateResponse
	json.Unmarshal(responseBody, &response)
}

//* function used to get the pins in our scaleway volume
func GetPins() []Names {
	SCALEWAY_VOLUME_ID := os.Getenv("SCALEWAY_VOLUME_ID")

	println(SCALEWAY_REGION_ID)
	println(SCALEWAY_VOLUME_ID)
	url := "https://api.scaleway.com/ipfs/v1alpha1/regions/"+SCALEWAY_REGION_ID+"/pins?order_by=created_at_asc&volume_id="+SCALEWAY_VOLUME_ID

	responseBody, code, err := MakeCustomHTTPRequest(http.MethodGet, url, nil)
	if err != nil {
		return nil
	}

	var resp GetPinsResponse
	json.Unmarshal(responseBody, &resp)

	var pins []Names = resp.Pins
	fmt.Println(code)
	for _, pin := range pins {
		fmt.Println("NameID: ", pin.NameID)
		fmt.Println("Status: ", pin.Status)
		fmt.Println("CreatedAt: ", pin.CreatedAt)
	}
	return pins
}

//* function used to delete the pins in our scaleway volume
func DeletePins(pins []Names) {
	SCALEWAY_VOLUME_ID := os.Getenv("SCALEWAY_VOLUME_ID")
	
	for _,pin := range pins {

		url := "https://api.scaleway.com/ipfs/v1alpha1/regions/"+SCALEWAY_REGION_ID+"/pins/"+pin.NameID+"?volumes/"+SCALEWAY_VOLUME_ID
	
		_, _, err := MakeCustomHTTPRequest(http.MethodDelete, url, nil)
		if err != nil {
			return
		}

	}
}

//* function used to pin the new cid pins in our scaleway volume
func PinCid(cid string, ) {
	SCALEWAY_VOLUME_ID := os.Getenv("SCALEWAY_VOLUME_ID")

	url := "https://api.scaleway.com/ipfs/v1alpha1/regions/"+SCALEWAY_REGION_ID+"/pins/create-by-cid"
	body := PinCidBody{
		cid: cid,
		name: SCALEWAY_PIN_NAME,
		volume_id: SCALEWAY_VOLUME_ID,
	}

	responseBody, _, err := MakeCustomHTTPRequest(http.MethodPost, url, body)
	if err != nil {
		return
	}

	var tmparticles PinCidBody
	json.Unmarshal(responseBody, &tmparticles)
}

//* function used to check the status of our pins on our scaleway volume
func CheckPinStatus() {
	SCALEWAY_VOLUME_ID := os.Getenv("SCALEWAY_VOLUME_ID")
	var status = "false"

	url := "https://api.scaleway.com/ipfs/v1alpha1/regions/"+SCALEWAY_REGION_ID+"/pins?order_by=created_at_asc&volume_id="+SCALEWAY_VOLUME_ID

	for status == "false" {
		responseBody, _, err := MakeCustomHTTPRequest(http.MethodGet, url, nil)
		
		if err != nil {
			return
		}
	
		var resp GetPinsResponse
		json.Unmarshal(responseBody, &resp)
	
		var pins []Names = resp.Pins

		status = pins[0].Status
	}
}