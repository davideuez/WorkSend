const mongoose = require('mongoose');

const deliverySchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  url: {
    type: String,
    required: true
  },
  assignmentId: {
    type: String,
    required: true
  }
});

module.exports = mongoose.model('delivery', deliverySchema);