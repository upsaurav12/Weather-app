import { useEffect, useState } from "react";
import { WeatherData } from "./type";
import axios from "axios";
import './weather.css';

const Weather: React.FC = () => {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [weatherForecast, setWeatherForecast] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const apiKey = '2b02841851fadfe717b1834b2074c944';
    
    async function getUserLocation(): Promise<GeolocationPosition> {
      return new Promise((resolve, reject) => {
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(resolve, reject, {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 0,
          });
        } else {
          reject(new Error("Geolocation is not supported by this browser."));
        }
      });
    }

    async function getWeatherData(lat: number, lon: number): Promise<WeatherData> {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`
      );

      if (!response.ok) {
        throw new Error(`Error fetching weather data: ${response.statusText}`);
      }

      return response.json();
    }

    async function getWeatherForecast(lat: number, lon: number): Promise<WeatherData> {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`
      );

      if (!response.ok) {
        throw new Error(`Error fetching weather data: ${response.statusText}`);
      }

      return response.json();
    }

    async function showWeatherforForecast() {
      try {
        const position = await  getUserLocation();
        const {latitude , longitude} = position.coords;


        const weatherForecast = await getWeatherForecast(latitude , longitude);
        setWeatherForecast(weatherForecast)

        setLoading(false)
      } catch(error) {
        console.error('Failed to get Data :' ,error)
        setError('Unable to retrieve WEather forecast data : ', )
        setLoading(false);
      }
    }

    async function showWeatherForCurrentLocation() {
      try {
        // Get user's current location
        const position = await getUserLocation();
        const { latitude, longitude } = position.coords;

        // Fetch weather data for the current location
        const weatherData = await getWeatherData(latitude, longitude);
        setWeatherData(weatherData); // Set the weather data in state
        setLoading(false);
      } catch (error) {
        console.error('Failed to get weather data:', error);
        setError('Unable to retrieve weather data. Please ensure location services are enabled.');
        setLoading(false);
      }
    }

    // Call the function to show weather data for the user's location
    showWeatherforForecast();
    showWeatherForCurrentLocation();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <main>
      <div className="upper-hightlight flex justify-between items-center">
        <div className="upper-hightlight-left flex items-center">
          <div className="profile-circle"></div>
          <div className="user-info">
            <div className="user-name">Hi, Saurav</div>
            <div className="date">Tues, 03 Sept 2024</div>
          </div>
        </div>
        <div className="upper-hightlight-right mr-4">
          <div className="languages"></div>
        </div>
      </div>

      {weatherData && (
        <div className="upper-info flex">
          <div className="about-weather">
            <div className="profile-circle-2"></div>
            <h3 className="text-3xl">{weatherData.name}</h3>
            <h5 className="text-xl">{weatherData.sys.country}</h5>
            <div className="data-temperature">Temperature: {weatherData.main.temp}°C</div>
            <div className="data-humidity">Humidity: {weatherData.main.humidity}%</div>
            <div className="data-pressure">Pressure: {weatherData.main.pressure} hPa</div>
            <div className="data-weather">Weather: {weatherData.weather[0].description}</div>
          </div>
          <div className="map-container"></div>
        </div>
      )}
      {weatherForecast && (
        <div className="lower-info flex">
          <div className="forecast-next">
            <h2>5-Day Forecast</h2>
            <div className="forecast-container">
              {weatherForecast.list.map((forecast, index) => (
                <div key={index} className="forecast-item">
                  <div>{new Date(forecast.dt * 1000).toLocaleString()}</div>
                  <div>Temperature: {forecast.main.temp}°C</div>
                  <div>Weather: {forecast.weather[0].description}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="pollution"></div>
        </div>
      )}
    </main>
  );
};

export default Weather;
