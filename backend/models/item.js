const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
  nombre: String,
  descripcion: String,
  precio: Number,
  img: String,
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Add this line
});

module.exports = mongoose.model('Item', itemSchema);