package auth

import (
	"time"

	"github.com/lib/pq"
	"gorm.io/gorm"
)

type User struct {
	Id        uint `gorm:"primarykey"`
	CreatedAt time.Time
	UpdatedAt time.Time
	DeletedAt gorm.DeletedAt `gorm:"index"`
	Email     string
	Username  string
	Password  string
	Public bool
}

type ReturnedUser struct {
	Id        uint `gorm:"primarykey"`
	CreatedAt time.Time
	UpdatedAt time.Time
	DeletedAt gorm.DeletedAt `gorm:"index"`
	Email     string
	Username  string
	Public    bool
	Bookmarks []UserBookmarks
}

type ReceiveUser struct {
	Email string `json:"email"`
}

func FormatUserStruct(user *User, bookmarks []UserBookmarks) ReturnedUser {
	returnedUser := ReturnedUser{
		Id:        user.Id,
		CreatedAt: user.CreatedAt,
		UpdatedAt: user.UpdatedAt,
		DeletedAt: user.DeletedAt,
		Email:     user.Email,
		Username:  user.Username,
		Public:    user.Public,
		Bookmarks: bookmarks,
	}

	return returnedUser
}

type UserBookmarks struct {
	Label string
	Number pq.Int32Array
}