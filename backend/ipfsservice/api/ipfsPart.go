package api

import (
	"bytes"
	"encoding/json"
	"io/ioutil"
	"net/http"
	"os"
)

//! globals
var (
	IPFS_HOST="ipfs_host"
	SCALEWAY_REGION_ID="fr-par"
	

	SCALEWAY_VOLUME_ID= os.Getenv("SCALEWAY_VOLUME_ID")
	SCALEWAY_NAME_ID= os.Getenv("SCALEWAY_NAME_ID")
	SCALEWAY_NAME_VALUE= os.Getenv("SCALEWAY_NAME_VALUE")
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
	name_id string
	project_id string
	created_at string
	updated_at string
	tags []string
	name string
	key string
	status string
	value string
	region string
}

//* Response from Pinning request
type PinCidResponse struct {
	pin_id string
	status string
	created_at string
}

//* Response from GET pins request
type GetPinsResponse struct {
	total_count int32
	pins []PinCidResponse
}

type CheckPinStatusResponse struct {}

//! In these function we use scaleway API to interact with IPFS

//* function used to update our naming on IPFS with the new CID 
func UpdateNameWithCID(newcid string) {
	url := "https://api.scaleway.com/ipfs/v1alpha1/regions/"+SCALEWAY_REGION_ID+"/names/"+SCALEWAY_NAME_ID
	body := UpdateBody{
		value: newcid,
	}

	responseBody, _, err := MakeCustomHTTPRequest(http.MethodPatch, url, body)
	if err != nil {
		return
	}

	var tmparticles UpdateResponse
	json.Unmarshal(responseBody, &tmparticles)
}

//* function used to get the pins in our scaleway volume
func GetPins() []PinCidResponse {
	url := "https://api.scaleway.com/ipfs/v1alpha1/regions/"+SCALEWAY_REGION_ID+"/pins?order_by=created_at_asc&volume_id="+SCALEWAY_VOLUME_ID

	responseBody, _, err := MakeCustomHTTPRequest(http.MethodGet, url, nil)
	if err != nil {
		return nil
	}

	var resp GetPinsResponse
	json.Unmarshal(responseBody, &resp)

	pins := resp.pins

	return pins
}

//* function used to delete the pins in our scaleway volume
func DeletePins(pins []PinCidResponse) {
	
	for _,pin := range pins {

		url := "https://api.scaleway.com/ipfs/v1alpha1/regions/"+SCALEWAY_REGION_ID+"/pins/"+pin.pin_id+"?volumes/"+SCALEWAY_VOLUME_ID
	
		_, _, err := MakeCustomHTTPRequest(http.MethodDelete, url, nil)
		if err != nil {
			return
		}


	}
}

//* function used to pin the new cid pins in our scaleway volume
func PinCid(cid string, ) {
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
	url := "https://api.scaleway.com/ipfs/v1alpha1/regions/"+SCALEWAY_REGION_ID+"/pins?order_by=created_at_asc&volume_id="+SCALEWAY_VOLUME_ID

	responseBody, _, err := MakeCustomHTTPRequest(http.MethodGet, url, nil)
	if err != nil {
		return
	}

	var tmparticles PinCidBody
	json.Unmarshal(responseBody, &tmparticles)
}