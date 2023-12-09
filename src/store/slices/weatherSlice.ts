import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import {
    OPENWEATHER_API_URL,
    OPENWEATHER_API_KEY,
    GEO_API_URL,
    geoApiOptions,
} from "../../api";
import CurrentWeatherData from "../../types/CurrentWeatherData.type";
import ForecastData from "../../types/ForecastData.type";
import { RootState } from "../store";
import SearchData from "../../types/SearchData.type";
import GeolocationData from "../../types/GeolocationData.type";

interface WeatherState {
    currentWeather: CurrentWeatherData | null;
    forecast: ForecastData | null;
    loading: { status: boolean; message: string };
    error: string | null;
}

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

export const getUserLocation = createAsyncThunk(
    "weather/getUserLocation",
    async (_, thunkAPI) => {
        try {
            if ("geolocation" in navigator) {
                const geolocationOptions = {
                    timeout: 10000,
                };

                const position = await new Promise<GeolocationPosition>(
                    (resolve, reject) => {
                        navigator.geolocation.getCurrentPosition(
                            resolve,
                            reject,
                            geolocationOptions
                        );
                    }
                );

                const latitude: number = position.coords.latitude;
                const longitude: number = position.coords.longitude;

                const response = await fetch(
                    `${GEO_API_URL}/locations/${latitude}${longitude}/nearbyCities?radius=20`,
                    geoApiOptions
                );
                const data = (await response.json()) as GeolocationData;
                const city = data.data[0];
                const options = {
                    value: `${latitude} ${longitude}`,
                    label: `${city.name}, ${city.countryCode}`,
                };

                void thunkAPI.dispatch(fetchWeatherData(options));
            } else {
                return thunkAPI.rejectWithValue("Error getting user location");
            }
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error instanceof Error
                    ? error.message
                    : "Error getting user location"
            );
        }
    }
);

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

export const selectCurrentWeather = (state: RootState) =>
    state.weather.currentWeather;
export const selectForecast = (state: RootState) => state.weather.forecast;
export const selectLoading = (state: RootState) => state.weather.loading;
export const selectError = (state: RootState) => state.weather.error;
export const selectCoord = (state: RootState) =>
    state.weather.currentWeather?.coord;
export const weatherReducer = weatherSlice.reducer;
