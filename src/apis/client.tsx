import axios from "axios";

export const openCageClient = axios.create({
  baseURL: "https://api.opencagedata.com",
  timeout: 5000,
});

export const openWeatherClient = axios.create({
  baseURL: "https://api.openweathermap.org",
  timeout: 5000,
  params: {
    appid: "dd7fedef196ff2a29d37e6554c64a89e",
    units: "metric",
  },
});
