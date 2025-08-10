import { useState } from "react";
import axios from "axios";
import { format } from "date-fns";
import { MapPin, Droplet, Wind, Sun, CloudRain, Thermometer, Search, Cloud } from "lucide-react";
import './App.css';

interface WeatherResponse {
    location: {
        name: string;
        country: string;
    };
    current: {
        temp_c: number;
        feelslike_c: number;
        wind_kph: number;
        humidity: number;
        condition: {
            icon: string;
            text: string;
        };
    };
    forecast?: {
        forecastday: Array<{
            hour: Array<{
                time: string;
                temp_c: number;
                chance_of_rain: number;
                condition: {
                    icon: string;
                    text: string;
                };
            }>;
        }>;
    };
}


export function Clima() {
    const [cidade, setCidade] = useState("");
    const [weatherData, setWeatherData] = useState<WeatherResponse | null>(null);
    const [erro, setErro] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    async function buscarClima() {
        if (!cidade) return;

        try {
            setIsLoading(true);
            setErro("");
            const apiKey = 'fe7af708db174cda86d161805252907';
            const url = `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${cidade}&days=1&aqi=no&alerts=no`;
            
            const resposta = await axios.get<WeatherResponse>(url);
            setWeatherData(resposta.data);
        } catch (error) {
            setErro('Cidade não encontrada');
            setWeatherData(null);
        } 
    }

    const forecastHours = ['6:00 AM', '9:00 AM', '12:00 PM', '3:00 PM', '6:00 PM', '9:00 PM'];

    const getHourData = (hourString: string) => {
        if (!weatherData?.forecast) return null;
        
        return weatherData.forecast.forecastday[0].hour.find(h => {
            const time = format(new Date(h.time), 'h:mm a');
            return time === hourString;
        });
    };

    const getWeatherIcon = (condition: string) => {
        const lowerCondition = condition.toLowerCase();
        
        if (lowerCondition.includes('sun') || lowerCondition.includes('clear')) {
            return <Sun size={24} />;
        }
        if (lowerCondition.includes('rain')) {
            return <CloudRain size={24} />;
        }
        if (lowerCondition.includes('cloud')) {
            return <Cloud size={24} />;
        }
        
        return <Cloud size={24} />;
    };

    return (
        <main className="bg-weather-default">
            <div className="weather-container">
                {/* Barra de pesquisa */}
                <div className="search-container">
                    <input
                        type="text"
                        value={cidade}
                        onChange={(e) => setCidade(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && buscarClima()}
                        placeholder="Digite uma cidade"
                        className="search-input"
                    />
                </div>

                {erro && (
                    <div className="error-state fade-in">
                        {erro}
                    </div>
                )}

                {weatherData && (
                    <div className="weather-card fade-in">
                        {/* Cabeçalho com localização e temperatura atual */}
                        <div className="location-header">
                            <div className="location-title">
                                <span>{weatherData.location.name}, {weatherData.location.country}</span>
                                <div className="weather-temp">
                                    {weatherData.current.temp_c}°
                                </div>
                            </div>
                            <div className="weather-temp-container">
                                <div>
                                    <img 
                                    className="weather-icon"
                                    src={weatherData.current.condition.icon} 
                                    alt={weatherData.current.condition.text}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Previsão horária */}
                        <div className="hourly-forecast">
                            <h3 className="forecast-title">Previsão do tempo</h3>
                            <div className="forecast-grid">
                                {forecastHours.map((hour, index) => {
                                    const hourData = getHourData(hour);
                                    return (
                                        <div key={index} className="forecast-hour">
                                            <span className="forecast-time">{hour.split(' ')[0]}</span>
                                            {hourData && (
                                                <img 
                                                    src={hourData.condition.icon} 
                                                    alt={hourData.condition.text}
                                                    style={{ width: '70px', height: '70px' }}
                                                />
                                            )}
                                            <span className="forecast-temp">
                                                {hourData ? `${Math.round(hourData.temp_c)}°` : '--'}
                                            </span>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Condições do ar */}
                        <div className="air-conditions">
                            <h3 className="forecast-title">Condição do ar</h3>
                            <div className="conditions-grid">
                                <div className="condition-card">
                                <div className="condition-icon-label">
                                        <div className="condition-icon">
                                            <Thermometer size={30} />
                                        </div>
                                        <p className="condition-label">Real Feel</p>
                                    </div>

                                    <p className="condition-value">{Math.round(weatherData.current.feelslike_c)}°</p>
                                </div>
                                <div className="condition-card">
                                    <div className="condition-icon-label">
                                        <div className="condition-icon">
                                            <CloudRain size={30} />
                                        </div>
                                        <p className="condition-label">Chance of Rain</p>
                                    </div>
                                    
                                    <p className="condition-value">
                                        {getHourData('12:00 PM')?.chance_of_rain || 0}%
                                    </p>
                                </div>
                                <div className="condition-card">
                                    <div className="condition-icon-label">
                                        <div className="condition-icon">
                                            <Wind size={30} />
                                        </div>
                                        <p className="condition-label">Wind</p>
                                    </div>
                                    
                                    <p className="condition-value">{weatherData.current.wind_kph} km/h</p>
                                </div>
                                <div className="condition-card">
                                    <div className="condition-icon-label">
                                        <div className="condition-icon">
                                            <Sun size={30} />
                                        </div>
                                        <p className="condition-label">UV Index</p>
                                    </div>
                                    
                                    <p className="condition-value">3</p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </main>
    );
}

export default Clima;