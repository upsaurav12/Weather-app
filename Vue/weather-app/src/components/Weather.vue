<template>
    <h1>Hello this is weather page </h1>
   <div class="container">
     <form @submit.prevent="fetchWeather">
        <input type="text" v-model="city" placeholder="Enter the city name" required>
        <button type="submit">Get</button>
    </form>


    <div v-if="loading">Loading...</div>
    <div v-else-if="error">{{error}}</div>
    <div v-else-if="weather.name"> <!-- Only display if data is available -->
      <p><strong>City:</strong> {{ weather.name }}</p>
      <p v-if="weather.main"> <!-- Ensure weather.main is defined -->
        <strong>Temperature:</strong> {{ weather.main.temp }} K
        <br>
        <strong>Temperature:</strong> {{ (weather.main.temp - 273.15).toFixed(2) }} Celsius
        <br>
        <strong>Humidity:</strong> {{ weather.main.humidity }}%
        <br>
        <strong>Pressure:</strong> {{ weather.main.pressure.toFixed(2) }} hPa
        <br>
      </p>

      <p v-if="weather.Coord"> <!-- Safely check if Coord is defined -->
        <strong>Coordinates:</strong> Lon {{ weather.Coord.lon}}, Lat {{ weather.Coord.lat }}
      </p>

      <p v-if="weather.weather">
        <strong>Status: </strong> {{ weather.weather[0].main}}
        <strong>Description: </strong> {{ weather.weather[0].description}}
      </p>
    </div>
   </div>
</template>

<script>

import axios from 'axios';
export default {

    data(){
        return{
            weather: {},
            loading: false,
            error : null,
            city: '',
        };
    },
    methods :{
        fetchWeather(city){
            this.loading = true;

            axios.get(`http://localhost:8000/weather/${this.city}`)
            .then((response) => {
                this.weather = response.data
                this.loading = false;
            })
            .catch((error) => {
                this.error = 'Error fetching'
                this.loading = false
            })
        }
    },
}
</script>

<style scoped>
.container{
    border: 2px solid;
    padding: 5px;
    height: 50vh;
    width: 60vw;
    margin: auto;
}

.container form{
    padding: 7px;
    display: flex;
    align-items: center;
    justify-content: center;

}

.container input{
    border: 1px solid;
    width: 80%;
    padding: 7px 0 7px 5px;
    outline: none;
    border-radius: 5px;
}

.container button{
    padding: 4px;
    margin-left: 20px;
    border: none;
    padding: 8px 18px 8px 18px;
    border-radius: 4px ;
    outline: none;
    background-color: rgb(0, 134, 243);
}
</style>