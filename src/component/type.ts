export interface WeatherData {
    coord: {
      lon: number;
      lat: number;
    };
    weather: {
      id: number;
      main: string;
      description: string;
      icon: string;
    }[];
    base: string;
    main: {
      temp: number;
      feels_like: number;
      temp_min: number;
      temp_max: number;
      pressure: number;
      humidity: number;
    };
    visibility: number;
    wind: {
      speed: number;
      deg: number;
    };
    clouds: {
      all: number;
    };
    dt: number;
    sys: {
      type: number;
      id: number;
      country: string;
      sunrise: number;
      sunset: number;
    };
    timezone: number;
    id: number;
    name: string;
    cod: number;
  }


  export interface ForecastData {
    list: {
      dt: number;
      main: {
        humidity: number;
        pressure: number;
        temp: number;
      };
      visibility: number;
      wind: {
        speed: number;
      };
      weather: {
        description: string;
        icon: string;
      }[];
    }[];
  }


  export interface Pollution {
    list: {
      dt: number;
      main: {
        aqi: number;
      },

      components: {
        co: number;
        no: number;
        no2: number;
        o3: number;
        pm2_5: number;
        pm10: number;
        nh3: number;
      }
    }[]
  }
  

  export interface CachedData<T> {
    data: T,
    timestamp: number;
  }
  