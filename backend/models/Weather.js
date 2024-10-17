const mongoose = require('mongoose');

// Define the Weather schema
const WeatherSchema = new mongoose.Schema({
  city: String,
  temp: Number,
  feels_like: Number,
  main: String,
  timestamp: { type: Date, default: Date.now },
});

const Weather = mongoose.model('Weather', WeatherSchema);
module.exports = Weather;
