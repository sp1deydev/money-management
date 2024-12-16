const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const expenseSchema = new mongoose.Schema({
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
    note: {
      type: String,
    },
    date: {
      type: String,
      required: true,
    },
  }, {timestamps: true});

module.exports = mongoose.model('Expense', expenseSchema);