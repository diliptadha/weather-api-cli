import { fetchWeatherApi } from "openmeteo";
import weatherDescriptions from "../wmo-codes.js";

export const searchWeather = async (lat, lon) => {
  try {
    const params = {
      latitude: lat,
      longitude: lon,
      current: [
        "temperature_2m",
        "relative_humidity_2m",
        "is_day",
        "weather_code",
        "wind_speed_10m",
      ],
      timezone: "auto",
    };

    const url = "https://api.open-meteo.com/v1/forecast";
    const responses = await fetchWeatherApi(url, params);
    const response = responses[0];

    const current = response.current();
    return {
      temperature2m: current.variables(0).value().toFixed(2),
      relativeHumidity2m: current.variables(1).value(),
      isDay: current.variables(2).value(),
      discription: weatherDescriptions[current.variables(3).value()],
      windSpeed10m: current.variables(4).value().toFixed(2),
    };
  } catch (error) {
    console.error("Error fetching weather data:", error);
    return null;
  }
};
