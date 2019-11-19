package main

/*
	TODO:
	- incorporate appError
	- setup go/logging for production logs
*/

import (
	"bufio"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"log"
	"net/http"
	"os"
	"strings"
	"time"

	"github.com/derekschubert/guitar/api/db"
	"github.com/derekschubert/guitar/api/models"

	"github.com/gorilla/mux"
	"github.com/rs/cors"
	// "cloud.google.com/go/logging"
)

// initialize environment with variables in .env file
func init() {
	fmt.Print("Setting up environment...")
	env, err := os.Open(".env")
	if err != nil {
		fmt.Printf("error reading .env file: %v\n", err)
		return
	}
	defer env.Close()

	scanner := bufio.NewScanner(env)
	for scanner.Scan() {
		xs := strings.Split(scanner.Text(), "=")

		// If .env line is empty or is a comment, skip to next line
		if xs[0] == "" || xs[0][0] == "#"[0] {
			continue
		}

		if len(xs) != 2 {
			fmt.Printf("missing expression for var %v\n", xs)
			return
		}
		if xs[0] == "" || xs[1] == "" {
			fmt.Printf("var or expression cannot be empty: %v\n", xs)
			return
		}

		os.Setenv(xs[0], xs[1])
	}
	fmt.Print(" success!\n")
}

type appError struct {
	Error   error
	Message string
	Code    int
}

type appHandler func(http.ResponseWriter, *http.Request) *appError

func (h appHandler) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	// err is appError type
	if err := h(w, r); err != nil {
		log.Printf("Handler error | Status: %d, Message: %s, Underlying Err: %#v",
			err.Code, err.Message, err.Error,
		)
		http.Error(w, err.Message, err.Code)
	}
}

func appErrorF(err error, format string, v ...interface{}) *appError {
	return &appError{
		Error:   err,
		Message: fmt.Sprintf(format, v...),
		Code:    500,
	}
}

func main() {
	// db/config.go - configure cloudSQL connection
	db.Initialize()

	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	router := registerHandlers()

	c := cors.New(cors.Options{
		// TODO get production URL and add to AllowedOrigins
		AllowedOrigins: []string{"http://localhost:3000"},
		AllowedMethods: []string{
			http.MethodGet,
			http.MethodPost,
			// http.MethodPut,
			// http.MethodPatch,
			http.MethodDelete,
		},
		AllowedHeaders: []string{
			"Accept",
			"Content-Type",
			"Content-Length",
			"Accept-Encoding",
			"X-CSRF-Token",
			"Authorization",
			"X-Auth0-ID",
			"X-Secret-Get-Users-Key",
		},
	})

	serverAddress := fmt.Sprintf("localhost:%v", port)

	server := &http.Server{
		Handler:      c.Handler(router),
		Addr:         serverAddress,
		WriteTimeout: 15 * time.Second,
		ReadTimeout:  15 * time.Second,
	}

	log.Fatal(server.ListenAndServe())
}

func registerHandlers() *mux.Router {
	r := mux.NewRouter()

	// Requires you to set special header w/ secret key
	if os.Getenv("GET_ALL_USERS") == "true" {
		r.Methods("GET").Path("/users").
			Handler(appHandler(getUsers))
	}

	r.Methods("GET").Path("/user").
		Handler(appHandler(getUser))

	r.Methods("POST").Path("/user").
		Handler(appHandler(updateUser))

	r.Methods("DELETE").Path("/user").
		Handler(appHandler(deleteUser))

	return r
}

func getUsers(w http.ResponseWriter, r *http.Request) *appError {
	passedKey := r.Header.Get("X-Secret-Get-Users-Key")
	secretKey := os.Getenv("GET_ALL_USERS_SECRET")

	if passedKey == secretKey {
		users, err := db.Database.GetUsers()
		if err != nil {
			fmt.Printf("Main.go: getUsers error: %v\n", err)
			return nil
		}
		json.NewEncoder(w).Encode(users)
	}

	return nil
}

// gets a user & their user preferences
func getUser(w http.ResponseWriter, r *http.Request) *appError {
	auth0ID := r.Header.Get("X-Auth0-ID")

	user, isNew, err := db.Database.GetUser(auth0ID)
	if err != nil {
		fmt.Printf("Main.go:getUser error: %v\n", err)
		return nil
	}

	// user just created, set appropriate header
	if isNew {
		w.WriteHeader(http.StatusCreated)
	}
	fmt.Println("Got User:", user)
	json.NewEncoder(w).Encode(user)

	return nil
}

func updateUser(w http.ResponseWriter, r *http.Request) *appError {
	fmt.Println("INSIDE UPDATE USER")

	auth0ID := r.Header.Get("X-Auth0-ID")
	fmt.Println(auth0ID)

	rb, err := ioutil.ReadAll(r.Body)
	if err != nil {
		fmt.Printf("Main.go:updateUser error reading req body: %v", err)
		return nil
	}

	var prefs models.UserPreferences
	json.Unmarshal(rb, &prefs)

	fmt.Println("got user prefs:", prefs)

	err = db.Database.UpdateUser(auth0ID, &prefs)
	if err != nil {
		fmt.Printf("Main.go:updateUser error in db update user: %v", err)
	}

	fmt.Println("LEAVING UPDATE USER")
	return nil
}

func deleteUser(w http.ResponseWriter, r *http.Request) *appError {
	auth0ID := r.Header.Get("X-Auth0-ID")

	if auth0ID == "" || auth0ID == "*" || len(auth0ID) < 4 {
		fmt.Printf("api: error deleting user - invalid auth0ID: %v", auth0ID)
		return nil
	}

	var success bool
	err := db.Database.DeleteUser(auth0ID)
	if err != nil {
		fmt.Printf("api/mysql: error deleting user - %v\n", err)
		success = false
	} else {
		success = true
	}

	json.NewEncoder(w).Encode(success)

	return nil
}
