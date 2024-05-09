package api

import (
	"time"
	"github.com/lib/pq"
)

//* Article struct for IPFS file
type IPFSArticle struct {
	Id int32 `json:"id"`
	Cid string `json:"cid"`
	Titre string `json:"titre"`
	Subtitle string `json:"subtitle"`
	Content string `json:"content"`
	Topic string `json:"topic"`
	AuthorName string `json:"author_name"`
	CreationDate time.Time `json:"creation_date"`
	ModificationDate time.Time `json:"modification_date"`
	Likes int32 `json:"likes"`
	TotalViews int32 `json:"TotalViews"`
    DailyViews pq.Int32Array `json:"DailyViews"`
    DailyLikes pq.Int32Array `json:"DailyLikes"`
}

