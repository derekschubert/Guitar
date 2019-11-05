package db

/**
* db.go is the core file for setting up and managing database calls.
* All code directly related to calling specific tables can be found in their respective go files.
*
* Add any new tables to ensureTableExists
* Add any new sql statements to mySQLDB struct & newMYSQLDB()
 */

import (
	"database/sql"
	"database/sql/driver"
	"fmt"

	"github.com/go-sql-driver/mysql"
)

var createTableStatements = []string{
	`CREATE DATABASE IF NOT EXISTS guitar DEFAULT CHARACTER SET = 'utf8' DEFAULT COLLATE 'utf8_general_ci';`,
	`USE guitar;`,
	`CREATE TABLE IF NOT EXISTS users (
		id INT UNSIGNED NOT NULL AUTO_INCREMENT,
		auth0ID VARCHAR(255) NULL,
		publicID VARCHAR(255) NULL,
		created_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
		PRIMARY KEY (id),
		UNIQUE INDEX id_UNIQUE (id ASC)
	)`,
	`CREATE TABLE IF NOT EXISTS user_preferences (
		user_id INT UNSIGNED NOT NULL,
		capo INT NULL,
		strings INT NULL,
		frets INT NULL,
		useScale TINYINT(1) NULL,
		showFretsBeforeCapo TINYINT(1) NULL,
		selectedScale VARCHAR(45) NULL,
		tuning VARCHAR(255) NULL,
		scaleNotes VARCHAR(255) NULL,
		last_updated TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
		INDEX fk_user_preferences_users_idx (user_id ASC),
		PRIMARY KEY (user_id),
		CONSTRAINT fk_user_preferences_users
			FOREIGN KEY (user_id)
			REFERENCES guitar.users (id)
			ON DELETE CASCADE
	)`,
}

type mysqlDB struct {
	conn *sql.DB

	getUsers              *sql.Stmt
	getUser               *sql.Stmt
	updateUser            *sql.Stmt
	createUser            *sql.Stmt
	createUserPreferences *sql.Stmt
	deleteUser            *sql.Stmt
}

// newMySQLDB creates a new UserDatabase backed by our MySQL server and prepares all sql statements
func newMySQLDB(config MySQLConfig) (UserDatabase, error) {
	if err := config.ensureTableExists(); err != nil {
		return nil, err
	}

	// format like GET url (?param1=something&param2=something&...)
	connParams := "?parseTime=true"
	dsn := fmt.Sprintf("%v%v", config.dataStoreName("guitar"), connParams)

	conn, err := sql.Open("mysql", dsn)
	if err != nil {
		return nil, fmt.Errorf("mysql: could not get a connection: %v", err)
	}
	if err := conn.Ping(); err != nil {
		conn.Close()
		return nil, fmt.Errorf("mysql: could not establish a good connection: %v", err)
	}

	db := &mysqlDB{
		conn: conn,
	}

	// PREPARE ALL QUERY STATEMENTS HERE
	if db.getUsers, err = conn.Prepare(getUsersStmt); err != nil {
		return nil, fmt.Errorf("mysql: prepare getUsers: %v", err)
	}
	if db.getUser, err = conn.Prepare(getUserStmt); err != nil {
		return nil, fmt.Errorf("mysql: prepare getUser: %v", err)
	}
	// if db.updateUser, err = conn.Prepare(updateUserPreferencesStmt); err != nil {
	// 	return nil, fmt.Errorf("mysql: prepare updateUser: %v", err)
	// }
	if db.createUser, err = conn.Prepare(createUserStmt); err != nil {
		return nil, fmt.Errorf("mysql: prepare createUser: %v", err)
	}
	if db.createUserPreferences, err = conn.Prepare(createUserPreferencesStmt); err != nil {
		return nil, fmt.Errorf("mysql: prepare createUserStmt: %v", err)
	}
	if db.deleteUser, err = conn.Prepare(deleteUserStmt); err != nil {
		return nil, fmt.Errorf("mysql: prepare deleteUser: %v", err)
	}

	return db, nil
}

// Close closes up the database connection
func (db *mysqlDB) Close() error {
	err := db.conn.Close()
	if err != nil {
		return err
	}
	return nil
}

// MySQLConfig defines the structure of data required to connect to the MySQL cloud server
type MySQLConfig struct {
	Username, Password string
	Host               string
	Port               int    // if Port is set, UnixSocket should be unset
	UnixSocket         string // if UnixSocket is set, Port should be unset
}

func (config MySQLConfig) dataStoreName(databaseName string) string {
	var cred string

	if config.Username != "" {
		cred = config.Username
		if config.Password != "" {
			cred = cred + ":" + config.Password
		}
		cred = cred + "@"
	}

	if config.UnixSocket != "" {
		return fmt.Sprintf("%sunix(%s)/%s", cred, config.UnixSocket, databaseName)
	}
	return fmt.Sprintf("%stcp([%s]:%d)/%s", cred, config.Host, config.Port, databaseName)
}

// ensureTableExists checks if the table exists, and if not, creates it.
func (config MySQLConfig) ensureTableExists() error {
	conn, err := sql.Open("mysql", config.dataStoreName("guitar"))
	if err != nil {
		return fmt.Errorf("mysql: could not get a connection: %v", err)
	}
	defer conn.Close()

	// Check connection
	if conn.Ping() == driver.ErrBadConn {
		return fmt.Errorf("mysql: could not connect to the database. Could be a bad address, or this address is not whitelisted for access")
	}

	// MySQL err 1049 = "database does not exist"
	if _, err := conn.Exec("USE guitar"); err != nil {
		if mErr, ok := err.(*mysql.MySQLError); ok && mErr.Number == 1049 {
			return createTable(conn)
		}
	}

	// CHECK FOR ALL TABLES HERE
	// MySQL err 1146 = "table does not exist"
	if _, err := conn.Exec("DESCRIBE users"); err != nil {
		if mErr, ok := err.(*mysql.MySQLError); ok && mErr.Number == 1146 {
			return createTable(conn)
		}
	}

	if _, err := conn.Exec("DESCRIBE user_preferences"); err != nil {
		if mErr, ok := err.(*mysql.MySQLError); ok && mErr.Number == 1146 {
			return createTable(conn)
		}
	}
	return nil
}

// createTable creates the table & (if necessary) the database
func createTable(conn *sql.DB) error {
	for _, stmt := range createTableStatements {
		_, err := conn.Exec(stmt)
		if err != nil {
			return err
		}
	}
	return nil
}

// execAffectingOneRow executes a given statement, expecting only one row to be affected
func execAffectingOneRow(stmt *sql.Stmt, args ...interface{}) (sql.Result, error) {
	r, err := stmt.Exec(args...)
	if err != nil {
		return r, fmt.Errorf("mysql: could not execute statement: %v", err)
	}

	rowsAffected, err := r.RowsAffected()
	if err != nil {
		return r, fmt.Errorf("mysql: ould not get rows affected: %v", err)
	} else if rowsAffected != 1 {
		return r, fmt.Errorf("mysql: expected 1 row affected, got %d", rowsAffected)
	}

	return r, nil
}

// QueryRow returns type Row, which has method Scan(dest ...interface{}) error
type rowScanner interface {
	Scan(dest ...interface{}) error
}
