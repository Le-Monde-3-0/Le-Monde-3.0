package main

import (
	db "auth/database"
	r "auth/router"
)

func main() {
	var database = db.DatabaseInit()

	r := r.Router(database)

	r.Run(":8081")
}
