const mongoose = require('mongoose');

const classSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  keyword: {
    type: Number,
    required: true
  }
});

module.exports = mongoose.model('Class', classSchema);