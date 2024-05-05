package articles

import (
	"github.com/lib/pq"
	"gorm.io/gorm"
	"time"
)

type Article struct {
	Id                    uint `gorm:"primarykey"`
	CreatedAt             time.Time
	UpdatedAt             time.Time
	DeletedAt             gorm.DeletedAt `gorm:"index"`
	UserId                int32
	AuthorName            string
	Title                 string
	Subtitle              string
	Content               string
	Topic                 string
	Draft                 bool
	Likes                 pq.Int32Array `gorm:"type:integer[]"`
	HasConnectedUserLiked bool
}
