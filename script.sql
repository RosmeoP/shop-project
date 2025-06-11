-- Crear la base de datos si no existe
CREATE DATABASE IF NOT EXISTS itemsDB;

-- Usar la base de datos
USE itemsDB;

-- Crear tabla de items
CREATE TABLE IF NOT EXISTS items (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(255) NOT NULL,
  descripcion TEXT,
  precio DECIMAL(10, 2),
  creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Puedes agregar algunos datos de ejemplo
INSERT INTO items (nombre, descripcion, precio) VALUES
  ('Item 1', 'Descripción del item 1', 19.99),
  ('Item 2', 'Descripción del item 2', 29.99),
  ('Item 3', 'Descripción del item 3', 39.99);