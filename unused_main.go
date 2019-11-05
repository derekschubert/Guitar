package main

import (
	"log"
	"net/http"
	"os"

	"github.com/derekschubert/guitar/api/db"
	"github.com/gin-gonic/gin"
	// "github.com/derekschubert/guitar/api/"
)

func main() {
	router := gin.Default()
	database, err := db.Initialize()
	if err != nil {
		log.Panic(err)
	}
	defer database.Close()

	// declare & initialize controllers
	// taskController := controllers.TaskController{}
	// taskController.Init(database)

	router.Use(func(ctx *gin.Context) {
		//  ctx.Request.Method
		if ctx.Request.Header["Content-Length"][0] == "0" {
			ctx.JSON(http.StatusBadRequest, gin.H{"message": "Payload should not be empty"})
			ctx.AbortWithStatus(http.StatusBadRequest)
			return
		}
	})

	auth0 := initializeAuth0()

	router.LoadHTMLGlob("ui-dist/*.html")
	router.Static("/static", "./ui-dist/static")
	router.GET("/", func(ctx *gin.Context) {
		ctx.HTML(http.StatusOK, "index.html", auth0)
	})

	// Declare handlers for all API routes
	// router.POST("/api/tasks", middlewares.AuthMiddleware(), taskController.CreateTask)
	// router.GET("/api/tasks/:id", middlewares.AuthMiddleware(), taskController.GetTasksByID)

	port := os.Getenv("PORT")

	if port == "" {
		port = ":8080"
		log.Printf("Port not specified, defaulting to %s", port)
	} else if port[0] != ":"[0] { // ":"[0] -> quickly convert string to byte for comparison
		port = ":" + port
	}

	router.Run(port)
}

type auth0s struct {
	domain, clientID, audience, callback string
}

func initializeAuth0() auth0s {
	auth0 := auth0s{
		domain:   os.Getenv("AUTH0_DOMAIN"),
		clientID: os.Getenv("AUTH0_CLIENTID"),
		audience: os.Getenv("AUTH0_AUDIENCE"),
		callback: os.Getenv("AUTH0_CALLBACK"),
	}

	if auth0.domain == "" || auth0.clientID == "" || auth0.audience == "" || auth0.callback == "" {
		log.Fatalln("Missing auth0 environment variables!")
	}

	return auth0
}
