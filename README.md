# Weather Forecast Application

This project is a weather forecast application built with a Go backend and a Vue.js frontend. It retrieves weather information from the OpenWeatherMap API and displays it to users based on the city they input.

## Table of Contents

- [Project Overview](#project-overview)
- [Installation](#installation)
- [Backend Setup](#backend-setup)
- [Frontend Setup](#frontend-setup)
- [Usage](#usage)
- [Contributing](#contributing)
- [License](#license)

## Project Overview

This project allows users to fetch and display weather information by entering a city name in the frontend. The Go backend fetches data from OpenWeatherMap and returns it to the Vue.js frontend, where it's displayed to the user. The displayed information includes temperature, weather conditions, humidity, and more.

## Installation

To run this project, you need to install the following:

- [Go](https://golang.org/dl/): The programming language used for the backend.
- [Node.js](https://nodejs.org/): Required for building and running the Vue.js frontend.
- [Git](https://git-scm.com/): For version control and cloning the repository.
- [Vue.js](https://v3.ru.vuejs.org/guide/installation.html): For frontend work like routing , component etc.

### Clone the Repository

To clone the project, use the following Git command:

```bash
git clone <YOUR_REPOSITORY_URL>.git
```

Then go to weather-app directory by using this command.  
```bash
cd weather-app
```
Then by using this command install all the packages require to run the application
```bash
npm install (if you are using npm for installing packages)
```
For running frontend server run
```bash
npm run serve
```
For running backend server  first go in Go Directory by
```bash
cd Go
```
Then run:
```
go run weather.go
```


