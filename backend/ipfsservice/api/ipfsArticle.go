package api

import (
	"github.com/lib/pq"
)

//* Article struct retreived from db
type BindArticles struct {
	AuthorName string
    Content string
    CreatedAt string
    DeletedAt string
    Draft bool
    ID int32
    Id int32
    Likes pq.Int32Array
    Subtitle string
    Title string
    Topic string
    UpdatedAt string
    UserId int32
}

//* Article struct for IPFS file
type IPFSArticle struct {
	Id int32 `json:"id"`
	Cid string `json:"cid"`
	Titre string `json:"titre"`
	Subtitle string `json:"subtitle"`
	Content string `json:"content"`
	Topic string `json:"topic"`
	AuthorName string `json:"author_name"`
	CreationDate string `json:"creation_date"`
	ModificationDate string `json:"modification_date"`
	Likes int32 `json:"likes"`
}

