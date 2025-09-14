import React, { useState } from "react";
import "./App.css";

interface WeatherData {
    name: string;
    main: {
        temp: number;
        feels_like: number;
        humidity: number;
    };
    weather: {
        main: string;
        description: string;
        icon: string;
    }[];
    wind: {
        speed: number;
    };
}

const App: React.FC = () => {
    const [city, setCity] = useState("");
    const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const API_KEY = process.env.REACT_APP_API_KEY;

    const fetchWeatherData = async (cityName: string) => {
        if (!cityName.trim()) return;

        setLoading(true);
        setError("");

        try {
            const response = await fetch(
                `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${API_KEY}&units=metric`
            );

            console.log(response);

            if (!response.ok) {
                throw new Error("City not found");
            }

            const data: WeatherData = await response.json();
            setWeatherData(data);
        } catch (err) {
            setError(
                err instanceof Error ? err.message : "Something went wrong"
            );
            setWeatherData(null);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        fetchWeatherData(city);
    };

    return (
        <div className="App">
            <div className="container">
                <h1>Weather App</h1>

                <form onSubmit={handleSubmit} className="search-form">
                    <input
                        type="text"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        placeholder="Enter city name..."
                        className="city-input"
                    />
                    <button type="submit" className="search-button">
                        Get Weather
                    </button>
                </form>

                {loading && <div className="loading">Loading...</div>}

                {error && <div className="error">{error}</div>}

                {weatherData && (
                    <div className="weather-card">
                        <h2>{weatherData.name}</h2>
                        <div className="weather-main">
                            <img
                                src={`https://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png`}
                                alt={weatherData.weather[0].description}
                            />
                            <div className="temperature">
                                {Math.round(weatherData.main.temp)}°C
                            </div>
                        </div>
                        <div className="weather-description">
                            {weatherData.weather[0].description}
                        </div>
                        <div className="weather-details">
                            <div className="detail">
                                <strong>Feels like:</strong>{" "}
                                {Math.round(weatherData.main.feels_like)}°C
                            </div>
                            <div className="detail">
                                <strong>Humidity:</strong>{" "}
                                {weatherData.main.humidity}%
                            </div>
                            <div className="detail">
                                <strong>Wind Speed:</strong>{" "}
                                {weatherData.wind.speed} m/s
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default App;
