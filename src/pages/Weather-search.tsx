import React, { useState } from "react";
import './Search.css';
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { ForecastData, WeatherData } from "../component/type";
import { useNavigate } from "react-router-dom";
import { House } from "lucide-react";
import { ChevronRight , ChevronLeft } from 'lucide-react';
import { CartesianGrid, Line, LineChart, XAxis } from "recharts"
import { Table,TableBody,TableCell,TableHead,TableHeader,TableRow,} from "../components/ui/table"
import { weather_image } from "../component/WeatherConstant";
import './Weather-search.css'

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "../components/ui/chart"

export const SearchWeather: React.FC = () => {
    const [city, setCity] = useState<string>('');
    const [weather, setWeather] = useState<WeatherData | null>(null);
    const [forecast , setForecast] = useState<ForecastData | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const navigate = useNavigate(); 
    const [nextState , setNext] = useState(0);
    const apiKey = import.meta.env.VITE_API_TOKEN;
    const Month = ["Jan", "Feb", "Mar", "April", "May", "Jun" , "July", "Aug" , "Sept" , "Oct", "Nov" , "Dec"]

    const humidity_chart = forecast?.list.slice(0,10).map((i) => {
        return{
            hours: new Date(i.dt * 1000).getHours(),
            y_data: i.main.humidity,
        }
    })

    const pressure_chart = forecast?.list.slice(0,10).map((i) => {
        return {
            hours: new Date(i.dt * 1000).getHours(),
            y_data: i.main.pressure,
        }
    })

    const temperature_chart = forecast?.list.slice(0,10).map((i) => {
        return {
            hours: new Date(i.dt * 1000).getHours(),
            y_data: i.main.temp
        }
    })

    const changeWeatherImage = (key : string | undefined) => {
        const image = weather_image.find((i) => i.icon_name === key)
        console.log(key)
        return image ? image.icon_image : undefined
    }
 
    const weather_image_change = changeWeatherImage(weather?.weather[0].icon)


      const weather_chart = [
        {weather_type:  humidity_chart, weather_type_name: "Humidity"},
        {weather_type: pressure_chart, weather_type_name: "Pressure"}, 
        {weather_type: temperature_chart , weather_type_name: "Temperature"}
    ]
      
      const chartConfig = {
        desktop: {
          label: "Desktop",
          color: "hsl(var(--chart-1))",
        },
      } satisfies ChartConfig

    const weatherBySearch = async (): Promise<WeatherData> => {
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`
        );

        if (!response.ok) {
            throw new Error('Error when fetching weather data');
        }

        return response.json();
    };

    const forecastBySearch = async (): Promise<ForecastData> => {
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`
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

            const [weather_data, forecast_data] = await Promise.all([
                weatherBySearch(),
                forecastBySearch()
            ])

            setWeather(weather_data)
            setForecast(forecast_data)
            setCity(''); // Clear the input field after fetching data
        } catch (error) {
            setError('Error when displaying weather. Please check the city name.');
            console.error("Error:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleNext = () => {
        setNext(prev => (prev + 1) % weather_chart.length)
        console.log(weather_chart[nextState])
    }

    const handlePrev = () => {
        setNext(prev => (prev - 1 + weather_chart.length) % weather_chart.length)
        console.log(weather_chart[nextState])
    }
    return (
        <main className="border h-[98vh] w-[98vw] h-[98%] mt-2 m-auto">
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
            {/*}
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
            ) : null}*/}


{loading ? (
                // Render Loading or Skeleton component when fetching data
                <p>Loading...</p>
            ) : weather && forecast ? (
                // Show weather data and analysis when data is loaded
                <>
                <div className="upper-info flex items-between justify-between xs:flex-col">
                    <div className="weather-info mt-2 w-[20%] xs:w-full xs:mt-2">
                        {weather && (
                            <Card className="h-[350px]">
                            <div className="upper-weather-info">
                                <div className="h-[225px] flex items-center justify-around 1xl:flex-col xs:flex-row-reverse">
                                    <div className="weather-image">
                                        <img src={weather_image_change} className="h-[140px] w-[140px]"  />
                                    </div>
                                    <div className="weather-temperature">
                                        <h1 className="text-6xl xs:text-7xl xs:font-base">{weather?.main.temp.toFixed(0)}°</h1>
                                    </div>
                                </div>
                            </div>

                            <div className="time-date-location ml-2 text-sm font-medium mt-2 xs:ml-10 xs:text-medium">
                                    <div>
                                        <div className="location">
                                    <h1>{weather?.name}, {weather?.sys.country}</h1>
                                </div>

                                <div className="date-time">
                                    <h1>{new Date(weather.dt * 1000).getDate()}{Month[new Date(weather.dt * 1000).getMonth()]},{new Date(weather.dt * 1000).getFullYear()} {new Date(weather.dt * 1000).getHours()}: {new Date(weather.dt * 1000).getMinutes()}</h1>
                                </div>
                                    </div>
                            </div>
                        </Card>
                        )}
                    </div>
                    <div className="weather-analytics w-10/12 xs:w-full">
                        {weather_chart && (
                            <Card className="h-[349px] ml-2 mt-2 xs:ml-0">
                            <CardHeader>
                                <CardTitle>Weather Forecast</CardTitle>
                                <CardDescription className="w-5/12 m-auto flex justify-center">{weather_chart[nextState].weather_type_name}</CardDescription>
                                <div className="slider-next w-full flex items-center justify-around">
                                <ChevronLeft className="chevron xs:w-[40px] xs:h-[40px]" onClick={handlePrev}/>
                                <CardContent className="w-full">
                                    <ChartContainer config={chartConfig} className="h-[250px] w-full mt-4">
                                        <LineChart accessibilityLayer data={weather_chart[nextState].weather_type} margin={{left: 5 , right: 5}} >
                                            <CartesianGrid vertical={false} />
                                            <XAxis
                                                dataKey="hours"
                                                tickLine={false}
                                                axisLine={false}
                                                tickMargin={3}
                                                tickFormatter={(value) => `${value}:00`}
                                            />
                                            <ChartTooltip
                                                cursor={false}
                                                content={<ChartTooltipContent hideLabel />}
                                            />
                                            <Line
                                                dataKey="y_data"
                                                type="natural"
                                                stroke="black"
                                                strokeWidth={2}
                                                dot={false}
                                            />
                                        </LineChart>
                                    </ChartContainer>
                                </CardContent>
                                <ChevronRight className="chevron xs:w-[40px] xs:h-[40px]" onClick={handleNext}/>
                                </div>
                            </CardHeader>
                        </Card>
                        )}
                    </div>
                </div>
                </>
            ) : error ? (
                // Display error message if an error occurred
                <div className="text-red-500 mt-4">{error}</div>
            ) : null}
            {/*}
            {weather && (
                <div className="weather">
                    <p>{weather.sys.sunrise}</p>
                    <p>{weather.clouds.all}</p>
                </div>
            )}

            {forecast && (
                <div className="forecast">
                    <p>{forecast.list[0].main.humidity}</p>
                    <p>{forecast.list[0].visibility}</p>
                </div>
            )}*/}


            <div className="lower-info">
                {forecast && (
                    <Card className="weather-forecast mt-2 w-3/12 h-[350px] xs:w-full">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[100px]">Weather</TableHead>
                                <TableHead>Temperature</TableHead>
                                <TableHead>Time</TableHead>
                                <TableHead className="text-right">Date</TableHead>
                            </TableRow>
                        </TableHeader>

                        <TableBody>
                            {forecast.list.slice(0,6).map((val , idx) => (
                               <TableRow key={idx} className="h-12 border-hidden"> {/* Set a fixed height for the row */}
                               <TableCell className="h-full"> {/* Ensure cell takes full height */}
                                   <img src={weather_image_change} alt="" className="h-[35px] w-[35px]" />
                               </TableCell>
                               <TableCell className="h-full">{val.main.temp}</TableCell>
                               <TableCell className="h-full">
                                   {new Date(val.dt * 1000).getHours()}:{new Date(val.dt * 1000).getMinutes()}
                               </TableCell>
                               <TableCell className="text-right h-full">
                                   {new Date(val.dt * 1000).getDate()} {Month[new Date(val.dt * 1000).getMonth()]}
                               </TableCell>
                           </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </Card>
                )}
            </div>
        </main>
    );
};
