<template>
    <h1>Hello this is weather page </h1>
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
      </p>
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

<style>

</style>