const NodeModel = require('../models/Node');

// Helper function to create AST from rule string
const createAST = (ruleString) => {
  const tokens = ruleString.match(/([a-zA-Z0-9_]+)\s*([<>!=]=?)\s*(['"]?[^'"]+['"]?)/g); // Regex to extract valid tokens
  if (!tokens) return null; // Handle invalid rule strings

  let currentNode = null;

  tokens.forEach((token) => {
    const [attribute, operator, value] = token.split(/\s+/);
    const newNode = { type: 'operand', value: `${attribute} ${operator} ${value}` };

    if (!currentNode) {
      currentNode = newNode; // First node in the AST
    } else {
      const operatorNode = { type: 'operator', value: 'AND', left: currentNode, right: newNode }; // Combine with AND operator
      currentNode = operatorNode;
    }
  });

  return currentNode; // Return the root node of the AST
};

// Save AST to MongoDB
const saveASTToDB = async (ast) => {
  try {
    let leftNode = null, rightNode = null;

    if (ast.left) {
      leftNode = new NodeModel(ast.left);
      await leftNode.save();
    }

    if (ast.right) {
      rightNode = new NodeModel(ast.right);
      await rightNode.save();
    }

    const rootNode = new NodeModel({
      type: ast.type,
      left: leftNode ? leftNode._id : null,
      right: rightNode ? rightNode._id : null,
      value: ast.value,
    });

    await rootNode.save();
    return rootNode;
  } catch (error) {
    console.error("Error saving AST to MongoDB:", error.message);
    throw new Error('Failed to save AST to the database.');
  }
};

// Create a rule (AST)
const createRule = async (req, res) => {
  const { ruleString } = req.body;
  try {
    const ast = createAST(ruleString);
    if (!ast) throw new Error('Invalid rule syntax'); // Handle invalid rules

    const savedAST = await saveASTToDB(ast);
    res.json({ ast: savedAST });
  } catch (error) {
    console.error("Error creating rule:", error.message);
    res.status(400).json({ error: error.message });
  }
};

// Helper function to evaluate AST against data
const evaluateAST = (node, data) => {
  if (node.type === 'operand') {
    const [attribute, operator, value] = node.value.split(' ');

    const dataValue = data[attribute]; // Get the value from the input data

    // Handle numeric comparisons
    if (!isNaN(dataValue)) {
      const numericValue = parseFloat(value.replace(/['"]/g, '')); // Convert the value to a number
      switch (operator) {
        case '>':
          return parseFloat(dataValue) > numericValue;
        case '<':
          return parseFloat(dataValue) < numericValue;
        case '>=':
          return parseFloat(dataValue) >= numericValue;
        case '<=':
          return parseFloat(dataValue) <= numericValue;
        default:
          return false;
      }
    } else {
      // Handle string comparisons
      const stringValue = value.replace(/['"]/g, ''); // Remove quotes for string comparison
      switch (operator) {
        case '=':
          return dataValue === stringValue;
        case '!=':
          return dataValue !== stringValue;
        default:
          return false;
      }
    }
  } else if (node.type === 'operator') {
    const leftResult = evaluateAST(node.left, data);
    const rightResult = evaluateAST(node.right, data);
    return node.value === 'AND' ? leftResult && rightResult : leftResult || rightResult;
  }
  return false;
};

// Evaluate rule
const evaluateRule = async (req, res) => {
  const { astId, data } = req.body;
  try {
    const ast = await NodeModel.findById(astId).populate('left right');
    if (!ast) throw new Error('AST not found');

    const result = evaluateAST(ast, data);
    res.json({ result });
  } catch (error) {
    console.error("Error evaluating rule:", error.message);
    res.status(400).json({ error: error.message });
  }
};

// Combine multiple ASTs
const combineASTs = (ast1, ast2) => {
  return {
    type: 'operator',
    left: ast1,
    right: ast2,
    value: 'AND', // Combining logic using AND
  };
};

// Combine multiple rules into a single AST
const combineRules = async (req, res) => {
  const { astIds } = req.body;
  try {
    const ast1 = await NodeModel.findById(astIds[0]).populate('left right');
    const ast2 = await NodeModel.findById(astIds[1]).populate('left right');
    if (!ast1 || !ast2) throw new Error('One or both ASTs not found');

    const combinedAST = combineASTs(ast1, ast2);
    const savedAST = await saveASTToDB(combinedAST);

    res.json({ combinedAST: savedAST });
  } catch (error) {
    console.error("Error combining rules:", error.message);
    res.status(400).json({ error: error.message });
  }
};

module.exports = { createRule, evaluateRule, combineRules };
