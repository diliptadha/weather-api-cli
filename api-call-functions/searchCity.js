export const searchCity = async (city) => {
  const response = await fetch(
    `https://geocoding-api.open-meteo.com/v1/search?name=${city}&count=5&language=en&format=json`
  );
  const { results } = await response.json();

  const data = results?.map((result) => ({
    name: `${result.name}, ${result.admin1}, ${result.country}`,
    value: {
      latitude: result.latitude,
      longitude: result.longitude,
      timezone: result.timezone,
      name: result.name,
    },
  }));

  return data;
};
