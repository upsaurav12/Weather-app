import React, { useState } from "react";
import './Search.css';
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { ForecastData, WeatherData } from "../component/type";
import { useNavigate } from "react-router-dom";
import { House } from "lucide-react";
import { ChevronRight , ChevronLeft } from 'lucide-react';
import { CartesianGrid, Line, LineChart, XAxis } from "recharts"
import { extraWeather , convertUnixToTime} from "../component/WeatherConstant";
import { Table,TableBody,TableCell,TableHead,TableHeader,TableRow,} from "../components/ui/table"
import { weather_image , weather_theme } from "../component/WeatherConstant";
import { Thermometer } from 'lucide-react';
import { Cloud } from "lucide-react";
import { Calendar } from "lucide-react";
import { Clock } from "lucide-react";
import { MapPin } from "lucide-react";
import { Sunrise , Sunset} from 'lucide-react';
import { Droplets } from 'lucide-react';
import { Wind } from 'lucide-react';
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
    const getCurrentUnixTime = () => Math.floor(new Date().getTime() / 1000);
    const isDay = weather && getCurrentUnixTime() >= weather.sys.sunrise && getCurrentUnixTime() <= weather.sys.sunset;
    const navigate = useNavigate(); 
    const [nextState , setNext] = useState(0);
    const apiKey = import.meta.env.VITE_API_TOKEN;
    const Month = ["Jan", "Feb", "Mar", "April", "May", "Jun" , "July", "Aug" , "Sept" , "Oct", "Nov" , "Dec"]

    const extra_weather:extraWeather[] = [
        {extra_name: "Wind Speed" , extra_icon: <Wind/> , extra_val: weather?.wind.speed + "Km/h"},
        {extra_name: "Humidity", extra_icon: <Droplets/> , extra_val:  weather?.main.humidity + "g/Kg"},
        isDay ? { extra_name: "Sunset", extra_icon: <Sunset />, extra_val: convertUnixToTime(weather?.sys.sunset) + " PM"} : { extra_name: "Sunrise", extra_icon: <Sunrise />, extra_val: convertUnixToTime(weather?.sys.sunrise) + " AM" },
        {extra_name: "Feels Like", extra_icon: <Thermometer/> , extra_val: weather?.main.feels_like + "°"}
    ]

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

    const changeWeatherTheme = (key: string | undefined) => {
        const theme = weather_theme.find((i) => i.weather_name === key)

        return theme ? theme.weather_color : undefined
    }

    const changeChild = (key: string | undefined) => {
        const color = weather_theme.find((i) => i.weather_name === key )
        return color ? color.colors.child_element_color : undefined
    }

    const changeText = (key: string | undefined) => {
        const color = weather_theme.find((i) => i.weather_name === key )
        return color ? color.colors.text_color : undefined
    }


    const weather_theme_change = changeWeatherTheme(weather?.weather[0].icon)
    const weather_image_change = changeWeatherImage(weather?.weather[0].icon)
    const weather_child_change = changeChild(weather?.weather[0].icon)
    const weather_child_text = changeText(weather?.weather[0].icon)


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
        <main style={{backgroundColor : `${weather_theme_change}`}} className="h-[full] w-[100vw] pt-2 pb-6 xs:w-[100vw] h-[98%] m-auto">
            <Button className="absolute left-[20px] xs:top-[1px] xs:left-[1px]" onClick={() => navigate("/")}><House/></Button> {/* Navigate button */}
            <div className="search-container">
                <form onSubmit={displayWeather} className="flex mt-4 w-5/12 m-auto xs:w-full">
                    <Input style={{color: `${weather_child_text}`}} className="xs:mt-6"
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
                <p style={{color: `${weather_child_text}`}} className="xs:flex xs:justify-center xs:items-center">Loading...</p>
                ) : weather && forecast ? (
                // Show weather data and analysis when data is loaded
                <>
                <div className="upper-info flex items-between justify-between xs:flex-col w-[97%] m-auto">
                <div className="weather-info-search mt-2 w-[20%] xs:w-11/12 xs:ml-3">
                {weather && (
                    <div className="h-[350px] xs:border-0 border-gray-300 rounded-lg shadow-xl xs:shadow-none p-4">
                    <div className="upper-weather-info">
                        <div className="h-[225px] flex items-center justify-around 1xl:flex-col xs:flex-row-reverse">
                        <div className="weather-image">
                            <img src={weather_image_change} className="h-[140px] w-[140px]" alt="Weather Icon" />
                        </div>
                        <div className="weather-temperature">
                            <h1 style={{ color: `${weather_child_text}` }} className="text-6xl xs:text-7xl xs:font-normal">
                            {weather?.main.temp.toFixed(0)}°
                            </h1>
                        </div>
                        </div>
                    </div>
                    <div
                        style={{ color: `${weather_child_text}` }}
                        className="weather-description flex items-center text-2xl ml-6 border-b-2 xs:border-0 border-gray-300 w-7/12 font-medium xs:ml-3 xs:text-3xl"
                    >
                        <Cloud className="xs:w-[15px] xs:h-[15x]"/><h1 className="xs:ml-2 ">{weather?.weather[0].description.charAt(0).toUpperCase() + weather.weather[0].description.slice(1)}</h1>
                    </div>

                    <div
                        style={{ color: `${weather_child_text}` }}
                        className="time-date-location ml-6 text-sm font-medium mt-2 xs:ml-3 xs:text-[1rem] xs:m-5 xs:font-normal xs:mt-2"
                    >
                        <div>
                        <div className="location flex items-center">
                            <MapPin className="xs:w-[15px] xs:h-[15px]"/><h1>{weather?.name}, {weather?.sys.country}</h1>
                        </div>
                        <div className="date-time">
                            <h1 className="flex items-center mt-2"><Calendar className="mr-1 xs:w-[15px] xs:h-[15px]"/>{new Date(weather.dt * 1000).getDate()}{Month[new Date(weather.dt * 1000).getMonth()]},{new Date(weather.dt * 1000).getFullYear()}<Clock className="ml-2 mr-1 xs:w-[15px] xs:h-[15px]"/>{new Date(weather.dt * 1000).getHours()}:{new Date(weather.dt * 1000).getMinutes()}
                            </h1>
                        </div>
                        </div>
                    </div>
                    </div>
                )}

                <div className="extra-info hidden xs:block mt-5">
                    <ul className="grid grid-rows-2 grid-cols-2 gap-4 h-[350px] w-11/12 m-auto text-[12px]">
                    {extra_weather.map((val, ind) => (
                        <li key={ind} style={{ color: `${weather_child_text}` }} className=" h-[160px] flex flex-col items-center justify-center rounded-lg shadow-2xl">
                        <h3 className="text-base text-center">{val.extra_name}</h3>
                        <div className="h-[20px] w-[20px] mb-2">{val.extra_icon}</div>
                        <h3 className="text-center">{val.extra_val}</h3>
                        </li>
                    ))}
                    </ul>
                </div>
                </div>

                    <div className="weather-analytics w-10/12 xs:w-[96%] xs:m-auto">
                        {weather_chart && (
                            <Card style={{backgroundColor : `${weather_child_change}` , color: `${weather_child_text}`}} className="h-[349px] border-0 ml-2 mt-2 xs:ml-0">
                            <CardHeader>
                                <CardTitle>Weather Forecast</CardTitle>
                                <CardDescription style={{color: `${weather_child_text}`}} className="w-5/12 m-auto flex justify-center">{weather_chart[nextState].weather_type_name}</CardDescription>
                                <div className="slider-next w-full flex items-center justify-around">
                                <ChevronLeft className="chevron xs:w-[40px] xs:h-[40px] xs:ml-2 xs:absolute xs:left-[0px]" onClick={handlePrev}/>
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
                                                tick={{ fontSize: 12, fill: weather_child_text, fontWeight: 'bold' }}
                                            />
                                            <ChartTooltip
                                                cursor={false}
                                                content={<ChartTooltipContent hideLabel />}
                                            />
                                            <Line
                                                dataKey="y_data"
                                                type="natural"
                                                stroke={weather_child_text}
                                                strokeWidth={2}
                                                dot={false}
                                            />
                                        </LineChart>
                                    </ChartContainer>
                                </CardContent>
                                <ChevronRight className="chevron xs:w-[40px] xs:h-[40px] xs:mr-2 xs:absolute xs:right-[0px]" onClick={handleNext}/>
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


            <div className="lower-info w-[97%] m-auto">
                {forecast && (
                    <Card style={{backgroundColor : `${weather_child_change}`}} className="weather-forecast mt-2 px-2 xs:px-1 border-0 w-3/12 h-[350px] xs:w-[97%] xs:mx-auto">
                    <Table>
                        <TableHeader>
                            <TableRow >
                                <TableHead style={{color: `${weather_child_text}`}} className="w-[100px]">Weather</TableHead>
                                <TableHead style={{color: `${weather_child_text}`}}>Temperature</TableHead>
                                <TableHead style={{color: `${weather_child_text}`}}>Time</TableHead>
                                <TableHead style={{color: `${weather_child_text}`}} className="text-right">Date</TableHead>
                            </TableRow>
                        </TableHeader>

                        <TableBody>
                            {forecast.list.slice(0,6).map((val , idx) => (
                               <TableRow style={{color: `${weather_child_text}`}}  key={idx} className="h-12 border-hidden"> {/* Set a fixed height for the row */}
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
