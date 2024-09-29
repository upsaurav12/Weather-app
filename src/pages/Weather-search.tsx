import React, {  useState } from "react";
import './Search.css';
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { WeatherData } from "../component/type";
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

    if (loading) return <div className="loader"></div>;
    if (error) return <div className="text-red-500">Error: {error}</div>;

    return (
        <main className="border w-11/12 h-[98%] mt-2 m-auto">
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

            <div className="weather-data mt-4">
                {weather && (
                    <div className="weather bg-blue-50 p-4 rounded-lg">
                        <h2 className="text-xl font-bold">{weather.name}, {weather.sys.country}</h2>
                        <p>Temperature: {weather.main.temp}°C</p>
                        <p>Pressure: {weather.main.pressure} hPa</p>
                        <p>Humidity: {weather.main.humidity}%</p>
                        <p>Visibility: {weather.visibility / 1000} km</p>
                        <p>Conditions: {weather.weather[0].description}</p>
                        <p>Cloud Cover: {weather.clouds.all}%</p>
                    </div>
                )}
            </div>
        </main>
    );
}
