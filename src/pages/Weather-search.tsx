import React, { useState } from "react";
import './Search.css';
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { WeatherData } from "../component/type";
import { Skeleton } from "../components/ui/skeleton";
import { useNavigate } from "react-router-dom";
import { House } from "lucide-react";

export const SearchWeather: React.FC = () => {
    const [city, setCity] = useState<string>('');
    const [weather, setWeather] = useState<WeatherData | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const navigate = useNavigate(); 

    const apiKey = import.meta.env.VITE_API_TOKEN;

    const weatherBySearch = async (): Promise<WeatherData> => {
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`
        );

        if (!response.ok) {
            throw new Error('Error when fetching weather data');
        }

        return response.json();
    };

    const displayWeather = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const data = await weatherBySearch();
            setWeather(data);
            setCity(''); // Clear the input field after fetching data
        } catch (error) {
            setError('Error when displaying weather. Please check the city name.');
            console.error("Error:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="border h-[98vh] w-11/12 h-[98%] mt-2 m-auto">
            <Button className="absolute" onClick={() => navigate("/")}><House/></Button> {/* Navigate button */}
            <div className="search-container">
                <form onSubmit={displayWeather} className="flex mt-4 w-5/12 m-auto xs:w-full">
                    <Input className="xs:mt-6"
                        placeholder="Enter your location..." 
                        value={city} 
                        onChange={(e) => setCity(e.target.value)} 
                    />
                    <Button type="submit" className="ml-2 xs:mt-6">Search</Button>
                </form>
            </div>

            {loading ? (
                // Render Skeleton while data is being fetched
                <div className="weather-info border w-[300px] h-[344px] ml-4 rounded-[1rem] mt-4">
                    <div className="weather-info-upper">
                        <Skeleton className="h-[230px] rounded-[1rem] border"/>
                    </div>
                    <div className="lower-info mt-3 h-[100px]">
                        <Skeleton className="h-[100px] rounded-[1rem]"/>
                    </div>
                </div>
            ) : weather ? (
                // Show weather data once it is loaded
                <div className="weather-info border w-[300px] h-[344px] ml-4 rounded-[1rem] mt-4">
                    <div className="weather">
                        <p>Humidity: {weather.main.humidity}%</p>
                        <p>Description: {weather.weather[0].description}</p>
                        <p>City: {weather.name}</p>
                        <p>Clouds: {weather.clouds.all}%</p>
                        <p>Timezone: {weather.timezone}</p>
                    </div>
                </div>
            ) : error ? (
                // Display error message if an error occurred
                <div className="text-red-500 mt-4">{error}</div>
            ) : null}
        </main>
    );
};
