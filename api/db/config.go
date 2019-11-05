package db

import (
	"log"
	"os"
)

var (
	// Database is the primary var for interacting with the MySQL database
	Database UserDatabase
)

type cloudSQLConfig struct {
	Username, Password, Instance string
}

func configureCloudSQL(config cloudSQLConfig) (UserDatabase, error) {
	// Runs in Production
	if os.Getenv("GAE_INSTANCE") != "" {
		return newMySQLDB(MySQLConfig{
			Username:   config.Username,
			Password:   config.Password,
			UnixSocket: "/cloudsql/" + config.Instance,
		})
	}

	// Runs in local dev
	return newMySQLDB(MySQLConfig{
		Username: config.Username,
		Password: config.Password,
		Host:     "localhost",
		Port:     3306,
	})
}

// Initialize sets up the cloud SQL connection vars
func Initialize() {
	var err error

	Database, err = configureCloudSQL(cloudSQLConfig{
		Username: os.Getenv("USERNAME"),
		Password: os.Getenv("PASSWORD"),
		Instance: os.Getenv("INSTANCE"),
	})

	if err != nil {
		log.Fatal(err)
	}
}
