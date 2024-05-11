package articles

import (
	"gorm.io/gorm"
	"time"
)

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
	Likes                 []RecordLike `gorm:"foreignKey:ArticleID"`
	HasConnectedUserLiked bool
	Views                 []RecordView `gorm:"foreignKey:ArticleID"`
}

type RecordView struct {
	ID        uint `gorm:"primaryKey"`
	ArticleID uint // Foreign key
	UserId    int32
	LikeTime  time.Time
}

type RecordLike struct {
	ID        uint `gorm:"primaryKey"`
	ArticleID uint // Foreign key
	UserId    int32
	LikeTime  time.Time
}
