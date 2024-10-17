import React, { useState } from 'react';
import axios from 'axios';
import './RuleEngine.css'; // Import the CSS file

const RuleEngine = () => {
  const [rule, setRule] = useState('');
  const [data, setData] = useState('');
  const [astId, setAstId] = useState('');
  const [result, setResult] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  // Function to create a rule
  const handleCreateRule = async () => {
    if (!rule.trim()) {
      alert('Please enter a valid rule.');
      return;
    }

    try {
      const response = await axios.post('http://localhost:5000/api/rules/create', { ruleString: rule });
      setAstId(response.data.ast._id); // Store AST ID for evaluation
      alert('Rule created successfully! AST ID: ' + response.data.ast._id);
      setErrorMessage(''); // Clear any previous error messages
    } catch (error) {
      console.error('Error creating rule:', error);
      setErrorMessage(error.response ? error.response.data.error : 'An unknown error occurred.');
    }
  };

  // Function to evaluate a rule against data
  const handleEvaluateRule = async () => {
    if (!data.trim()) {
      alert('Please enter valid data.');
      return;
    }

    try {
      const parsedData = JSON.parse(data); // Parse user input into JSON
      const response = await axios.post('http://localhost:5000/api/rules/evaluate', {
        astId: astId,
        data: parsedData,
      });
      setResult(response.data.result ? 'Eligible' : 'Not Eligible');
      setErrorMessage(''); // Clear any previous error messages
    } catch (error) {
      console.error('Error evaluating rule:', error);
      setResult(null); // Reset result
      setErrorMessage(error.response ? error.response.data.error : 'An unknown error occurred.');
    }
  };

  return (
    <div className="RuleEngine">
      <h3>Create and Evaluate Rules</h3>

      {/* Rule Input */}
      <input
        type="text"
        placeholder="Enter Rule (e.g., age > 30 AND department = 'Sales')"
        value={rule}
        onChange={(e) => setRule(e.target.value)}
      />
      <button onClick={handleCreateRule}>Create Rule</button>

      <br /><br />

      {/* Data Input */}
      <input
        type="text"
        placeholder='Enter Data (e.g., {"age": 35, "department": "Sales"})'
        value={data}
        onChange={(e) => setData(e.target.value)}
      />
      <button onClick={handleEvaluateRule}>Evaluate Rule</button>

      {/* Display Result */}
      {result && <p>Result: {result}</p>}
      {errorMessage && <p className="error-message">Error: {errorMessage}</p>} {/* Error message display */}
    </div>
  );
};

export default RuleEngine;
