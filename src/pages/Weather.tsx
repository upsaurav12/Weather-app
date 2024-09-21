import React, { useEffect, useState } from "react";
import { ForecastData , WeatherData} from "../component/type"; // Ensure you import ForecastData
import './Weather.css';
import cloud from '../assets/Vector.svg'
import { CiLocationOn , CiCalendarDate  } from "react-icons/ci";
import { TiWeatherCloudy } from "react-icons/ti";
import LineChart from "./Chart";
export const Weather: React.FC = () => {
    const [forecastData , setForcastData] = useState<ForecastData | null>(null);
    const [error , setError] = useState<string| null> (null);
    const [weatherData , setWeatherData] = useState<WeatherData | null> (null);
    const [Loading, setLoading] = useState<boolean>(false);

    const forecastArray = forecastData?.list.slice(0,10).map((i)=> (new Date(i.dt * 1000).getHours()))
    const labels = forecastArray?.map(item => item.toString()) || [];
    //const forecastTemp = forecastData?.list.slice(0,10).map((i) => i.main.temp)
    const forecastHumidity = forecastData?.list.slice(0,10).map((i) => i.main.humidity) || []
    /*
    const [analysis,  setAnalysis] = useState(['Temperature' , 'Humidity']);
    const [graphState ,setGraphState] = useState([forecastHumidity , forecastTemp])*/


    const data = {
        labels: labels,
        datasets: [
          {
            label: 'Humidity',
            data: forecastHumidity,
            borderColor: 'rgb(75, 192, 192)',
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
                display: true,
            }
          },
        },
      };

    const Month = ['Jan' , 'Feb', 'Mar' , 'Apr', 'May' , 'June' , 'July' , 'Aug' , 'Sept' , 'Oct' , 'Nov' , 'Dec']
    const apiKey = import.meta.env.VITE_API_TOKEN;
        console.log(apiKey)
    useEffect(() => {
        //const apiKey = '2b02841851fadfe717b1834b2074c944'
        async function getUserLocation(): Promise<GeolocationPosition> {
            return new Promise((resolve, reject) => {
              if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(resolve, (error) => {
                  switch (error.code) {
                    case error.PERMISSION_DENIED:
                      reject(new Error("User denied the request for Geolocation."));
                      break;
                    case error.POSITION_UNAVAILABLE:
                      reject(new Error("Location information is unavailable."));
                      break;
                    case error.TIMEOUT:
                      reject(new Error("The request to get user location timed out."));
                      break;
                    default:
                      reject(new Error("An unknown error occurred."));
                  }
                }, {
                  enableHighAccuracy: false,
                  timeout: 30000,  // Increased timeout
                  maximumAge: 0,
                });
              } else {
                reject(new Error("Geolocation is not supported by this browser."));
              }
            });
          }
          

        async function fetchWeather(lat: number , lon: number): Promise<WeatherData> {
            const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`    
            )

            if(!response.ok) {
                throw new Error('Error in Fetching Weather Data')
            }

            return response.json()
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

        async function DisplayWeather () {
            try {
                const position = await getUserLocation();
                const {latitude , longitude} = position.coords;

                const WeatherData = await fetchWeather(latitude , longitude);

                setWeatherData(WeatherData);
            }catch(error) {
                console.error('Got Some error while Fetching' , error)
                setError('Error while Fetching')
            } finally {
                setLoading(false)
            }
        }

        async function DisplayForecast() {
            try {
                const position = await getUserLocation();
                const {latitude , longitude} = position.coords;

                const ForecastData = await fetchForecast(latitude , longitude)

                setForcastData(ForecastData);
            } catch (errored) {
                console.error(errored)
                setError('Error getting Forecast')
            } finally {
                setLoading(false)
            }
        }


        DisplayWeather();
        DisplayForecast();
    }, [])

    if (Loading) return <div>Loading.....</div>
    if (error) return <div>Error: {error}</div>
    return (
        <main className="w-11/12 m-auto min-h-screen">
            <div className="upper-info min-h-[50vh] mt-5 m-auto flex xs:flex-col xs:items-center xs:w-full ">
                    <div className="weather-overview border h-full w-[400px] rounded-[1rem] min-h-[402px] xs:w-11/12 xs:h-[65vh] xs:rounded xs:border-hidden">
                        {weatherData && (
                            <div>
                            <div className="temperature w-full h-[210px] rounded-[1rem] flex 1xl:flex-col 1xl:items-center xs:mt-20  xxs:flex-col">
                                <div className="weather-image w-[190px] h-[190px] m-2 rounded-[1rem] flex justify-center items-center xs:ml-16">
                                    <img src={cloud} className='ml-4 1xl:h-[160px] 1xl:w-[160px]' alt="" />
                                </div>
                                <div className="weather-temp w-[190px] h-[190px]  m-2 mr-3  rounded-[1rem] flex justify-center items-center">
                                    <h2 className="text-7xl font-medium 1xl:text-5xl xs:ml-24">{weatherData.main.temp.toFixed(0)}°C</h2>
                                </div>
                            </div>
                            <div className="weather-name border-b w-8/12 h-12 ml-6 flex items-end md:mt-3 xxs:mt-10 xxs:ml-20 xxs:border-none ">
                                <div className="flex items-center md:mt-4 ">
                                    <TiWeatherCloudy className="xs:hidden"/>
                                    <h1 className="text-xl font-medium ml-2 lg:text-base lg:text-nowrap lgs:text-base xs:text-4xl xs:ml-12">{((weatherData.weather[0].description.charAt(0).toUpperCase() + weatherData.weather[0].description.slice(1)))}</h1>
                                </div>
                            </div>
                            <div className="date-time w-11/12 h-12 mt-8 m-auto">
                                <div className="location ml-2">
                                    <div className="flex items-center justify-start">
                                    <CiLocationOn/>
                                    <h1 className="font-medium ml-2 text-lg lg:text-sm lgs:text-sm">{weatherData.name}, {weatherData.sys.country}</h1>
                                    </div>
                                </div>
                                <div className="time ml-2">
                                    <div className="flex items-center">
                                        <CiCalendarDate/>
                                        <h1 className="text-lg font-medium ml-2 lg:text-sm lgs:text-sm">
                                    {(new Date(weatherData.dt * 1000).getDate())} {Month[(new Date(weatherData.dt * 1000).getMonth())]} {(new Date(weatherData.dt * 1000).getFullYear())},{(new Date(weatherData.dt * 1000).getHours())}:{(new Date(weatherData.dt * 1000).getMinutes())}
                                    </h1>
                                    </div>
                                </div>
                            </div>
                        </div>
                        )}
                </div>
                <div className="weather-info w-full border h-full ml-1 rounded-[1rem] min-h-[240px] xs:w-11/12  xs:rounded xs:h-[40vh] 1xl:w-8/12 xs:border-hidden">
                <div className="h-[300px]  w-11/12 m-[40px] mt-[60px] xs:mx-1">
                    {/*}
                    {analysis.map((v , i) => 
                        <div key={i} onClick={() => {console.log(setAnalysis(i))}}>
                            {v} 
                        </div>
                    ))}*/}
                    <LineChart data={data} options={options} />
                </div>
                    {/*}
                    <div className="upper-weather-info">
                        <ul>
                            <li>
                                <div className=".info-title"></div>
                                <div className="info-image"></div>
                                <div className="info-value"></div>
                            </li>
                            <li>
                                <div className=".info-title"></div>
                                <div className="info-image"></div>
                                <div className="info-value"></div>
                            </li>
                            <li>
                                <div className=".info-title"></div>
                                <div className="info-image"></div>
                                <div className="info-value"></div>
                            </li>
                        </ul>
                    </div>
                    <div className="lower-weather-info">
                    <ul>
                            <li>
                                <div className=".info-title-l"></div>
                                <div className="info-image-l"></div>
                                <div className="info-value-l"></div>
                            </li>
                            <li>
                                <div className=".info-title-l"></div>
                                <div className="info-image-l"></div>
                                <div className="info-value-l"></div>
                            </li>
                            <li>
                                <div className=".info-title-l"></div>
                                <div className="info-image-l"></div>
                                <div className="info-value-l"></div>
                            </li>
                        </ul>
                    </div>
                    */}
                </div>
            </div>
            <div className="lower-info min-h-[50vh] mt-1 flex xs:flex-col mt-10">
                <div className="weather-forecast w-[520px] border h-11/12 rounded-[1rem] xs:ml-4 xs:rounded xs:w-[92%] xs:border-hidden">
                    <div className="forecast-title">
                        <h1 className="text-2xl font-bold ml-5 mt-4">Forecast(Next 3-hours) </h1>

                    </div>

                    <ul className="h-5/6 mt-5">
                        <div className="weather-analysis">

                        </div>
                            {/*<li>
                                <div className="forecast-weather-image"></div>
                                <div className="date">15 Sept</div>
                                <div className="day">Sunday</div>
                            </li>
                            <li>
                                <div className="forecast-weather-image"></div>
                                <div className="date">16 Sept</div>
                                <div className="day">Monday</div>
                            </li>
                            <li>
                                <div className="forecast-weather-image"></div>
                                <div className="date">17Sept</div>
                                <div className="day">Tuesday</div>
                            </li>
                            <li>
                                <div className="forecast-weather-image"></div>
                                <div className="date">18 Sept</div>
                                <div className="day">Webnesday</div>
                            </li>
                            <li>
                                <div className="forecast-weather-image"></div>
                                <div className="date">19Sept</div>
                                <div className="day">Thursday</div>
                            </li>
                            */}

                            {forecastData && (
                                forecastData.list.slice(0,6).map((forecast , idx) => (
                                    <div key={idx} className="flex justify-between items-center">
                                        <img src={`https://openweathermap.org/img/wn/${forecast.weather[0].icon}.png`}
                                            alt={forecast.weather[0].description} className="ml-2"
                                        />
                                        <p className="mr-4 font-medium">{forecast.main.temp.toFixed(0)}°C</p>
                                        <p>{forecast.main.humidity}</p>
                                        <h3 className="mr-3 font-medium">{new Date(forecast.dt * 1000).getDate()} {Month[new Date(forecast.dt * 1000).getMonth()]}</h3>
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