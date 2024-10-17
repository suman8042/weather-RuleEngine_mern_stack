import React from 'react';
import WeatherMonitoring from './components/WeatherMonitoring';
import RuleEngine from './components/RuleEngine';
import './App.css'; // Import the CSS file for styles

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Weather Monitoring and Rule Engine</h1>
      </header>

      <div className="container">
        {/* Weather Monitoring Component */}
        <section className="card">
          <h2>Weather Monitoring</h2>
          <WeatherMonitoring />
        </section>

        {/* Rule Engine Component */}
        <section className="card">
          <h2>Rule Engine</h2>
          <RuleEngine />
        </section>
      </div>
    </div>
  );
}

export default App;
