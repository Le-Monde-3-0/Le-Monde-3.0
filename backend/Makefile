up:
	 docker compose up

down:
	 docker compose down

build:
	 docker compose up --build

tests:
	cd auth ; go test -cover ./router
	cd articles ; go test -cover ./router
	cd bookmarks ; go test -cover ./router

coverages:
	cd auth ; go test -coverprofile=coverage.out ./... ;  go tool cover -html=coverage.out
	cd articles ; go test -coverprofile=coverage.out ./... ;  go tool cover -html=coverage.out
	cd bookmarks ; go test -coverprofile=coverage.out ./... ;  go tool cover -html=coverage.out

doc:
	cd core ; swag init ; go build ; ./main
clean:
	rm -rf core/coverage.out
	rm -rf auth/coverage.out
	rm -rf articles/router/fakeAuth.db
	rm -rf articles/coverage.out
	rm -rf articles/router/fakeArticles.db
	rm -rf bookmarks/coverage.out
	rm -rf bookmarks/router/fakeBookmarks.db
