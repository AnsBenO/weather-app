import { useEffect } from "react";
import "./App.css";
import CurrentWeather from "./components/CurrentWeather/CurrentWeather";
import Search from "./components/Search/Search";
import Forecast from "./components/Forecast/Forecast";
import { useDispatch, useSelector } from "react-redux";
import { selectError, selectLoading } from "./store/slices/weatherSlice";
import { AppDispatch } from "./store/store";
import { getUserLocation } from "./store/thunks/getUserLocaction";

function App() {
	const loading = useSelector(selectLoading);
	const error = useSelector(selectError);

	const dispatch = useDispatch<AppDispatch>();

	useEffect(() => {
		const fetchUserLocation = () => {
			dispatch(getUserLocation()).catch(err => console.error(err));
		};
		fetchUserLocation();
	}, [dispatch]);

	return (
		<main className="container">
			{(loading.status || loading.message !== "") && (
				<div className="message-container">
					{loading.status && (
						<div className="loader-container">
							<div className="loading"></div>
						</div>
					)}
					{loading.status && (
						<div className="select-city-message">
							{loading.message}
						</div>
					)}
					{!loading.status && error && (
						<div className="error-message">{loading.message}</div>
					)}
				</div>
			)}
			{!(
				loading.message === "Processing..." ||
				loading.message === "Please allow Weather to use your location"
			) && <Search />}
			<div className="current">
				<CurrentWeather />
			</div>
			<Forecast />
		</main>
	);
}

export default App;
