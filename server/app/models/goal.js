const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const goalSchema = new mongoose.Schema({
    userId: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    targetAmount: {
      type: Number,
      required: true,
    },
    currentAmount: {
      type: Number,
      required: true,
    },
    deadline: {
      type: Date,
      required: true,
    },
  }, {timestamps: true});

module.exports = mongoose.model('Goal', goalSchema);