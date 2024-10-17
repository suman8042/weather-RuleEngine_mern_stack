import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './WeatherMonitoring.css'; // Import the CSS file

const WeatherMonitoring = () => {
  const [dailySummary, setDailySummary] = useState([]);

  useEffect(() => {
    const fetchDailySummary = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/weather/daily-summary');
        setDailySummary(response.data);
      } catch (error) {
        console.error('Error fetching daily summary:', error);
      }
    };

    fetchDailySummary();
  }, []);

  return (
    <div className="WeatherMonitoring">
      <h3>Daily Weather Summary</h3>
      <ul>
        {dailySummary.map((summary, index) => (
          <li key={index}>
            <strong>{summary._id.city}</strong> ({summary._id.date}): 
            <span className="data-point">Avg Temp: {summary.avg_temp.toFixed(2)}°C</span>
            <span className="data-point">Max Temp: {summary.max_temp.toFixed(2)}°C</span>
            <span className="data-point">Min Temp: {summary.min_temp.toFixed(2)}°C</span>
            <span className="data-point">Dominant Condition: {summary.dominant_condition}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default WeatherMonitoring;
