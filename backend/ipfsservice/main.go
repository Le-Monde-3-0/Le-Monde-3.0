package main

import (
	t "main/trigger"
	"fmt"
	"github.com/joho/godotenv"
)

//* main function, load .env, call trigger
func main() {
	err := godotenv.Load(".env")
	if err != nil {
		fmt.Println("Error loading .env file")
	}

	t.IPFSTrigger()
}