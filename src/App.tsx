import { useState } from "react";
import axios from "axios";
import { Droplet, Wind, Thermometer, Cloud } from "lucide-react";
import { format } from "date-fns";
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
        humidity: number;
        last_updated: Date;
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
    
    const formattedLocalTime = weatherData ? format(new Date(weatherData.location.localtime), "HH:mm'"): '';
    const formattedLastUpdated = weatherData ? format(new Date(weatherData.current.last_updated), "d'/'MM'/'yyyy, HH:mm"): '';


    return (
        <>
            <main className="bg-weather-default">
                <div className="weather-container">
                    {/* Search */}
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
                            {/* Header with location and temperature*/}
                            <header className="location-header">
                                <div className="location-title">
                                    <p>{weatherData.location.name}, {weatherData.location.country}</p>
                                    
                                    <p>{formattedLocalTime}</p>
                                </div>
                                <div className="weather-temp-container">
                                    <div className="weather-temp">
                                        {weatherData.current.temp_c}°
                                    </div>

                                    <img 
                                        className="weather-icon"
                                        src={weatherData.current.condition.icon} 
                                        alt={weatherData.current.condition.text}
                                    />
                                </div>
                            </header>

                            {/* Weather Forecast */}
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

                            {/* air condition */}
                            <div className="air-conditions">
                                <h3 className="forecast-title">Condição do ar</h3>
                                <div className="conditions-grid">

                                    {/* Feels like */}
                                    <div className="condition-card">
                                        <div className="condition-icon-label">
                                            <div className="condition-icon">
                                                <Thermometer size={30} />
                                            </div>
                                            <p className="condition-label">Sensação Térmica</p>
                                        </div>
                                        <p className="condition-value">{Math.round(weatherData.current.feelslike_c)}°</p>
                                    </div>
                                    
                                    {/* Humidity */}
                                    <div className="condition-card">
                                        <div className="condition-icon-label">
                                            <div className="condition-icon">
                                                <Droplet size={30} />
                                            </div>
                                            <p className="condition-label">Umidade</p>
                                        </div>
                                        <p className="condition-value">{weatherData.current.humidity}%</p>
                                    </div>
                                    
                                    {/* Wind speed */}
                                    <div className="condition-card">
                                        <div className="condition-icon-label">
                                            <div className="condition-icon">
                                                <Wind size={30} />
                                            </div>
                                            <p className="condition-label">Velocidade do vento</p>
                                        </div>
                                        <p className="condition-value">{weatherData.current.wind_kph} km/h</p>
                                    </div>
                                    
                                    {/* Condition describe */}
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

            {/* Footer */}
            <footer>
                <p>Última atualização: {formattedLastUpdated}</p>
            </footer>  
        </>
    );
}

export default Clima;