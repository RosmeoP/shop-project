const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
  nombre: String,
  descripcion: String,
  precio: Number,
  img: String,
});

module.exports = mongoose.model('Item', itemSchema);