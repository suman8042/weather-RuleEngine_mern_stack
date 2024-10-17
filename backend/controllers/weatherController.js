const axios = require('axios');
const Weather = require('../models/Weather');
const cron = require('node-cron');
const API_KEY = process.env.API_KEY;
const CITIES = ["Delhi", "Mumbai", "Chennai", "Bangalore", "Kolkata", "Hyderabad"];

// Function to fetch weather data from OpenWeatherMap API
const fetchWeather = async (city) => {
  try {
    const response = await axios.get(`http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}`);
    const { main, dt } = response.data;
    return {
      city,
      temp: main.temp - 273.15, // Convert from Kelvin to Celsius
      feels_like: main.feels_like - 273.15,
      main: response.data.weather[0].main, // Main weather condition (Rain, Snow, Clear, etc.)
      timestamp: new Date(dt * 1000), // Convert Unix timestamp to Date
    };
  } catch (error) {
    console.error(`Error fetching weather data for ${city}:`, error);
    return null;
  }
};

// Function to store weather data in MongoDB
const storeWeatherData = async (weatherData) => {
  const weather = new Weather(weatherData);
  await weather.save();
};

// Fetch weather data for all cities
const fetchWeatherData = async () => {
  for (const city of CITIES) {
    const weatherData = await fetchWeather(city);
    if (weatherData) {
      await storeWeatherData(weatherData);
    }
  }
};

// Get daily weather summary
const getDailySummary = async (req, res) => {
  try {
    const summaries = await Weather.aggregate([
      {
        $group: {
          _id: {
            city: "$city",
            date: { $dateToString: { format: "%Y-%m-%d", date: "$timestamp" } },
          },
          avg_temp: { $avg: "$temp" },
          max_temp: { $max: "$temp" },
          min_temp: { $min: "$temp" },
          dominant_condition: { $first: "$main" }, // Get the first occurrence of main condition
        },
      },
    ]);
    res.json(summaries);
  } catch (error) {
    console.error('Error fetching daily summary:', error);
    res.status(500).json({ message: 'Error fetching daily summary' });
  }
};

// Set up a cron job to fetch weather data every 5 minutes
cron.schedule('*/5 * * * *', async () => {
  console.log('Fetching weather data...');
  await fetchWeatherData();
});

module.exports = { getDailySummary };
