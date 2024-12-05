const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const incomeSchema = new mongoose.Schema({
    userId: {
      type: String,
      required: true,
    },
    value: {
      type: Number,
      required: true,
    },
    type: {
      type: String,
      required: true,
    },
    date: {
      type: String,
      required: true,
    },
  }, {timestamps: true});

module.exports = mongoose.model('Income', incomeSchema);