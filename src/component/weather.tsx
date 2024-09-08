import { useEffect, useState } from "react";
import { WeatherData, ForecastData, Pollution } from "./type"; // Ensure you import ForecastData
import './weather.css';

const Weather: React.FC = () => {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [weatherForecast, setWeatherForecast] = useState<ForecastData | null>(null);
  //const [pollutionData, setPollutionData] = useState<Pollution | null>(null);
  const [pastPollution, setPastPollution] = useState<Pollution | null>(null);
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
/*
    async function getPollution(lat: number, lon: number): Promise<Pollution> {
      const response = await fetch(
        `http://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${apiKey}`
      );

      if (!response.ok) {
        throw new Error(`Error in fetching Pollution Data: ${response.statusText}`);
      }

      return response.json();
    }*/

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
        throw new Error(`Error fetching weather forecast data: ${response.statusText}`);
      }

      return response.json();
    }

    async function getPastPollution(lat: number, lon: number, start: number, end: number): Promise<Pollution> {
      const response = await fetch(
        `http://api.openweathermap.org/data/2.5/air_pollution/history?lat=${lat}&lon=${lon}&start=${start}&end=${end}&appid=${apiKey}`
      );

      if (!response.ok) {
        throw new Error(`Error While fetching past pollution data: ${response.statusText}`);
      }

      return response.json();
    }

    async function showPollutionPast() {
      try {
        const position = await getUserLocation();
        const { latitude, longitude } = position.coords;

        const endDate = new Date();
        const endUnix = Math.floor(endDate.getTime() / 1000);

        const startDate = new Date();
        startDate.setDate(endDate.getDate() - 7);
        const startUnix = Math.floor(startDate.getTime() / 1000);

        const pastPollution = await getPastPollution(latitude, longitude, startUnix, endUnix);
        setPastPollution(pastPollution);
      } catch (error) {
        console.error("Error:", error);
        setError('Unable to fetch past pollution data.');
      } finally {
        setLoading(false);
      }
    }

    async function showWeatherforForecast() {
      try {
        const position = await getUserLocation();
        const { latitude, longitude } = position.coords;

        const weatherForecast = await getWeatherForecast(latitude, longitude);
        setWeatherForecast(weatherForecast);
      } catch (error) {
        console.error('Failed to get forecast data:', error);
        setError('Unable to retrieve weather forecast data.');
      } finally {
        setLoading(false);
      }
    }
/*
    async function showPollution() {
      try {
        const position = await getUserLocation();
        const { latitude, longitude } = position.coords;

        const pollution = await getPollution(latitude, longitude);
        setPollutionData(pollution);
      } catch (error) {
        console.error('Failed to get pollution data:', error);
        setError('Unable to retrieve pollution data.');
      }
    }*/

    async function showWeatherForCurrentLocation() {
      try {
        const position = await getUserLocation();
        const { latitude, longitude } = position.coords;

        const weatherData = await getWeatherData(latitude, longitude);
        setWeatherData(weatherData);
      } catch (error) {
        console.error('Failed to get weather data:', error);
        setError('Unable to retrieve weather data. Please ensure location services are enabled.');
      } finally {
        setLoading(false);
      }
    }

    showWeatherforForecast();
    showWeatherForCurrentLocation();
    //showPollution();
    showPollutionPast();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <main>

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
          <div className="map-container">
            {/* Map or other content */}
            <div className="weather-info-container flex">
          <div className="weather-box">Temp: {weatherData.main.temp}°C</div>
          <div className="weather-box">Humidity: {weatherData.main.humidity}%</div>
          <div className="weather-box">Wind: {weatherData.wind.speed} m/s</div>
        </div>
          </div>
        </div>
      )}

      <div className="lower-info flex">
        {weatherForecast && (
          <div className="forecast-next">
            <h2 className="text-3xl ml-4 mt-2">5-Day Forecast</h2>
            <div className="forecast-items ml-4 mt-4 flex justify-around">
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

        {pastPollution && (
          <div className="pollution">
            <h2 className="text-3xl">Past Pollution Data (Last 7 Days)</h2>
            <div className="pollution-details flex justify-evenly">
              {/* Customize the display as needed */}
              {pastPollution.list.slice(0,3).map((data, index) => (
                <div key={index} className="pollution-item">
                  <p>Date: {new Date(data.dt * 1000).toLocaleDateString()}</p>
                  <p>AQI: {data.main.aqi}</p>
                  <p>CO: {data.components.co} µg/m³</p>
                  <p>NO: {data.components.no} µg/m³</p>
                  <p>NO₂: {data.components.no2} µg/m³</p>
                  <p>O₃: {data.components.o3} µg/m³</p>
                  <p>PM2.5: {data.components.pm2_5} µg/m³</p>
                  <p>PM10: {data.components.pm10} µg/m³</p>
                  <p>NH₃: {data.components.nh3} µg/m³</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  );
};

export default Weather;
