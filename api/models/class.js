const mongoose = require('mongoose');

const classSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  name: {
    type: String,
    required: true,
    unique: true
  },
  description: {
    type: String,
    required: true
  },
  keyword: {
    type: Number,
    required: true,
    unique: true
  }
});

module.exports = mongoose.model('Class', classSchema);