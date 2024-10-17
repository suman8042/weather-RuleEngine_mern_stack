require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const weatherRoutes = require('./routes/weatherRoutes'); // Import your weather routes
const ruleEngineRoutes = require('./routes/ruleEngineRoutes'); // Import your rule engine routes

// Initialize the app
const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('MongoDB connected');
})
.catch(err => {
  console.error('MongoDB connection error:', err);
  process.exit(1); // Exit the process if unable to connect to MongoDB
});

// Routes
app.use('/api/weather', weatherRoutes); // Weather routes
app.use('/api/rules', ruleEngineRoutes); // Rule engine routes

// Fallback for unhandled routes
app.use((req, res, next) => {
  res.status(404).json({ error: 'Not Found' });
});
app.use('/api/rules', ruleEngineRoutes);

// Global error handler
app.use('/api/weather', weatherRoutes);


// Server Port
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
