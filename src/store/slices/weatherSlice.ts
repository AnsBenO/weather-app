import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { OPENWEATHER_API_URL, OPENWEATHER_API_KEY } from "../../api";
import CurrentWeatherData from "../../types/CurrentWeatherData.type";
import ForecastData from "../../types/ForecastData.type";
import { RootState } from "../store";
import SearchData from "../../types/SearchData.type";

interface WeatherState {
    currentWeather: CurrentWeatherData | null;
    forecast: ForecastData | null;
    loading: boolean;
    error: string | null;
}

const initialState: WeatherState = {
    currentWeather: null,
    forecast: null,
    loading: false,
    error: null,
};

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

const weatherSlice = createSlice({
    name: "weather",
    initialState,
    reducers: {},
    extraReducers: builder => {
        builder
            .addCase(fetchWeatherData.pending, state => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchWeatherData.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            .addCase(
                fetchWeatherData.fulfilled,
                (
                    state,
                    action: PayloadAction<{
                        currentWeather: CurrentWeatherData;
                        forecast: ForecastData;
                        label: string;
                    }>
                ) => {
                    state.loading = false;
                    state.currentWeather = action.payload.currentWeather;
                    state.forecast = action.payload.forecast;
                    state.error = null;
                }
            );
    },
});

export const selectCurrentWeather = (state: RootState) =>
    state.weather.currentWeather;
export const selectForecast = (state: RootState) => state.weather.forecast;
export const selectLoading = (state: RootState) => state.weather.loading;
export const selectError = (state: RootState) => state.weather.error;
export const selectCoord = (state: RootState) =>
    state.weather.currentWeather?.coord;
export const weatherReducer = weatherSlice.reducer;
