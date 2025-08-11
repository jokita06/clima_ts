import { useState } from "react";
import axios from "axios";
import { MapPin, Droplet, Wind, Sun, CloudRain, Thermometer, Search, Cloud } from "lucide-react";
import './App.css';

interface WeatherResponse {
    location: {
        name: string;
        country: string;
        localtime: Date;
    };
    current: {
        temp_c: number;
        feelslike_c: number;
        wind_kph: number;
        last_updated: string;
        humidity: number;
        condition: {
            icon: string;
            text: string;
        };
    };

    forecast: {
        forecastday: Array<{
            date: string;
            day: {
                maxtemp_c: number;
                mintemp_c: number;
                avgtemp_c: number;
                condition: {
                    text: string;
                    icon: string;
                };
            };
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
            const url = `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${cidade}&days=7&aqi=no&alerts=no`;
            
            const resposta = await axios.get<WeatherResponse>(url);
            setWeatherData(resposta.data);
        } catch (error) {
            setErro('Cidade não encontrada');
            setWeatherData(null);
        } finally {
            setIsLoading(false);
        }
    }

    // Função para obter o nome do dia da semana
    const getDayName = (dateString: string) => {
        const date = new Date(dateString);
        const days = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
        return days[date.getDay()];
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
                                
                                <span>{weatherData.location.localtime}</span>
                            </div>
                            <div className="weather-temp-container">
                                <div>
                                    <img 
                                        className="weather-icon"
                                        src={weatherData.current.condition.icon} 
                                        alt={weatherData.current.condition.text}
                                    />
                                    <div className="weather-temp">
                                        {weatherData.current.temp_c}°
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Previsão do tempo */}
                        <div className="daily-forecast">
                            <h3 className="forecast-title">Previsão do tempo</h3>
                            <div className="forecast-grid">
                                {weatherData.forecast.forecastday.map((day) => (
                                    <div className="forecast-day">
                                        <span className="forecast-dayname">
                                            {getDayName(day.date)}
                                        </span>
                                        <img 
                                            src={day.day.condition.icon} 
                                            alt={day.day.condition.text}
                                            className="forecast-icon"
                                        />
                                        <div className="forecast-temps">
                                            <span className="forecast-max">
                                                {day.day.maxtemp_c}°
                                            </span>
                                            <span className="forecast-min">
                                                {day.day.mintemp_c}°
                                            </span>
                                        </div>
                                    </div>
                                ))}
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
                                        <p className="condition-label">Sensação Térmica</p>
                                    </div>
                                    <p className="condition-value">{Math.round(weatherData.current.feelslike_c)}°</p>
                                </div>
                                
                                <div className="condition-card">
                                    <div className="condition-icon-label">
                                        <div className="condition-icon">
                                            <Droplet size={30} />
                                        </div>
                                        <p className="condition-label">Umidade</p>
                                    </div>
                                    <p className="condition-value">{weatherData.current.humidity}%</p>
                                </div>
                                
                                <div className="condition-card">
                                    <div className="condition-icon-label">
                                        <div className="condition-icon">
                                            <Wind size={30} />
                                        </div>
                                        <p className="condition-label">Vento</p>
                                    </div>
                                    <p className="condition-value">{weatherData.current.wind_kph} km/h</p>
                                </div>
                                
                                <div className="condition-card">
                                    <div className="condition-icon-label">
                                        <div className="condition-icon">
                                            <Cloud size={30} />
                                        </div>
                                        <p className="condition-label">Condição</p>
                                    </div>
                                    <p className="condition-value">{weatherData.current.condition.text}</p>
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