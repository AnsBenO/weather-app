import { createAsyncThunk } from "@reduxjs/toolkit";
import SearchData from "../../types/SearchData.type";
import { OPENWEATHER_API_KEY, OPENWEATHER_API_URL } from "../../api";
import CurrentWeatherData from "../../types/CurrentWeatherData.type";
import ForecastData from "../../types/ForecastData.type";

export const fetchWeatherData = createAsyncThunk(
    "weather/fetchWeatherData",
    async (searchData: SearchData, thunkAPI) => {
        try {
            const { value, label } = searchData;
            const [latitude, longitude] = value.split(" ");

            const fetchCurrentWeather = fetch(
                `${OPENWEATHER_API_URL}/weather?lat=${latitude}&lon=${longitude}&appid=${OPENWEATHER_API_KEY}`
            );
            const fetchForecast = fetch(
                `${OPENWEATHER_API_URL}/forecast?lat=${latitude}&lon=${longitude}&appid=${OPENWEATHER_API_KEY}`
            );

            const [currentWeatherResponse, forecastResponse] =
                await Promise.all([fetchCurrentWeather, fetchForecast]);

            let currentWeather =
                (await currentWeatherResponse.json()) as CurrentWeatherData;
            currentWeather = { ...currentWeather, city: label };
            const forecast = (await forecastResponse.json()) as ForecastData;

            return { currentWeather, forecast, label };
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error instanceof Error
                    ? error.message
                    : "Error fetching weather data"
            );
        }
    }
);
