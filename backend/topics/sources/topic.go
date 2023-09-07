package sources

import (
	"gorm.io/gorm"
)

type Topic struct {
	gorm.Model
	name string
}