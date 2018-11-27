const mongoose = require('mongoose');

const userClassSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  classId: {
    type: String,
    required: true
  },
  user_email: {
    type: String,
    required: true,
    lowercase: true
  },
  role: {
    type: String,
    required: true
  }
});

module.exports = mongoose.model('userClass', userClassSchema);