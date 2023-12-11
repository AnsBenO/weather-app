import "./CurrentWeather.css";
import { useSelector } from "react-redux";
import { selectCurrentWeather } from "../../store/slices/weatherSlice";

const CurrentWeather: React.FC = () => {
	const data = useSelector(selectCurrentWeather);
	return (
		<>
			{data && (
				<div className="weather">
					<div className="top">
						<div>
							<p className="city">{data.city}</p>
							<p className="weather-description">{`${data.weather[0].description}`}</p>
						</div>
						<img
							src={`/weather-app/icons/${data.weather[0].icon}.png`}
							alt="weather"
							className="weather-icon"
							draggable="false"
						/>
					</div>
					<div className="bottom">
						<p className="temp">{`${Math.round(
							data.main.temp - 273.15
						)}°C`}</p>
						<div className="details">
							<div className="parameter-row">
								<span className="parameter-label">
									Feels like
								</span>
								<span className="parameter-value">{`${Math.round(
									data.main.feels_like - 273.15
								)}°C`}</span>
							</div>
							<div className="parameter-row">
								<span className="parameter-label">Wind</span>
								<span className="parameter-value">{`${data.wind.speed} m/s`}</span>
							</div>
							<div className="parameter-row">
								<span className="parameter-label">
									Humidity
								</span>
								<span className="parameter-value">{`${data.main.humidity} %`}</span>
							</div>
							<div className="parameter-row">
								<span className="parameter-label">Presure</span>
								<span className="parameter-value">
									{`${data.main.pressure} hPa`}
								</span>
							</div>
						</div>
					</div>
				</div>
			)}
		</>
	);
};

export default CurrentWeather;
