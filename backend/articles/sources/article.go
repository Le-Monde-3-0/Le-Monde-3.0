package articles

import (
	"gorm.io/gorm"
	"time"
)

type Record struct {
	UserId   int32 `gorm:"primaryKey"`
	LikeTime time.Time
}

type Article struct {
	Id         uint `gorm:"primarykey"`
	CreatedAt  time.Time
	UpdatedAt  time.Time
	DeletedAt  gorm.DeletedAt `gorm:"index"`
	UserId     int32
	AuthorName string
	Title      string
	Subtitle   string
	Content    string
	Topic      string
	Draft      bool
	//Likes                 pq.Int32Array `gorm:"type:integer[]"`
	Likes                 []Record `gorm:"-"`
	HasConnectedUserLiked bool
	Views                 []Record `gorm:"-"`
}
