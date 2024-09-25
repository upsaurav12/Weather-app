import React, { useEffect, useState, useCallback } from "react";
import { ForecastData , WeatherData, CachedData} from "../component/type"; // Ensure you import ForecastData
import './Weather.css';
import cloud from '../assets/Vector.svg'
import { CiLocationOn , CiCalendarDate  } from "react-icons/ci";
import { TiWeatherCloudy } from "react-icons/ti";
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
        <main className="w-11/12 m-auto min-h-screen">
            <div className="upper-info min-h-[50vh] mt-5 m-auto flex xs:flex-col xs:items-center xs:w-full ">
                    <div className="weather-overview border h-full w-[400px] rounded-[1rem] min-h-[260px] xs:w-11/12 xs:h-[28vh] xs:rounded xs:border-hidden xs:text-slate-100">
                        {weatherData && (
                            <div>
                            <div className="temperature w-full h-[150px] rounded-[1rem] flex 1xl:flex-col 1xl:items-center xs:flex-row-reverse">
                                <div className="weather-image w-[190px] h-[190px] m-2 rounded-[1rem] flex justify-center items-center">
                                    <img src={cloud} className='ml-4 1xl:h-[160px] 1xl:w-[160px] xs:w-[100px] xs:h-[100px] xs:mt-1' alt="" />
                                </div>
                                <div className="weather-temp w-[190px] h-[190px]  m-2 mr-3  rounded-[1rem] flex justify-center items-center xs:ml-0 xs:mr-20">
                                    <h2 className="text-7xl font-base 1xl:text-5xl xs:ml-0">{weatherData.main.temp.toFixed(0)}°</h2>
                                </div>
                            </div>
                            <div className="weather-name border-b w-8/12 h-12 ml-6 flex items-end md:mt-3 xs:border-none xs:ml-2">
                                <div className="flex items-center md:mt-4 xxs:mb-2">
                                    <TiWeatherCloudy className="xs:hidden"/>
                                    <h1 className="text-xl font-medium ml-2 lg:text-base lg:text-nowrap lgs:text-base xs:text-2xl xs:ml-0 xs:font-normal">{((weatherData.weather[0].description.charAt(0).toUpperCase() + weatherData.weather[0].description.slice(1)))}</h1>
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
                        )}
                </div>
                <div className="weather-info w-full border h-full ml-1 rounded-[1rem] min-h-[240px] xs:w-full  xs:rounded xs:h-[25vh] 1xl:w-8/12 xs:border-hidden xs:w-[95vw] xs:mr-1 xs:mt-9 xs:rounded-[0.75rem]">
                <div className="h-[300px]  w-11/12 m-[40px] mt-[60px] xs:mx-1 xs:border-hidden xs:mr-8 xs:my-8 xs:h-[150px] xs:ml-4 xs:mt-12">
                    <LineChart data={data} options={options} />
                </div>
                </div>
            </div>
            <div className="lower-info min-h-[50vh] mt-1 flex xs:flex-col mt-10  xs:mr-1 xs:text-slate-50">
                <div className="weather-forecast w-[520px] border h-11/12 rounded-[1rem] xs:rounded xs:w-[93vw] xs:ml-0  xs:rounded-[0.75rem]  xs:border-hidden xs:ml-[-3px]">
                    <div className="forecast-title">
                        <h1 className="text-2xl font-bold ml-4 mt-4">Forecast(Next 3-hours) </h1>

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
                                        <p className="mr-3 font-medium">{forecast.main.temp.toFixed(0)}°C</p>
                                        <h3 className="mr-1 font-medium xs:mr-[20px]">{new Date(forecast.dt * 1000).getDate()} {Month[new Date(forecast.dt * 1000).getMonth()]}</h3>
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