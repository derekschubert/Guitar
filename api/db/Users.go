package db

import (
	"crypto/md5"
	"database/sql"
	"fmt"
	"io"
	"time"

	"github.com/derekschubert/guitar/api/util"

	"github.com/derekschubert/guitar/api/models"
)

// ensure mysqlDB matches UserDatabase struct
var _ UserDatabase = &mysqlDB{}

// UserDatabase provides access to the Users & Auth0 databases
type UserDatabase interface {
	// GetUsers retrieves all users from the DB (for admin and testing purposes ONLY)
	GetUsers() ([]*models.User, error)

	// GetUser retrieves a user & their preferences by their auth0ID. Returns UserPreferences, Error, and bool isNew
	GetUser(auth0ID string) (*models.UserPreferences, bool, error)

	// UpdateUser updates a user's preferences
	UpdateUser(auth0ID string, prefs *models.UserPreferences) error

	// CreateUser saves a new user, taking in an auth0ID and publicID string, and assigns it a new database ID
	CreateUser(auth0ID string, publicID string) (*models.UserPreferences, error)

	// DeleteUser removes a given user (takes in auth0ID) from the Users table
	DeleteUser(auth0ID string) error
}

func scanUser(u rowScanner) (*models.User, error) {
	var (
		id        int64
		auth0ID   sql.NullString
		publicID  sql.NullString
		createdAt sql.NullTime
	)

	if err := u.Scan(&id, &auth0ID, &publicID, &createdAt); err != nil {
		return nil, err
	}

	user := &models.User{
		ID:        id,
		Auth0ID:   auth0ID.String,
		PublicID:  publicID.String,
		CreatedAt: createdAt.Time,
	}

	return user, nil
}

func scanUserPreferences(u rowScanner) (*models.UserPreferences, error) {
	var (
		id                  int64
		capo                sql.NullInt32
		strings             sql.NullInt32
		frets               sql.NullInt32
		useScale            sql.NullBool
		showFretsBeforeCapo sql.NullBool
		selectedScale       sql.NullString
		tuning              sql.NullString
		scaleNotes          sql.NullString
		lastUpdated         sql.NullTime
	)

	if err := u.Scan(&id, &capo, &strings, &frets, &useScale, &showFretsBeforeCapo, &selectedScale, &tuning, &scaleNotes, &lastUpdated); err != nil {
		return nil, err
	}

	prefs := &models.UserPreferences{
		ID:                  id,
		Capo:                capo.Int32,
		Strings:             strings.Int32,
		Frets:               frets.Int32,
		UseScale:            useScale.Bool,
		ShowFretsBeforeCapo: showFretsBeforeCapo.Bool,
		SelectedScale:       selectedScale.String,
		Tuning:              tuning.String,
		ScaleNotes:          scaleNotes.String,
		LastUpdated:         lastUpdated.Time,
	}

	return prefs, nil
}

// GET USERS (admin and testing purposes ONLY)
const getUsersStmt = `SELECT * FROM users`

func (db *mysqlDB) GetUsers() ([]*models.User, error) {
	rows, err := db.getUsers.Query()
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var users []*models.User
	for rows.Next() {
		user, err := scanUser(rows)
		if err != nil {
			return nil, fmt.Errorf("mysql: could not read user row: %v", err)
		}
		users = append(users, user)
	}

	return users, nil
}

// GET USER's PREFERENCES (and create user & prefs if doesn't yet exist) using their auth0ID
const getUserStmt = `SELECT user_id, capo, strings, frets, useScale, showFretsBeforeCapo, selectedScale, tuning, scaleNotes, last_updated
	FROM user_preferences AS up
	INNER JOIN users AS u ON u.id = up.user_id
	WHERE u.auth0ID = ?`

func (db *mysqlDB) GetUser(auth0ID string) (*models.UserPreferences, bool, error) {
	prefs, err := scanUserPreferences(db.getUser.QueryRow(auth0ID))

	// user might not yet be in the system since we are implementing Auth0
	if err == sql.ErrNoRows {
		// Generate public ID for clientside comparisons of state (localStorage vs serverData)
		pbl := md5.New()
		io.WriteString(pbl, auth0ID)
		publicID := fmt.Sprintf("%x", pbl.Sum(nil))

		prefs, err := db.CreateUser(auth0ID, publicID)
		if err != nil {
			return nil, false, fmt.Errorf("mysql: user not found - error creating new user: %v", err)
		}

		// zero out ID for returning JSON
		prefs.ID = 0
		return prefs, true, nil
	}
	if err != nil {
		return nil, false, fmt.Errorf("mysql: could not get user: %v", err)
	}

	// zero out ID for returning JSON
	prefs.ID = 0
	return prefs, false, nil
}

// UPDATE USER PREFERENCES
// UPDATE table SET cols WHERE condition
const updateUserPreferencesStmt = `UPDATE user_preferences AS p
	INNER JOIN users AS u
	ON u.id = p.user_id
	SET p.capo=?, p.strings=?, p.frets=?, p.useScale=?, p.showFretsBeforeCapo=?, 
			p.selectedScale=?, p.tuning=?, p.scaleNotes=?, p.last_updated=?
	WHERE u.auth0ID = ?`

func (db *mysqlDB) UpdateUser(auth0ID string, prefs *models.UserPreferences) error {
	fmt.Println("INSIDE USERS.GO: UPDATE USER!")
	if auth0ID == "" {
		return fmt.Errorf("mysql: passed empty auth0ID into %v", "UpdateUser")
	}
	xp := util.ConvertStructToSlice(*prefs)
	xp = xp[1:]                // remove ID
	xp[len(xp)-1] = time.Now() // new last_updated time
	xp = append(xp, auth0ID)

	fmt.Println("Users.go: UPDATE USER --")
	fmt.Println(xp)
	_, err := execAffectingOneRow(db.updateUser, xp...)
	fmt.Println("-- END UPDATE USER --")
	return err
}

// CREATE NEW USER & USER PREFERENCES
const createUserStmt = `INSERT INTO users (auth0ID, publicID) values (?, ?)`
const createUserPreferencesStmt = `INSERT INTO user_preferences 
	(user_id, capo, strings, frets, useScale, showFretsBeforeCapo, selectedScale, tuning, scaleNotes, last_updated) 
	values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`

func (db *mysqlDB) CreateUser(auth0ID string, publicID string) (*models.UserPreferences, error) {
	row, err := execAffectingOneRow(db.createUser, auth0ID, publicID)
	if err != nil {
		return nil, err
	}

	id, err := row.LastInsertId()
	if err != nil {
		return nil, fmt.Errorf("mysql: could not get last insert ID: %v", err)
	}

	dup, xdup := models.CreateDefaultUserPreferences(id)

	_, err = execAffectingOneRow(db.createUserPreferences, xdup...)
	if err != nil {
		return nil, fmt.Errorf("mysql: could not create default user preferences: %v", err)
	}

	return dup, nil
}

// DELETE A USER - delete cascades to UserPreferences table on SQL level
const deleteUserStmt = `DELETE FROM users WHERE auth0ID = ?`

func (db *mysqlDB) DeleteUser(auth0ID string) error {
	if auth0ID == "" {
		return fmt.Errorf("mysql: passed empty auth0ID into %v", "DeleteUser")
	}
	_, err := execAffectingOneRow(db.deleteUser, auth0ID)
	return err
}
