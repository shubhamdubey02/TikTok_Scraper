const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: String,
  price: String,
  seller: String,
  url: String,
  thumbnail: String,
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);
