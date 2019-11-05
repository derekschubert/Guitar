package models

import "time"

// User is the structure of data in the Users table
type User struct {
	ID        int64
	Auth0ID   string
	PublicID  string
	CreatedAt time.Time
}
