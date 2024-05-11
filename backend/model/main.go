package main

import (
	db "model/database"
	r "model/router"
)

func main() {
	var database = db.DatabaseInit()

	r := r.Router(database)

	// TODO Edit to a free port
	r.Run(":80XX")
}
