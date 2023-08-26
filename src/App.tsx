import { useEffect, useState } from "react";
import "./App.css";
import { GEO_API_URL, OPENWEATHER_API_KEY, OPENWEATHER_API_URL, geoApiOptions } from "./api";
import CurrentWeather from "./components/CurrentWeather/CurrentWeather";
import Search from "./components/Search/Search";
import CurrentWeatherData from "./types/CurrentWeatherData.type";
import ForecastData from "./types/ForecastData.type";
import Forecast from "./components/Forecast/Forecast";
import GeolocationData from "./types/GeolocationData.type";
import SearchData from "./types/SearchData.type";


function App() {
	const [CurrentWeatherData, setCurrentWeatherData] =
		useState<CurrentWeatherData | null>(null);
	const [forecastData, setForecastData] = useState<ForecastData | null>(null);
	const [loading, setLoading] = useState<[boolean, string]>([false, ""]);

	const [userLocation, setUserLocation] = useState<number[]>([0, 0]);
	useEffect(() => {
		//* Getting user's location 
		const getUserLocation = async () => {
			if ("geolocation" in navigator) {
				setLoading([true, "Allow Weather to use your location?"]);

				const geolocationOptions = {
					timeout: 10000,
				};

				try {
					const position = await new Promise<GeolocationPosition>((resolve, reject) => {
						navigator.geolocation.getCurrentPosition(resolve, reject, geolocationOptions);
					});

					const latitude: number = position.coords.latitude;
					const longitude: number = position.coords.longitude;
					setUserLocation([latitude, longitude]);
					setLoading([true, "Processing..."]);

					const response = await fetch(`${GEO_API_URL}/locations/${latitude}${longitude}/nearbyCities?radius=20`, geoApiOptions);
					const data = await response.json() as GeolocationData;
					const city = data.data[0];
					const options = {
						value: `${latitude} ${longitude}`,
						label: `${city.name}, ${city.countryCode}`,
					};
					onSearch(options);
				} catch (error) {
					console.log("Error fetching or getting user location:", error);
					setLoading([true, "Failed to fetch nearby cities. Please select a location."]);
				}
			} else {
				setLoading([true, "Please select a location.."]);
				console.log("Geolocation is not supported by this browser.");
			}
		};
		getUserLocation()
			.catch(err => console.error(err))
	}, []);



	const onSearch = (searchData: SearchData) => {
		setLoading([true, "Please wait..."])
		const [latitude, longitude] = searchData.value.split(" ");
		const fetchCurrentWeather = fetch(
			`${OPENWEATHER_API_URL}/weather?lat=${latitude}&lon=${longitude}&appid=${OPENWEATHER_API_KEY}`
		);

		const fetchForecast = fetch(
			`${OPENWEATHER_API_URL}/forecast?lat=${latitude}&lon=${longitude}&appid=${OPENWEATHER_API_KEY}`
		);

		Promise.all([fetchCurrentWeather, fetchForecast])
			.then(async (response) => {
				const weatherResponse: CurrentWeatherData = await response[0].json() as CurrentWeatherData;
				const forecastResponse = await response[1].json() as ForecastData;

				setCurrentWeatherData({ ...weatherResponse, city: searchData.label });
				setForecastData({ ...forecastResponse, city: searchData.label });
				setLoading([false, ""])

			})

			.catch(err => {
				console.error(err);
				setLoading([false, ""]);
			});
	};

	return (
		<main className="container">
			{(!(loading[1] === "Processing..." || loading[1] === "Allow Weather to use your location?")) && (
				<Search onSearchChange={onSearch} userLocation={userLocation} />
			)}
			<div className="current">
				{loading[0] && loading[1] !== "Failed to fetch nearby cities. Please select a location." && <div className="loading"></div>}
				{loading[0] && <div className="select-city-message">{loading[1]}</div>}
				{CurrentWeatherData && <CurrentWeather data={CurrentWeatherData} />}
			</div>
			{forecastData && <Forecast data={forecastData} />}
		</main>
	);
}

export default App;
