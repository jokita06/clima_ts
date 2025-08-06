import { useState } from "react";
import axios from "axios";
import { format } from "date-fns";
import { Droplet, MapPin, Wind, SunMedium } from "lucide-react";
import './App.css'

interface WeatherResponse {
    location: {
        name: string;
        country: string;
        localtime: string;
    };
    current: {
        temp_c: number;  
        humidity: number; 
        wind_kph: number;
        feelslike_c: number;
        last_updated: string;
        condition: {
            icon: string;
            text: string;
        }
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
            const url = `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${cidade}&lang=pt&days=7`;

            const resposta = await axios.get<WeatherResponse>(url);
            setWeatherData(resposta.data);

        } catch (error) {
            setWeatherData(null);
            setErro('Cidade não encontrada');
        } finally {
            setIsLoading(false);
        }
    }

    const getBackgroundClass = () => {
        if (!weatherData) return "FundoAzul";
        
        const condition = weatherData.current.condition.text;
        
        if (condition === "Sol") return "FundoDescricaoSol";
        if (condition === "Possibilidade de chuva irregular") return "FundoDescricaoChuva";
        if (condition === "Parcialmente nublado") return "FundoDescricaoParcialmenteNublado";
        if (condition === "Nublado") return "FundoNublado";
        if (condition === "Neblina") return "FundoNeblina";
        if (condition === "Chuva fraca") return "FundoDescricaoChuvaFraca";
        if (condition === "Céu limpo") return "FundoCeuLimpo";
        
        return "FundoAzul";
    };

    return (
        <main className={getBackgroundClass()}>
            <div className="search-container">
                <input
                    type="text"
                    value={cidade}
                    onChange={(e) => setCidade(e.target.value)}
                    placeholder="Digite uma cidade"
                />
                <button onClick={buscarClima} disabled={isLoading}>
                    {isLoading ? "Buscando..." : "Buscar"}
                </button>
            </div>

            {isLoading && <p className="loading-text">Carregando...</p>}

            {erro && <p className="error-text">{erro}</p>}

            {weatherData && (
                <div className="weather-container">
                    <div className="location">
                        <div className="city-container">
                            <MapPin size={20} />
                            <h2>{weatherData.location.name}, {weatherData.location.country}</h2>
                        </div>

                        <img 
                          src={weatherData.current.condition.icon} 
                          alt={weatherData.current.condition.text}
                        />
                    </div>

                    <div className="main-info">

                        <div className="temp-cond">
                            <span className="temperature">{weatherData.current.temp_c}°C</span>
                            <span className="condition">{weatherData.current.condition.text}</span>
                        </div>
                    </div>

                    <div className="details">
                        <div className="detail-item">
                            <Droplet size={18} />
                            <span>Umidade: {weatherData.current.humidity}%</span>
                        </div>
                        <div className="detail-item">
                            <Wind size={18} />
                            <span>Vento: {weatherData.current.wind_kph} km/h</span>
                        </div>
                        <div className="detail-item">
                            <span>Sensação: {weatherData.current.feelslike_c}°C</span>
                        </div>
                    </div>

                    <div className="update-time">
                        <small>
                            Atualizado em: {format(new Date(weatherData.current.last_updated), 'dd/MM/yyyy HH:mm')}
                        </small>
                    </div>
                </div>
            )}
        </main>
    );
}

export default Clima;