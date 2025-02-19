#!/usr/bin/env node

import { input, select, Separator } from "@inquirer/prompts";
import { searchCity } from "./api-call-functions/searchCity.js";
import { searchWeather } from "./api-call-functions/searchWeather.js";

const displayWeather = (weather) => {
  console.log("----------------------------------------");
  console.log("Weather Details for", weather.name);
  console.log("----------------------------------------");
  console.log(`Temperature: ${weather.temperature2m}°C`);
  console.log(`Humidity: ${weather.relativeHumidity2m}%`);
  console.log(`Wind: ${weather.windSpeed10m} km/h`);
  console.log(`Condition: ${weather.discription}`);
  console.log("----------------------------------------");
};

const weatherSearch = async () => {
  try {
    const searchQuery = await input({
      message: "Enter city name or postal code:",
      validate: (input) => {
        if (input.length < 2) return "Please enter at least 2 characters";
        return true;
      },
    });

    const locations = await searchCity(searchQuery);

    if (!locations || locations.length === 0) {
      console.log("No locations found matching your search.");
      return;
    }

    const { latitude, longitude, name, timezone } = await select({
      message: "Select a location:",
      choices: locations,
    });

    const weather = await searchWeather(latitude, longitude);

    displayWeather({ ...weather, name, timezone });
  } catch (error) {
    if (error.name === "ExitPromptError") {
      console.log("Goodbye! Have a nice day!");
    } else {
      console.error("Error:", error);
    }
  }
};

async function mainMenu() {
  const choices = [
    { value: "search", label: "1. Search Weather" },
    { value: "exit", label: "2. Exit" },
  ];

  const action = await select({
    message: "What would you like to do?",
    choices,
  });

  return action;
}

async function main() {
  console.log("welcome to weather CLI!\n");

  let action = "search";

  while (action !== "exit") {
    if (action === "search") {
      action = await weatherSearch();
    } else {
      action = await mainMenu();
    }
  }

  console.log("thank you for using weather CLI. goodbye! 👋");
}

main();
