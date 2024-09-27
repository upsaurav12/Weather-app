import cloud from '../assets/Vector.svg';
import thunderstorm from '../assets/Thunderstorm-day.svg';
import thunderstorm_night from '../assets/thunderstorm-night.svg'
import rainy_day from '../assets/rain-day.svg';
import rainy_night from '../assets/rain-night.svg';
import haze from '../assets/Haze.svg';
import night_cloud from '../assets/Night-cloud.svg';
import night from '../assets/Night.svg';
import night_haze from '../assets/night-haze.svg'
import sunny from '../assets/Sunny.svg';

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

interface weatherIcon {
    icon_name: string, 
    icon_image: string,
}

export interface extraWeather {
    extra_name: string,
    extra_icon: string,
    extra_val?: number | undefined | string,
}

export const weather_image:weatherImage[] = [
    {icon_name: "01d" , icon_image: sunny},
    {icon_name: "01n" , icon_image: night},
    {icon_name: "02d" , icon_image: cloud},
    {icon_name: "02n" , icon_image: night_cloud},
    {icon_name: "50n", icon_image: night_haze},
    {icon_name: "50d", icon_image: haze},
    {icon_name: "03d", icon_image: cloud},
    {icon_name: "03n", icon_image: night_cloud},
    {icon_name: "04d", icon_image: cloud},
    {icon_name: "04n", icon_image: night_cloud},
    {icon_name: "09d", icon_image: rainy_day},
    {icon_name: "09n", icon_image: rainy_night},
    {icon_name: "10d", icon_image: rainy_day},
    {icon_name: "10n", icon_image: rainy_night},
    {icon_name: "11d", icon_image: thunderstorm},
    {icon_name: "11n", icon_image: thunderstorm_night},
]


export const weather_icon:weatherIcon[] = [
    {icon_name: "01d" , icon_image: sunny},
    {icon_name: "01n" , icon_image: night},
    {icon_name: "02d" , icon_image: cloud},
    {icon_name: "02n" , icon_image: night_cloud},
    {icon_name: "50n", icon_image: night_haze},
    {icon_name: "50d", icon_image: haze},
    {icon_name: "03d", icon_image: cloud},
    {icon_name: "03n", icon_image: night_cloud},
    {icon_name: "04d", icon_image: cloud},
    {icon_name: "04n", icon_image: night_cloud},
    {icon_name: "09d", icon_image: rainy_day},
    {icon_name: "09n", icon_image: rainy_night},
    {icon_name: "10d", icon_image: rainy_day},
    {icon_name: "10n", icon_image: rainy_night},
    {icon_name: "11d", icon_image: thunderstorm},
    {icon_name: "11n", icon_image: thunderstorm_night},
]

export const weather_theme: weatherTheme[] = [
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

export const convertUnixToTime = (unixTimestamp: number | undefined): string => {
    if (!unixTimestamp) return "N/A"; // Handle case where timestamp is undefined
    const date = new Date(unixTimestamp * 1000); // Convert to milliseconds
    const hours = date.getHours().toString().padStart(2, '0'); // Get hours and pad with zero
    const minutes = date.getMinutes().toString().padStart(2, '0'); // Get minutes and pad with zero
    return `${hours}:${minutes}`; // Format as HH:MM
};




