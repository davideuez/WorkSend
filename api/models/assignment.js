const mongoose = require('mongoose');

const assignmentSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  deadline: {
    type: Date,
    required: true
  },
  url: {
    type: String,
    required: true
  }
});

module.exports = mongoose.model('assignment', assignmentSchema);