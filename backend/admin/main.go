package main

import (
	db "admin/database"
	r "admin/router"
)

func main() {
	var database = db.DatabaseInit()

	r := r.Router(database)

	r.Run(":8081")
}
