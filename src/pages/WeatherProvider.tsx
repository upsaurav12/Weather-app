import  { createContext, useState, ReactNode } from 'react';
import { WeatherData } from '../component/type';
// Define your context type
interface WeatherContextType {
    weatherData: WeatherData | null;
    setWeatherData: (data: WeatherData) => void;
}

// Create the context
const WeatherContext = createContext<WeatherContextType | undefined>(undefined);

// Create the provider component
export const WeatherProvider = ({ children }: { children: ReactNode }) => {
    const [weatherData, setWeatherData] = useState<WeatherData| null>(null);

    return (
        <WeatherContext.Provider value={{ weatherData, setWeatherData}}>
            {children}
        </WeatherContext.Provider>
    );
};

// Custom hook for consuming the weather context
/*
export const useWeather = () => {
    const context = useContext(WeatherContext);
    if (!context) {
        throw new Error('useWeather must be used within a WeatherProvider');
    }
    return context;
};
*/