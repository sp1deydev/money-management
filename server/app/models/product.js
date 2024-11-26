const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const productSchema = new Schema({
      name: {
        type: String,
        required: true
      },
      price: {
        type: Number,
        required: true
      },
      quantity:{
        type: Number,
        default: 0
      },
      description: {
        type: String,
        required: true
      },
      image: {
        type: String,
        required: true
      },
}, {timestamps: true})

module.exports = mongoose.model('Product', productSchema);
