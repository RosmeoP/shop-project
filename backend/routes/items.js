const express = require('express');
const multer = require('multer');
const streamifier = require('streamifier');
const cloudinary = require('../cloudinary');
const Item = require('../models/item');
const router = express.Router();
const upload = multer();

router.get('/', async (req, res) => {
  try {
    const items = await Item.find();
    res.json(items);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener los datos' });
  }
});

router.post('/', upload.single('img'), async (req, res) => {
  try {
    const { nombre, descripcion, precio } = req.body;

    if (!nombre || !descripcion || !precio) {
      return res.status(400).json({ error: 'Faltan campos requeridos' });
    }

    let imgUrl = null;

    if (req.file && req.file.buffer) {
      const streamUpload = (buffer) => {
        return new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            { folder: 'store-products' },
            (error, result) => {
              if (error) reject(error);
              else resolve(result);
            }
          );
          streamifier.createReadStream(buffer).pipe(stream);
        });
      };

      const uploadResult = await streamUpload(req.file.buffer);
      imgUrl = uploadResult.secure_url;
    }

    const parsedPrecio = parseFloat(precio);
    if (isNaN(parsedPrecio)) {
      return res.status(400).json({ error: 'Precio no válido' });
    }

    const newItem = new Item({
      nombre,
      descripcion,
      precio: parsedPrecio,
      img: imgUrl
    });

    await newItem.save();

    res.status(201).json(newItem);
  } catch (error) {
    res.status(500).json({
      error: 'Error al crear el item',
      message: error.message,
      stack: error.stack
    });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const updatedItem = await Item.findByIdAndUpdate(id, req.body, { new: true });
    if (!updatedItem) {
      return res.status(404).json({ message: 'Item no encontrado' });
    }
    res.json({ message: 'Item actualizado', item: updatedItem });
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar el item' });
  }
});

// ...existing code...

// Actualizar un item existente
router.put('/:id', async (req, res) => {
  try {
    const { nombre, descripcion, precio } = req.body;
    const parsedPrecio = parseFloat(precio);

    if (!nombre || !descripcion || isNaN(parsedPrecio)) {
      return res.status(400).json({ error: 'Datos inválidos para actualizar' });
    }

    const updatedItem = await Item.findByIdAndUpdate(
      req.params.id,
      { nombre, descripcion, precio: parsedPrecio },
      { new: true }
    );

    if (!updatedItem) {
      return res.status(404).json({ error: 'Item no encontrado' });
    }

    res.json(updatedItem);
  } catch (error) {
    console.error('💥 Error en /api/items PUT:', error);
    res.status(500).json({
      error: 'Error al actualizar el item',
      message: error.message,
      stack: error.stack
    });
  }
});


router.delete('/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const deletedItem = await Item.findByIdAndDelete(id);
    if (!deletedItem) {
      return res.status(404).json({ message: 'Item no encontrado' });
    }
    res.json({ message: 'Item eliminado' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar el item' });
  }
});

module.exports = router;