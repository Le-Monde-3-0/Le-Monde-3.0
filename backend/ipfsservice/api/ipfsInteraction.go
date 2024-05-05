package api

import (
	"os"
	"fmt"
	shell "github.com/ipfs/go-ipfs-api"
)

//* This function is used to add the article file on IPFS
//* we use our docker image running on port 5001
func AddFileToIPFS() {
	sh := shell.NewShell("localhost:5001")

	file, err := os.Open("../articles.json")
	if err != nil {
		fmt.Println(err)
	}
	defer file.Close()

	// Add the file to IPFS
	cid, err := sh.Add(file)
	if err != nil {
		fmt.Println(err)
	}

	fmt.Println("File added to IPFS with CID:", cid)
}