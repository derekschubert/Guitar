package models

import (
	"time"

	"github.com/derekschubert/guitar/api/util"
)

// UserPreferences is a MySQL struct of the User and their settings
type UserPreferences struct {
	ID                   int64
	Capo                 int32     `json:"capo"`
	Strings              int32     `json:"strings"`
	Frets                int32     `json:"frets"`
	UseScale             bool      `json:"useScale"`
	ShowFretsBeforeCapo  bool      `json:"showFretsBeforeCapo"`
	ShowFretCountAbove   bool      `json:"showFretCountAbove"`
	ShowFretCountBelow   bool      `json:"showFretCountBelow"`
	StartFretCountAtCapo bool      `json:"startFretCountAtCapo"`
	SelectedScale        string    `json:"selectedScale"`
	Tuning               string    `json:"tuning"`
	ScaleNotes           string    `json:"scaleNotes"`
	LastUpdated          time.Time `json:"lastUpdated"`
}

// CreateDefaultUserPreferences returns default User Preferences, and a slice of the struct's values
func CreateDefaultUserPreferences(id int64) (*UserPreferences, []interface{}) {
	dup := UserPreferences{
		ID:                   id,
		Capo:                 0,
		Strings:              6,
		Frets:                12,
		UseScale:             false,
		ShowFretsBeforeCapo:  false,
		ShowFretCountAbove:   true,
		ShowFretCountBelow:   true,
		StartFretCountAtCapo: false,
		SelectedScale:        "major",
		Tuning:               "[4, 9, 2, 7, 11, 4]",
		ScaleNotes:           "[0, 2, 4, 5, 7, 9, 11]",
		LastUpdated:          time.Now(),
	}

	xdup := util.ConvertStructToSlice(dup)

	return &dup, xdup
}
