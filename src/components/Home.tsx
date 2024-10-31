import React, { useEffect, useState } from "react";
import { Navbar } from "./Navbar";
import { useQuery } from "@tanstack/react-query";
import { fetchGeocoding } from "../apis/geocoding";
import { fetchWeather } from "../apis/weather";
import { IGeocodingResponse } from "../types/geocoding-type";
import { ICurrentWeatherResponse } from "../types/weather-type";
import { Map } from "../components/Map";

interface Coordinates {
  lat: number;
  lon: number;
}

export const Home: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [coordinates, setCoordinates] = useState<Coordinates | null>(null);
  const [weatherData, setWeatherData] =
    useState<ICurrentWeatherResponse | null>(null);

  const geocoding = useQuery({
    queryKey: ["fetching-geocoding", searchQuery],
    queryFn: () => fetchGeocoding({ query: searchQuery }),
    enabled: !!searchQuery,
  });
  console.log(geocoding.data);

  const weather = useQuery({
    queryKey: ["fetching-weather", coordinates],
    queryFn: () =>
      coordinates
        ? fetchWeather({ lat: coordinates.lat, lon: coordinates.lon })
        : Promise.reject("Coordinates not set"),
    enabled: !!coordinates,
  });

  useEffect(() => {
    if (geocoding.isSuccess && geocoding.data?.results.length > 0) {
      const { lat, lng } = geocoding.data.results[0].geometry;
      setCoordinates({ lat, lon: lng });
    } else {
      setCoordinates(null);
    }
  }, [geocoding.isSuccess, geocoding.data]);

  useEffect(() => {
    if (weather.isSuccess && weather.data) {
      console.log("Weather data from API:", weather.data);
      setWeatherData(weather.data);
    }
  }, [weather.isSuccess, weather.data]);

  useEffect(() => {
    if (geocoding.isError) {
      console.error("Error fetching geocoding data:", geocoding.error);
    }
  }, [geocoding.error, geocoding.isError]);

  useEffect(() => {
    if (weather.isError) {
      console.error("Error fetching weather data:", weather.error);
    }
  }, [weather.error, weather.isError]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar onSearch={handleSearch} />
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 p-4 grid-rows-2">
        <div className="bg-gray-300 shadow-md rounded-lg  flex flex-col px-3 gap-4 py-7">
          {geocoding.isLoading ? (
            <p>Loading...</p>
          ) : geocoding.data ? (
            <>
              <h2 className="text-2xl font-bold mb-5">
                {geocoding.data?.results[0].components.country}
              </h2>
              <p>
                <strong>continent:</strong>
                {geocoding.data?.results[0].components.continent}
              </p>
              <p>
                <strong>Native Name :</strong>
                {geocoding.data?.results[0].annotations.currency.name}
              </p>
              <p>
                <strong>timezone :</strong>{" "}
                {geocoding.data?.results[0].annotations.timezone.name}
              </p>
              <p>
                <strong>symbol :</strong>{" "}
                {geocoding.data?.results[0].annotations.currency.symbol}
              </p>
            </>
          ) : (
            <p>Loading country details...</p>
          )}
        </div>

        <div className="bg-orange-500 text-white text-5xl font-bold shadow-md rounded-lg flex flex-col">
          <h3 className="text-2xl font-semibold mb-2 py-3 bg-slate-900 text-center">
            Calling Code
          </h3>
          {geocoding.isLoading ? (
            <p className="p-4">Loading...</p>
          ) : geocoding.data ? (
            <div className="flex flex-col justify-center items-center py-32">
              <p>{geocoding.data.results[0].annotations.callingcode}</p>
            </div>
          ) : (
            <p className="p-4">No data</p>
          )}
        </div>

        <div className="bg-white shadow-md rounded-lg p-6 flex items-center justify-center">
          {/* {flagUrl ? (
            <img src={flagUrl} alt="Country flag" className="rounded-lg" />
          ) : (
            <p>Loading flag...</p>
          )} */}
        </div>

        <div className="bg-white shadow-md rounded-lg col-span-1 ">
          <h3 className="text-xl font-semibold bg-gray-300 py-3 text-orange-500 text-center">
            Capital Weather Report
          </h3>
          {weather.isLoading ? (
            <p>Loading weather data...</p>
          ) : weather.data ? (
            <>
              <div className="flex flex-col justify-center items-center pb-3">
                <img
                  src={`https://openweathermap.org/img/wn/${weather.data.weather[0].icon}@2x.png`}
                />
                <p className="text-lg">
                  {weather.data.weather[0]?.description}
                </p>
              </div>
              <div className="flex  flex-col gap-y-3 px-3">
                <p>
                  <strong>Wind Speed:</strong> {weather.data.wind?.speed} m/s
                </p>
                <p>
                  <strong>Temperature:</strong> {weather.data.main?.temp}°F
                </p>
                <p>
                  <strong>Humidity:</strong> {weather.data.main?.humidity}%
                </p>
              </div>
            </>
          ) : (
            <p className="p-3">No weather data available.</p>
          )}
        </div>

        <div className="bg-white shadow-md rounded-lg col-span-2 p-6 flex justify-center items-center">
          {coordinates ? (
            <Map lat={coordinates.lat} lon={coordinates.lon} />
          ) : (
            <p>No location data available for map.</p>
          )}
        </div>
      </div>
    </div>
  );
};
