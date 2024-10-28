import { openWeatherClient } from "./client";
import { IOneCallResponse } from "../types/weather-type";
import { urls } from "./urls";

interface IFetchWeather {
  lat: number;
  lon: number;
}

export const fetchWeather = async (
  params: IFetchWeather
): Promise<IOneCallResponse> => {
  const response = await openWeatherClient.get<IOneCallResponse>(
    urls.weather.currentWeather,
    {
      params: {
        lat: params.lat,
        lon: params.lon,
        exclude: "minutely,hourly,alerts",
      },
    }
  );
  return response.data;
};
