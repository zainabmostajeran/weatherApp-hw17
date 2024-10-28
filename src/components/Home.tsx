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
    <div className="min-h-screen ">
      <Navbar onSearch={handleSearch} />
      {weatherData && (
        <div>
          <div className="grid grid-cols-3 gap-x-2 my-2">
            <div className="bg-gray-300 p-4">
              <h1 className="text-2xl font-bold ">
                {geocoding.data?.results[0].components.country}
              </h1>
              <div>
                <div className="flex flex-col gap-2 pt-6">
                  <div className="flex gap-2">
                    <span className="text-orange-700 ">continent :</span>
                    <span>
                      {geocoding.data?.results[0].components.continent}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <span className="text-orange-700 ">Native Name :</span>
                    <span>
                      {geocoding.data?.results[0].annotations.currency.name}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <span className="text-orange-700 ">timezone :</span>
                    <span>
                      {" "}
                      {geocoding.data?.results[0].annotations.timezone.name}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <span className="text-orange-700 ">symbol :</span>
                    <span>
                      {geocoding.data?.results[0].annotations.currency.symbol}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div className="border bg-yellow-500 flex flex-col gap-3 pb-3">
              <p className="bg-gray-900 p-4 text-orange-700 text-center text-xl">
                Calling Code
              </p>
              <div className="flex flex-col items-center justify-center text-2xl py-16 font-bold">
                {geocoding.data?.results[0].annotations.callingcode}
              </div>
            </div>
            <div>
              <img
                src={`https://www.openstreetmap.org/img/wn/${geocoding.data?.results[0].annotations.flag}@2x.png`}
              />
            </div>
          </div>
          <div className="flex gap-x-2">
            <div className="w-1/3 border flex flex-col gap-1">
              <p className="bg-gray-300 p-4 text-center text-orange-700  text-xl">
                Capital weather Report
              </p>

              <div className=" flex flex-col items-center justify-center px-40 -mt-5">
                <img
                  src={`https://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png`}
                />
                <p className="text-lg">{weatherData.weather[0]?.description}</p>
              </div>
              <div className="flex gap-2 px-2 pb-2">
                <h3 className="font-semibold">Humidity:</h3>
                <p>{weatherData.main?.humidity}%</p>
              </div>
              <div className="flex gap-2 px-2 pb-2">
                <h3 className="font-semibold">Pressure:</h3>
                <p>{weatherData.main?.pressure} hPa</p>
              </div>
              <div className="flex gap-2 px-2 pb-2">
                <h3 className="font-semibold">temp:</h3>
                <p>{weatherData.main?.temp}°C</p>
              </div>
              <div className="flex gap-2 px-2 pb-2">
                <h3 className="font-semibold">Wind Speed:</h3>
                <p>{weatherData.wind?.speed} m/s</p>
              </div>
              <div className="flex gap-2 px-2 pb-2">
                <h3 className="font-semibold">Wind Direction:</h3>
                <p>{weatherData.wind?.deg}°</p>
              </div>
            </div>
            <div className="w-2/3 bg-white shadow-md rounded-lg  flex justify-center items-center">
              {coordinates ? (
                <Map lat={coordinates.lat} lon={coordinates.lon} />
              ) : (
                <p>No location data available for map.</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
