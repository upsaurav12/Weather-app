import React, { useEffect, useState, useCallback } from "react";
import { ForecastData , WeatherData, CachedData} from "../component/type"; // Ensure you import ForecastData
import './Weather.css';
import cloud from '../assets/Vector.svg';
import icon from '../assets/react.svg';
import haze from '../assets/Haze.svg';
import night_cloud from '../assets/Night-cloud.svg';
import night from '../assets/Night.svg';
import night_haze from '../assets/night-haze.svg'
import sunny from '../assets/Sunny.svg';
import { CiLocationOn , CiCalendarDate  } from "react-icons/ci";
import { TiWeatherCloudy } from "react-icons/ti";
import Wind from '../assets/Wind1.svg';
import Thermometer from '../assets/thermometer.svg';
import Humidity from '../assets/Humidity.svg';
import UV from '../assets/UV.svg'
import LineChart from "./Chart";
//import { get } from "http";
export const Weather: React.FC = () => {
    const [forecastData , setForcastData] = useState<ForecastData | null>(null);
    const [error , setError] = useState<string| null> (null);
    const [weatherData , setWeatherData] = useState<WeatherData | null> (null);
    const [Loading, setLoading] = useState<boolean>(false);
    const [location, setLocation] = useState<{ lat: number, lon: number } | null>(null); // Store user location
    const forecastArray = forecastData?.list.slice(0,11).map((i)=> (new Date(i.dt * 1000).getHours()))
    const labels = forecastArray?.map(item => item.toString()) || [];
    //const forecastTemp = forecastData?.list.slice(0,10).map((i) => i.main.temp)
    const forecastHumidity = forecastData?.list.slice(0,11).map((i) => i.main.humidity) || []
    /*
    const [analysis,  setAnalysis] = useState(['Temperature' , 'Humidity']);
    const [graphState ,setGraphState] = useState([forecastHumidity , forecastTemp])*/


    interface weatherImage {
        icon_image: string,
        icon_name:string,
    }

    interface weatherTheme {
        weather_name: string,
        weather_color:string,
        colors:{
            text_color: string,
        child_element_color:string
        }
    }

    interface extraWeather {
        extra_name: string,
        extra_icon: string,
        extra_val?: number | undefined | string,
    }

    const convertUnixToTime = (unixTimestamp: number | undefined): string => {
        if (!unixTimestamp) return "N/A"; // Handle case where timestamp is undefined
        const date = new Date(unixTimestamp * 1000); // Convert to milliseconds
        const hours = date.getHours().toString().padStart(2, '0'); // Get hours and pad with zero
        const minutes = date.getMinutes().toString().padStart(2, '0'); // Get minutes and pad with zero
        return `${hours}:${minutes}`; // Format as HH:MM
    };


    const extra_weather:extraWeather[] = [
        {extra_name: "Sunrise" , extra_icon: Wind , extra_val: convertUnixToTime(weatherData?.sys?.sunrise)},
        {extra_name: "Humidity", extra_icon: Humidity , extra_val:  weatherData?.main.humidity},
        {extra_name: "UV Index", extra_icon: UV , extra_val: weatherData?.main.pressure},
        {extra_name: "Feels Like", extra_icon: Thermometer , extra_val: weatherData?.main.feels_like}
    ]

    
    const weather_image:weatherImage[] = [
        {icon_image: cloud , icon_name: "Cloud"},
        {icon_image: icon , icon_name: "React"},
        {icon_image: sunny , icon_name: "01d"},
        {icon_image: night , icon_name: "01n"},
        {icon_image: night_cloud , icon_name:"02n"},
        {icon_image: night_haze , icon_name: "50n"},
        {icon_image: haze , icon_name: "50d"}
    ]

    const changeTheme = (key : string):string => {
        //const currentWeather = weatherData?.weather[0].icon
        const theme_color = weather_theme.find((i) => i.weather_name === key )
        return theme_color ? theme_color.weather_color: "blue";
    }

    const changeTextColor = (key: string):string => {
        const theme = weather_theme.find((i) => i.weather_name === key);
        return theme ? theme.colors.text_color : "white"; // Default fallback color
    };
    
    const changeChildElementColor = (key: string):string => {
        const theme = weather_theme.find((i) => i.weather_name === key);
        return theme ? theme.colors.child_element_color : "gray"; // Default fallback color
    };




    const weather_theme: weatherTheme[] = [
        { 
            weather_name: "50n", // Mist (night)
            weather_color: "#2C3E50", 
            colors: {
                text_color: "#FFFFFF", 
                child_element_color: "rgb(0, 34, 57)"
            }
        },
        { 
            weather_name: "50d", // Mist (day)
            weather_color: "#D9CBA0", 
            colors: {
                text_color: "#34495E", 
                child_element_color: "rgb(198, 142, 11)"
            }
        },
        { 
            weather_name: "01d", // Clear sky (day)
            weather_color: "#87ceeb", 
            colors: {
                text_color: "#000000", 
                child_element_color: "rgb(11, 163, 198)"
            }
        },
        { 
            weather_name: "01n", // Clear sky (night)
            weather_color: "#162b42", 
            colors: {
                text_color: "#FFFFFF", 
                child_element_color: "rgb(4, 54, 66)"
            }
        },
        { 
            weather_name: "02d", // Few clouds (day)
            weather_color: "#A9CCE3", 
            colors: {
                text_color: "#154360", 
                child_element_color: "rgb(59, 147, 168)"
            }
        },
        { 
            weather_name: "02n", // Few clouds (night)
            weather_color: "#5D6D7E", 
            colors: {
                text_color: "#EAECEE", 
                child_element_color: "rgb(41, 80, 89)"
            }
        },
        { 
            weather_name: "03d", // Scattered clouds (day)
            weather_color: "#D3D3D3", 
            colors: {
                text_color: "#2C3E50", 
                child_element_color: "#7F8C8D"
            }
        },
        { 
            weather_name: "03n", // Scattered clouds (night)
            weather_color: "#B0BEC5", 
            colors: {
                text_color: "#000000", 
                child_element_color: "#37474F"
            }
        },
        { 
            weather_name: "04d", // Broken clouds (day)
            weather_color: "#B3B6B7", 
            colors: {
                text_color: "#1F2833", 
                child_element_color: "rgb(92, 124, 132)"
            }
        },
        { 
            weather_name: "04n", // Broken clouds (night)
            weather_color: "#5D6D7E", 
            colors: {
                text_color: "#EAECEE", 
                child_element_color: "rgb(55, 76, 81)"
            }
        },
        { 
            weather_name: "09d", // Shower rain (day)
            weather_color: "#5DADE2", 
            colors: {
                text_color: "#1A5276", 
                child_element_color: "rgb(30, 112, 132)"
            }
        },
        { 
            weather_name: "09n", // Shower rain (night)
            weather_color: "#34495E", 
            colors: {
                text_color: "#ECF0F1", 
                child_element_color: "rgb(3, 76, 94)"
            }
        },
        { 
            weather_name: "10d", // Rain (day)
            weather_color: "#85C1E9", 
            colors: {
                text_color: "#154360", 
                child_element_color: "rgb(22, 112, 134)"
            }
        },
        { 
            weather_name: "10n", // Rain (night)
            weather_color: "#2E4053", 
            colors: {
                text_color: "#D6EAF8", 
                child_element_color: "rgb(40, 76, 85)"
            }
        },
        { 
            weather_name: "11d", // Thunderstorm (day)
            weather_color: "#34495E", 
            colors: {
                text_color: "#F5B041", 
                child_element_color: "rgb(58, 105, 117)"
            }
        },
        { 
            weather_name: "11n", // Thunderstorm (night)
            weather_color: "#17202A", 
            colors: {
                text_color: "#E74C3C", 
                child_element_color: "rgb(40, 76, 85)"
            }
        },
        { 
            weather_name: "13d", // Snow (day)
            weather_color: "#E5E8E8", 
            colors: {
                text_color: "#2C3E50", 
                child_element_color: "rgb(128, 180, 193)"
            }
        },
        { 
            weather_name: "13n", // Snow (night)
            weather_color: "#85929E", 
            colors: {
                text_color: "#FFFFFF", 
                child_element_color: "#AAB7B8"
            }
        }
    ];
    

    const weatherKey = weatherData?.weather[0]?.icon || "50n"; // Fallback to "50n"
    
    const backgroundColor = changeTheme(weatherKey);
    const textColor = changeTextColor(weatherKey);
    const childElementColor = changeChildElementColor(weatherKey);

    const changeIcon = (key: string) => {
        const default_icon = cloud;
       const data = weather_image.find((i) => i.icon_name === key)
       console.log(key)
       return data ? data.icon_image : default_icon
    }

    const data = {
        labels: labels,
        datasets: [
          {
            label: 'Humidity',
            data: forecastHumidity,
            borderColor: 'rgb(208,212,216)',
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
          },
        ],
      };
    
      // Chart options
      const options = {
        maintainAspectRatio: false, // Allows the chart to adjust to the height of the container
        responsive: true,
        plugins: {
          legend: {
            position: 'top' as const,
          },
          title: {
            display: false,
          },
        },
        scales: {
          x: {
            grid: {
                display: false,
            },

            ticks: {
                display: true,
            },
          },
          y: {
            grid: {
                display: false,
            },
            ticks: {
                display: false,
            }
          },
        },
      };

    const Month = ['Jan' , 'Feb', 'Mar' , 'Apr', 'May' , 'June' , 'July' , 'Aug' , 'Sept' , 'Oct' , 'Nov' , 'Dec']
    const apiKey = import.meta.env.VITE_API_TOKEN;
        //console.log(apiKey);
          
        const getUserLocation = async () => {
            try {
                const position = await new Promise<GeolocationPosition>((resolve, reject) => {
                    if (navigator.geolocation) {
                        navigator.geolocation.getCurrentPosition(resolve, reject);
                    } else {
                        reject(new Error("Geolocation is not supported by this browser."));
                    }
                });
                const { latitude, longitude } = position.coords;
                setLocation({ lat: roundCoordinate(latitude), lon: roundCoordinate(longitude) }); // Save location in state
            } catch (error) {
                console.error("Error getting location:", error);
                setError("Unable to retrieve location.");
            }
        };
    

        async function fetchWeather(lat: number , lon: number): Promise<WeatherData> {
            const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`    
            )

            if(!response.ok) {
                throw new Error('Error in Fetching Weather Data')
            }

            return response.json()
        }

        const CACHE_EXPIRATION_TIME = 1000 * 60 * 10; // 5 minutes

        

        // Function to save data to localStorage with a timestamp
        function saveToLocalStorage<T>(key: string, data: T): void {
            const cachedData: CachedData<T> = {
                data,
                timestamp: Date.now(), // Save the current timestamp
            };
            localStorage.setItem(key, JSON.stringify(cachedData));
        }

        // Function to get data from localStorage
        function getFromLocalStorage<T>(key: string): T | null {
            const cachedData = localStorage.getItem(key);
            if (cachedData) {
                const { data, timestamp }: CachedData<T> = JSON.parse(cachedData);
                // Check if the cached data is still valid
                if (Date.now() - timestamp < CACHE_EXPIRATION_TIME) {
                    return data; // Return cached data if valid
                } else {
                    localStorage.removeItem(key); // Remove stale data
                }
            }
            return null; // No valid cached data
        }


        async function fetchForecast(lat: number , lon: number): Promise<ForecastData> {
            const response = await fetch(
                `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`
            )

            if (!response.ok){
                throw new Error('Error While Fetching !!');
            }

            return response.json();
        }

        function roundCoordinate(coord: number, precision: number = 2): number {
            return parseFloat(coord.toFixed(precision));
        }

        
        const DisplayWeatherAndForecast = useCallback(async () => {
            console.log('Fetching weather and forecast data call back...'); // Log when fetching starts
            if ( !location) return;
            setLoading(true);

            try {
                let { lat, lon } = location;

                lat = roundCoordinate(lat);
                lon = roundCoordinate(lon)

                const weatherCacheKey = `weather_${lat},${lon}`;
                const forecastCacheKey = `forecast_${lat},${lon}`;
                console.log("weather and forecast cached key ", weatherCacheKey , forecastCacheKey);

                const cachedWeatherData = getFromLocalStorage<WeatherData>(weatherCacheKey);
                const cachedForecastData = getFromLocalStorage<ForecastData>(forecastCacheKey);



                if (cachedForecastData && cachedWeatherData) {
                    console.log('Serving from cache....');
                    setWeatherData(cachedWeatherData );
                    setForcastData(cachedForecastData );
                    return ;
                }

                const [newweatherData, newforecastData] = await Promise.all([
                    fetchWeather(lat, lon),
                    fetchForecast(lat, lon)
                ]);
            

                console.log('Requesting to API ')

                if (JSON.stringify(newweatherData) !== JSON.stringify(weatherData)){
                    setWeatherData(newweatherData)
                    console.log("Weather Data updated")
                }
                setWeatherData(weatherData);
                if(JSON.stringify(newforecastData) !== JSON.stringify(forecastData)){
                    setForcastData(newforecastData)
                    console.log("Forecast Data Updated")
                }
                //console.log('Weather Data Fetched and Cached:', weatherData);

                console.log("Saved to local storage") 

                saveToLocalStorage<WeatherData>(weatherCacheKey, newweatherData);
                saveToLocalStorage<ForecastData>(forecastCacheKey, newforecastData);
        
            } catch (error) {
                console.error('Error while retrieving weather data:', error);
                setError('Error while fetching the data');
            } finally {
                setLoading(false);
            }
        }, [location])

        useEffect(() => {
            getUserLocation()
        },[])

        useEffect(() => {
            if (location) {
                DisplayWeatherAndForecast();
            }
        }, [location , DisplayWeatherAndForecast])

    useEffect(() => {
        console.log("Hello useEffect")
        DisplayWeatherAndForecast()
    }, [])

    if (Loading) return <div>Loading.....</div>
    if (error) return <div>Error: {error}</div>
    return (
        <main style={{backgroundColor: `${backgroundColor}`}} className="w-full h-full pt-2 m-auto min-h-screen">
            <div className="upper-info w-[98%] min-h-[50vh] mt-5 m-auto flex xs:flex-col xs:items-center xs:w-full">
                <div className="extra-info-weather-overview xs:w-full xs:min-h-[60vh]">
                    {weatherData && (
                        <div style={{color: `${textColor}`}} className="weather-overview border h-full w-[400px] rounded-[1rem] xs:min-h-[650px] xs:w-11/12 xs:h-[28vh] xs:rounded xs:border-hidden xs:text-slate-100">
                        <div>
                            <div className="temperature w-full h-[150px] rounded-[1rem] flex 1xl:flex-col 1xl:items-center xs:flex-row-reverse">
                                <div className="weather-image w-[190px] h-[190px] m-2 rounded-[1rem] flex justify-center items-center">
                                    <img src={changeIcon(weatherData.weather[0].icon)} className='ml-4 1xl:h-[160px] 1xl:w-[160px] xs:w-[100px] xs:h-[100px] xs:mt-1' alt="" />
                                </div>
                                <div className="weather-temp w-[190px] h-[190px]  m-2 mr-3  rounded-[1rem] flex justify-center items-center xs:ml-0 xs:mr-20">
                                    <h2 className="text-7xl font-base 1xl:text-5xl xs:ml-0">{weatherData.main.temp.toFixed(0)}°</h2>
                                </div>
                            </div>
                            <div className="all-three ml-5 mt-3">
                                <div className="weather-name border-b w-8/12 h-12 ml-6 flex items-end md:mt-3 xs:border-none xs:ml-2">
                                    <div className="flex items-center md:mt-4 xxs:mb-2">
                                        <TiWeatherCloudy className="xs:hidden"/>
                                        <h1 className="text-xl font-medium ml-2 lg:text-base lg:text-nowrap lgs:text-base xs:text-2xl xs:ml-2 xs:font-normal">{((weatherData.weather[0].description.charAt(0).toUpperCase() + weatherData.weather[0].description.slice(1)))}</h1>
                                    </div>
                                </div>
                                <div className="date-time w-11/12 h-12 mt-3 m-auto xs:mt-0 xs:mr-5">
                                    <div className="location ml-2 xs:ml-0">
                                        <div className="flex items-center justify-start">
                                        <CiLocationOn className="xs:hidden"/>
                                        <h1 className="font-medium ml-2 text-lg lg:text-sm lgs:text-sm xs:text-sm xs:ml-0">{weatherData.name}, {weatherData.sys.country}</h1>
                                        </div>
                                    </div>
                                    <div className="time ml-2 xs:ml-0">
                                        <div className="flex items-center">
                                            <CiCalendarDate className="xs:hidden"/>
                                            <h1 className="text-lg font-medium ml-2 lg:text-sm lgs:text-sm xs:text-sm xs:ml-0">
                                        {(new Date(weatherData.dt * 1000).getDate())} {Month[(new Date(weatherData.dt * 1000).getMonth())]} {(new Date(weatherData.dt * 1000).getFullYear())},{(new Date(weatherData.dt * 1000).getHours())}:{(new Date(weatherData.dt * 1000).getMinutes())}
                                        </h1>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="extra-info hidden xs:block mt-4">
                        <ul className="grid  grid-rows-2 grid-cols-2 gap-4 h-[350px] w-11/12 m-auto text-[12px]">
                            {extra_weather.map((val, ind) => (
                                <li key={ind} className="border h-[160px] flex flex-col items-center justify-center rounded-[0.75rem]">
                                    <h3 className="text-base text-center">{val.extra_name}</h3>
                                    <img src={val.extra_icon} alt="" className="h-[20px] w-[20px] mb-2" />
                                    <h3 className="text-center">{val.extra_val}</h3>
                                </li>
                                ))}
                            </ul>
                        </div>
                </div>
                    )}
                </div>
                <div style={{backgroundColor: `${childElementColor}`}} className="weather-info w-full border h-full ml-1 rounded-[1rem] min-h-[240px] xs:w-[96%]  xs:rounded xs:h-[25vh] 1xl:w-8/12 xs:border-hidden xs:w-[95vw] xs:mr-1 xs:mt-9 xs:rounded-[0.75rem]">
                <div  className="h-[300px]  w-11/12 m-[40px] mt-[60px] xs:mx-1 xs:border-hidden xs:mr-8 xs:my-8 xs:h-[150px] xs:ml-4 xs:mt-12">
                    <LineChart data={data} options={options} />
                </div>
                </div>
            </div>
            <div className="lower-info w-[98%] m-auto min-h-[50vh] mt-1 flex xs:flex-col mt-10  xs:mr-1 xs:text-slate-50">
                <div style={{backgroundColor: `${childElementColor}`}}  className="weather-forecast w-[520px] border h-11/12 rounded-[1rem] xs:rounded xs:w-[94.5vw] xs:rounded-[0.75rem]  xs:border-hidden xs:ml-2">
                    <div className="forecast-title">
                        <h1 style={{color: `${textColor}`}} className="text-2xl font-bold ml-4 mt-4">Forecast(Next 3-hours)</h1>

                    </div>

                    <ul className="h-5/6 mt-5">
                        <div className="weather-analysis">
                        </div>
                            {forecastData && (
                                forecastData.list.slice(0,6).map((forecast , idx) => (
                                    <div key={idx} className="flex justify-between items-center">
                                        <img src={`https://openweathermap.org/img/wn/${forecast.weather[0].icon}.png`}
                                            alt={forecast.weather[0].description} className="ml-2"
                                        />
                                        <p style={{color: `${textColor}`}} className="mr-3 font-medium">{forecast.main.temp.toFixed(0)}°C</p>
                                        <h3 style={{color: `${textColor}`}} className="mr-1 font-medium xs:mr-[20px]">{new Date(forecast.dt * 1000).getDate()} {Month[new Date(forecast.dt * 1000).getMonth()]}</h3>
                                        {/*<p className="mr-4">{forecast.main.temp.toFixed(0)}°C</p>*/}
                                    </div>
                                ))
                            )}
                        </ul>
                </div>
                <div className="weather-analysis h-11/12 w-9/12 border ml-1 rounded-[1rem] xs:hidden"></div>
            </div>
        </main>
    )
}