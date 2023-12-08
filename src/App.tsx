import { useEffect } from "react";
import "./App.css";
import CurrentWeather from "./components/CurrentWeather/CurrentWeather";
import Search from "./components/Search/Search";
import Forecast from "./components/Forecast/Forecast";
import { useDispatch, useSelector } from "react-redux";
import { getUserLocation, selectLoading } from "./store/slices/weatherSlice";
import { AppDispatch } from "./store/store";


function App() {

	const loading = useSelector(selectLoading);
	const dispatch = useDispatch<AppDispatch>();


	useEffect(() => {

		const fetchUserLocation = () => {
			dispatch(getUserLocation()).catch(err => console.error(err));
		}
		fetchUserLocation()
	}
		, [dispatch]);


	return (
		<main className="container">
			{!(loading.message === "Processing..." || loading.message === "Allow Weather to use your location?") && (
				<Search />
			)}
			<div className="current">
				{loading.status && loading.message !== "Failed to fetch nearby cities. Please select a location." && (
					<div className="loading"></div>
				)}
				{loading.status && <div className="select-city-message">{loading.message}</div>}
				<CurrentWeather />
			</div>
			<Forecast />
		</main>
	);
}

export default App;
