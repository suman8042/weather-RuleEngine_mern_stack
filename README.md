### Weather Monitoring and Rule Engine Application
### Overview
This application combines a Weather Monitoring system that fetches daily weather data and a Rule Engine that allows users to create and evaluate custom rules based on various attributes such as age and color. The project is built using the MERN stack (MongoDB, Express, React, Node.js).
### Features
•	Weather Monitoring: Displays daily weather summaries, including average, maximum, and minimum temperatures, along with dominant weather conditions.
•	Rule Engine: Users can create and evaluate rules dynamically, utilizing an Abstract Syntax Tree (AST) for logical evaluations.
•	Responsive Design: The application is designed to be responsive, ensuring usability across devices.
### Design Choices
•	Architecture: The application is structured as a three-tier system:
o	Frontend: Built using React for a dynamic user interface.
o	Backend: Node.js and Express are used to handle API requests and serve data.
o	Database: MongoDB is used for storing weather data and rule definitions.
•	Data Flow: Weather data is fetched from an external weather API and stored in the database, while the rule engine allows dynamic rule creation and evaluation.
•	Security and Performance: Basic security measures like CORS and input validation are implemented. Performance is optimized by efficient data retrieval and caching strategies.
### Dependencies
The following dependencies are required for running the application:
### Backend
•	Node.js: JavaScript runtime for server-side development.
•	Express: Web framework for building APIs.
•	Mongoose: ODM library for MongoDB.
•	Cors: Middleware to enable Cross-Origin Resource Sharing.
•	Body-Parser: Middleware to parse incoming request bodies.
•	Dotenv: Module to load environment variables from a .env file.
### Frontend
•	React: JavaScript library for building user interfaces.
•	Axios: Promise-based HTTP client for making requests.
### Installation and Setup
Prerequisites
•	Node.js (v14 or later)
•	MongoDB (or a MongoDB Atlas account)
1. Clone the Repository
git clone https://github.com/yourusername/repository-name.git
cd repository-name

### Set Up the Backend
cd backend
npm install
node server.js

### Set Up the Frontend
cd frontend
npm install
npm start

