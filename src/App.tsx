/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { useEffect, useState } from "react";
import "./App.css";
import { GEO_API_URL, OPENWEATHER_API_KEY, OPENWEATHER_API_URL, geoApiOptions } from "./api";
import CurrentWeather from "./components/CurrentWeather/CurrentWeather";
import Search from "./components/Search/Search";
import { CurrentWeatherData } from "./types/CurrentWeatherType";
import { City, ForecastData } from "./types/ForecastType";
import Forecast from "./components/Forecast/Forecast";

interface SearchData {
	value: string;
	label: string;
}

interface Data {
	data: City[];
}

function App() {
	const [CurrentWeatherData, setCurrentWeatherData] =
		useState<CurrentWeatherData | null>(null);
	const [forecastData, setForecastData] = useState<ForecastData | null>(null);
	const [loading, setLoading] = useState<[boolean, string]>([false, ""]);

	const [userLocation, setUserLocation] = useState<number[]>([0, 0]);

	useEffect(() => {
		function getUserLocation() {
			if ("geolocation" in navigator) {
				setLoading([true, "Allow Weather to use your location?"]);

				const geolocationOptions = {
					timeout: 3000,
				};

				navigator.geolocation.getCurrentPosition(
					function (position) {
						const latitude = position.coords.latitude;
						const longitude = position.coords.longitude;
						setUserLocation([latitude, longitude]);
						setLoading([true, "Processing..."]);

						fetch(`${GEO_API_URL}/locations/${latitude}${longitude}/nearbyCities?radius=20`, geoApiOptions)
							.then(response => response.json())
							.then((response: Data) => {
								const city = response.data[0];
								const options = {
									value: `${latitude} ${longitude}`,
									label: `${city.name}, ${city.countryCode}`,
								};
								onSearch(options);
							})
							.catch(error => {
								console.log("Error fetching nearby cities:", error);
								setLoading([true, "Failed to fetch nearby cities. Please select a location."]);
							});
					},
					function (error) {
						setLoading([true, "Failed to get your location. Please select a location."]);
						console.log("Error getting user location:", error);
					},
					geolocationOptions
				);
			} else {
				setLoading([true, "Please select a location.."]);
				console.log("Geolocation is not supported by this browser.");
			}
		}

		getUserLocation();
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
			.then(async response => {
				const weatherResponse: CurrentWeatherData = await response[0].json();
				// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
				const forecastResponse = await response[1].json();

				setCurrentWeatherData({ ...weatherResponse, city: searchData.label });
				// eslint-disable-next-line @typescript-eslint/no-unsafe-argument
				setForecastData({ ...forecastResponse, city: searchData.label });
				setLoading([false, ""])

			})

			.catch(err => {
				console.error(err);
				setLoading([false, ""]);
			});
	};

	return (
		<div className="container">
			{(!(loading[1] === "Processing..." || loading[1] === "Allow Weather to use your location?")) && (
				<Search onSearchChange={onSearch} userLocation={userLocation} />
			)}
			{loading[0] && <div className="loading"></div>}
			{loading[0] && <div className="select-city-message">{loading[1]}</div>}
			{CurrentWeatherData && <CurrentWeather data={CurrentWeatherData} />}
			{forecastData && <Forecast data={forecastData} />}
		</div>
	);
}

export default App;
