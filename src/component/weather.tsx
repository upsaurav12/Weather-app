import { useEffect, useState } from "react";
import { WeatherData, ForecastData } from "./type"; // Ensure you import ForecastData
import './weather.css';
import axios from 'axios'; 

const Weather: React.FC = () => {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [weatherForecast, setWeatherForecast] = useState<ForecastData | null>(null); // Update type here
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

    async function getWeatherForecast(lat: number, lon: number): Promise<ForecastData> {
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
        const position = await getUserLocation();
        const { latitude, longitude } = position.coords;

        const weatherForecast = await getWeatherForecast(latitude, longitude);
        setWeatherForecast(weatherForecast);

        setLoading(false);
      } catch (error) {
        console.error('Failed to get Data :', error);
        setError('Unable to retrieve Weather forecast data.');
        setLoading(false);
      }
    }

    async function showWeatherForCurrentLocation() {
      try {
        const position = await getUserLocation();
        const { latitude, longitude } = position.coords;

        const weatherData = await getWeatherData(latitude, longitude);
        setWeatherData(weatherData);
        setLoading(false);
      } catch (error) {
        console.error('Failed to get weather data:', error);
        setError('Unable to retrieve weather data. Please ensure location services are enabled.');
        setLoading(false);
      }
    }

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
      {/* 
        
      */}
        {weatherForecast && (
  <div className="forecast-next">
    <h2>5-Day Forecast</h2>
    <div className="forecast-items">
      {weatherForecast.list.slice(0, 4).map((forecast, index) => (
        <div key={index} className="forecast-item">
          <p>{new Date(forecast.dt * 1000).toLocaleString()}</p>
          <p>Temp: {forecast.main.temp}°C</p>
          <p>{forecast.weather[0].description}</p>
          <img 
            src={`https://openweathermap.org/img/wn/${forecast.weather[0].icon}.png`} 
            alt={forecast.weather[0].description} 
          />
        </div>
      ))}
    </div>
  </div>
)}


    </main>
  );
};

export default Weather;
