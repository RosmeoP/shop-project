const mongoose = require('mongoose');

const ItemSchema = new mongoose.Schema({
  nombre: String,
  descripcion: String,
  precio: Number,
  img: String,
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
});

module.exports = mongoose.model('Item', ItemSchema);