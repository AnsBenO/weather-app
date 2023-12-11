import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import CurrentWeatherData from "../../types/CurrentWeatherData.type";
import ForecastData from "../../types/ForecastData.type";
import { RootState } from "../store";
import { fetchWeatherData } from "../thunks/fetchWeatherDate";
import { getUserLocation } from "../thunks/getUserLocaction";

// Interface for the Weather State
interface WeatherState {
    currentWeather: CurrentWeatherData | null;
    forecast: ForecastData | null;
    loading: { status: boolean; message: string };
    error: string | null;
}

// Weather state
const weatherSlice = createSlice({
    name: "weather",
    initialState: {
        currentWeather: null,
        forecast: null,
        loading: { status: false, message: "" },
        error: null,
    } as WeatherState,
    reducers: {},
    extraReducers: builder => {
        builder
            .addCase(fetchWeatherData.pending, state => {
                state.loading = { status: true, message: "Please wait..." };
                state.error = null;
            })
            .addCase(fetchWeatherData.rejected, (state, action) => {
                state.loading = {
                    status: false,
                    message: "Failed to retrieve data",
                };
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
                    state.loading = { status: false, message: "" };
                    state.currentWeather = action.payload.currentWeather;
                    state.forecast = action.payload.forecast;
                    state.error = null;
                }
            )
            .addCase(getUserLocation.pending, state => {
                state.loading = {
                    status: true,
                    message: "Please allow Weather to use your location",
                };
                state.error = null;
            })
            .addCase(getUserLocation.rejected, (state, action) => {
                state.loading = {
                    status: false,
                    message:
                        "Failed to get your location, please select a location",
                };
                state.error = action.payload as string;
            });
    },
});

// Selectors
export const selectCurrentWeather = (state: RootState) =>
    state.weather.currentWeather;
export const selectForecast = (state: RootState) => state.weather.forecast;
export const selectLoading = (state: RootState) => state.weather.loading;
export const selectError = (state: RootState) => state.weather.error;
export const selectCoord = (state: RootState) =>
    state.weather.currentWeather?.coord;

// Weather reducer
export const weatherReducer = weatherSlice.reducer;
