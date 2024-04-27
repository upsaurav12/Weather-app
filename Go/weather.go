package main

import (
	"encoding/json"
	"io/ioutil"
	"log"
	"net/http"
	"strings"

	"github.com/gorilla/mux"
)

type apiConfigData struct {
	OpenWeatherMapApiKey string `json: "OpenWeatherMapApiKey"`
}

type Weather struct {
	Id          int32  `json:"id"`
	Main        string `json:"main"`
	Description string `json:"description"`
	Icon        string `json:"icon"`
}

type weatherData struct {
	Name string `json:"name"`

	Coord struct {
		Longitute float64 `json:"lon"`
		Latitude  float64 `json:"lat"`
	}

	Weather []Weather `json:"weather"`

	Main struct {
		Kelvin       float64 `json:"temp"`
		Humidity     float64 `json:"humidity"`
		Pressure     float64 `json:"pressure"`
		Feels_like   float64 `json:"feels_like"`
		Temp_min     float64 `json:"temp_min"`
		Temp_max     float64 `json:"temp_max"`
		Sea_level    int     `json:"sea_level"`
		Ground_level int     `json:"ground_level"`
	} `json:"main"`

	Visibility int32 `json:"visibility"`

	Wind struct {
		Speed float64 `json:"speed"`
		Deg   int32   `json:"deg"`
		Gust  float64 `json:"gust"`
	}

	Cloud struct {
		All int32 `json:"all"`
	}

	Timezone int32 `json:"timezone"`
}

func loadApiCongfig(filename string) (apiConfigData, error) {
	bytes, err := ioutil.ReadFile(filename)

	if err != nil {
		return apiConfigData{}, err
	}

	var c apiConfigData

	err = json.Unmarshal(bytes, &c)
	if err != nil {
		return apiConfigData{}, err
	}
	return c, nil
}

func hello(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	w.Write([]byte("Hello from go!\n"))
}

func query(city string) (weatherData, error) {
	apiConfig, err := loadApiCongfig(".apiConfig")
	if err != nil {
		return weatherData{}, err
	}
	resp, err := http.Get("http://api.openweathermap.org/data/2.5/weather?APPID=" + apiConfig.OpenWeatherMapApiKey + "&q=" + city)
	if err != nil {
		return weatherData{}, err
	}
	defer resp.Body.Close()

	var d weatherData
	if err := json.NewDecoder(resp.Body).Decode(&d); err != nil {
		return weatherData{}, err
	}
	return d, nil
}

func corsMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")

		if r.Method == http.MethodOptions {
			// Handle preflight request
			w.WriteHeader(http.StatusNoContent)
			return
		}

		next.ServeHTTP(w, r) // Continue with request handling
	})
}

func weatherHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	// Extract city name from the URL path
	city := strings.SplitN(r.URL.Path, "/", 3)[2]

	data, err := query(city)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json; charset=utf-8")
	json.NewEncoder(w).Encode(data)
}

func main() {

	r := mux.NewRouter()
	r.Use(corsMiddleware)

	r.HandleFunc("/hello", hello).Methods("GET")
	r.HandleFunc("/weather/{city}", weatherHandler).Methods("GET")

	log.Fatal(http.ListenAndServe(":8000", r))
}
