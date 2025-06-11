const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
require('dotenv').config(); // Para variables de entorno

const app = express();

// Middlewares
app.use(cors());
app.use(bodyParser.json());

// Conexión a MongoDB
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/mi_base_datos', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Definir el esquema y modelo de Item
const itemSchema = new mongoose.Schema({
  nombre: String,
  descripcion: String,
  precio: Number,
});

const Item = mongoose.model('Item', itemSchema);

// Endpoints

// Obtener todos los items
app.get('/items', async (req, res) => {
  try {
    const items = await Item.find();
    res.json(items);
  } catch (error) {
    console.error('Error al obtener items:', error);
    res.status(500).json({ error: 'Error al obtener los datos' });
  }
});

// Crear nuevo item
app.post('/items', async (req, res) => {
  try {
    const { nombre, descripcion, precio } = req.body;
    const newItem = new Item({ nombre, descripcion, precio });
    await newItem.save();
    res.status(201).json(newItem);
  } catch (error) {
    console.error('Error al crear item:', error);
    res.status(500).json({ error: 'Error al crear el item' });
  }
});

// Actualizar item
app.put('/items/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const updatedItem = await Item.findByIdAndUpdate(id, req.body, { new: true });
    if (!updatedItem) {
      return res.status(404).json({ message: 'Item no encontrado' });
    }
    res.json({ message: 'Item actualizado', item: updatedItem });
  } catch (error) {
    console.error('Error al actualizar item:', error);
    res.status(500).json({ error: 'Error al actualizar el item' });
  }
});

// Eliminar item
app.delete('/items/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const deletedItem = await Item.findByIdAndDelete(id);
    if (!deletedItem) {
      return res.status(404).json({ message: 'Item no encontrado' });
    }
    res.json({ message: 'Item eliminado' });
  } catch (error) {
    console.error('Error al eliminar item:', error);
    res.status(500).json({ error: 'Error al eliminar el item' });
  }
});

// Iniciar servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});