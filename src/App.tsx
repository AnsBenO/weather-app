import { useCallback, useEffect, useState } from "react";
import "./App.css";
import { GEO_API_URL, geoApiOptions } from "./api";
import CurrentWeather from "./components/CurrentWeather/CurrentWeather";
import Search from "./components/Search/Search";
import Forecast from "./components/Forecast/Forecast";
import GeolocationData from "./types/GeolocationData.type";
import SearchData from "./types/SearchData.type";
import { useDispatch } from "react-redux";
import { fetchWeatherData } from "./store/slices/weatherSlice";
import { AppDispatch } from "./store/store";


function App() {

	const [loading, setLoading] = useState<[boolean, string]>([false, ""]);
	const dispatch = useDispatch<AppDispatch>();

	const onSearch = useCallback((searchData: SearchData) => {
		setLoading([true, "Please wait..."]);
		dispatch(fetchWeatherData(searchData))
			.then(() => setLoading([false, ""]))
			.catch((error) => {
				console.error("An unknown error occurred:", error as string);
				setLoading([false, ""]);
			});
	}, [dispatch]);

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
	}, [dispatch, onSearch]);


	return (
		<main className="container">
			{(!(loading[1] === "Processing..." || loading[1] === "Allow Weather to use your location?")) && (
				<Search onSearch={onSearch} />
			)}
			<div className="current">
				{loading[0] && loading[1] !== "Failed to fetch nearby cities. Please select a location." && <div className="loading"></div>}
				{loading[0] && <div className="select-city-message">{loading[1]}</div>}
				<CurrentWeather />
			</div>
			<Forecast />
		</main>
	);
}

export default App;
