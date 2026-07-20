-- RetailFlow AI MySQL schema and demo data.
CREATE DATABASE IF NOT EXISTS retailflow_ai;
USE retailflow_ai;

CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(120) NOT NULL,
    email VARCHAR(120) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL DEFAULT 'staff',
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    product_name VARCHAR(150) NOT NULL,
    category VARCHAR(100) NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    supplier VARCHAR(150),
    barcode VARCHAR(100) NOT NULL UNIQUE,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS inventory (
    id INT AUTO_INCREMENT PRIMARY KEY,
    product_id INT NOT NULL UNIQUE,
    quantity INT NOT NULL DEFAULT 0,
    reorder_level INT NOT NULL DEFAULT 0,
    warehouse_location VARCHAR(150) NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'In Stock',
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_inventory_product FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS sales (
    id INT AUTO_INCREMENT PRIMARY KEY,
    product_id INT NOT NULL,
    quantity INT NOT NULL,
    total_amount DECIMAL(10,2) NOT NULL,
    customer_name VARCHAR(150),
    payment_method VARCHAR(50),
    sale_date DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_sales_product FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS predictions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    product_id INT NOT NULL,
    predicted_demand INT NOT NULL,
    recommendation VARCHAR(255) NOT NULL,
    confidence_score FLOAT NOT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_predictions_product FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

INSERT INTO users (name, email, password_hash, role) VALUES
('Retail Admin', 'admin@retailflow.ai', 'pbkdf2:sha256:600000$demo$demo', 'admin');

INSERT INTO products (product_name, category, description, price, supplier, barcode) VALUES
('Premium Headphones', 'Electronics', 'Noise-cancelling over-ear headphones.', 129.99, 'SoundWave Inc.', 'RF-1001'),
('Office Chair', 'Furniture', 'Ergonomic chair with lumbar support.', 249.00, 'ComfortWorks', 'RF-1002'),
('Smart Speaker', 'Electronics', 'Voice-enabled smart speaker for home and retail use.', 89.50, 'NextGen Audio', 'RF-1003'),
('Travel Backpack', 'Accessories', 'Water-resistant backpack with laptop compartment.', 59.00, 'UrbanCarry', 'RF-1004'),
('Desk Lamp', 'Home', 'LED desk lamp with adjustable brightness.', 39.00, 'BrightLine', 'RF-1005');

INSERT INTO inventory (product_id, quantity, reorder_level, warehouse_location, status) VALUES
(1, 74, 40, 'North Hub', 'In Stock'),
(2, 21, 25, 'West Hub', 'Low Stock'),
(3, 46, 30, 'South Hub', 'In Stock'),
(4, 18, 24, 'East Hub', 'Low Stock'),
(5, 62, 35, 'Central Hub', 'In Stock');

INSERT INTO sales (product_id, quantity, total_amount, customer_name, payment_method, sale_date) VALUES
(1, 8, 1039.92, 'Ava Martinez', 'Card', NOW()),
(3, 10, 895.00, 'Noah Lee', 'UPI', NOW()),
(5, 12, 468.00, 'Olivia Chen', 'Cash', NOW());

INSERT INTO predictions (product_id, predicted_demand, recommendation, confidence_score) VALUES
(1, 92, 'Order 28 units within 5 days', 0.94),
(4, 44, 'Raise stock by 18 units', 0.89);