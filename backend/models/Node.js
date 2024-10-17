const mongoose = require('mongoose');

const NodeSchema = new mongoose.Schema({
  type: { type: String, required: true },
  value: String,
  left: { type: mongoose.Schema.Types.ObjectId, ref: 'Node' },
  right: { type: mongoose.Schema.Types.ObjectId, ref: 'Node' },
});

const NodeModel = mongoose.model('Node', NodeSchema);
module.exports = NodeModel;
