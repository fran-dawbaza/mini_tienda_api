CREATE DATABASE IF NOT EXISTS shop_db;
USE shop_db;

CREATE TABLE usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario VARCHAR(50) UNIQUE NOT NULL,
    clave VARCHAR(255) NOT NULL,
    rol ENUM('user', 'admin') DEFAULT 'user'
);

CREATE TABLE productos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    precio DECIMAL(10,2) NOT NULL
);

CREATE TABLE pedidos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT NOT NULL,
    total DECIMAL(10,2) NOT NULL,
    fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    items_json TEXT NOT NULL
);

-- Usuarios con clave "1234" en MD5
INSERT INTO usuarios (usuario, clave, rol) VALUES 
('cliente', MD5('1234'), 'user'),
('admin', MD5('1234'), 'admin');

INSERT INTO productos (nombre, precio) VALUES 
('Teclado Mecánico', 45.00), ('Ratón Gaming', 25.50), ('Monitor 24"', 120.00), ('Auriculares', 30.00);