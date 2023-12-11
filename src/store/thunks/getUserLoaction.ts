import { createAsyncThunk } from "@reduxjs/toolkit";
import { GEO_API_URL, geoApiOptions } from "../../api";
import GeolocationData from "../../types/GeolocationData.type";
import { fetchWeatherData } from "./fetchWeatherDate";

// Async thunk to get user location and dispatch fetchWeatherData using user's location
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
