-- Step 1: Create Database
CREATE DATABASE IF NOT EXISTS party_gift_shop;
USE party_gift_shop;

-- Step 2: Create Categories Table
CREATE TABLE IF NOT EXISTS Categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL UNIQUE
);

-- Step 3: Create Products Table
CREATE TABLE IF NOT EXISTS Products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    image_url VARCHAR(500) NOT NULL,
    delivery_time VARCHAR(255) DEFAULT 'Delivery in 2-4 hours',
    categoryId INT,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (categoryId) REFERENCES Categories(id) ON DELETE SET NULL
);

-- Step 4: Insert Data into Categories
INSERT INTO Categories (id, name, slug) VALUES 
(1, 'Chocolate Bouquets', 'chocolate-bouquets'),
(2, 'Birthday Decorations', 'birthday-decorations'),
(3, 'Perfumes', 'perfumes'),
(4, 'Cakes', 'cakes'),
(5, 'Gift Sets', 'gift-sets'),
(6, 'Hampers', 'hampers'),
(7, 'Plants', 'plants')
ON DUPLICATE KEY UPDATE name=VALUES(name);

-- Step 5: Insert Data into Products
INSERT INTO Products (name, price, image_url, categoryId) VALUES 
-- Chocolate Bouquets (CategoryId 1)
('Premium Ferrero Rocher Bouquet', 1299.00, 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=500&q=80', 1),
('Dairy Milk Silk Delight Tower', 899.00, 'https://images.unsplash.com/photo-1511381939415-e44015466834?w=500&q=80', 1),
('Romantic Lindt Hearts Bouquet', 1599.00, 'https://images.unsplash.com/photo-1481391319762-47dff72954d9?w=500&q=80', 1),
('Assorted Mixed Chocolate Basket', 1100.00, 'https://images.unsplash.com/photo-1548843232-68c16053f3e2?w=500&q=80', 1),
('Gourmet Dark Choco Arrangement', 999.00, 'https://images.unsplash.com/photo-1621303107050-ca92548858ec?w=500&q=80', 1),

-- Birthday Decorations (CategoryId 2)
('Pastel Balloon Arch Setup', 3499.00, 'https://images.unsplash.com/photo-1530103862676-de8892795bf0?w=500&q=80', 2),
('Neon "Happy Birthday" Light', 1899.00, 'https://images.unsplash.com/photo-1527529482837-4698179dc6ce?w=500&q=80', 2),
('Gold Foil Confetti Set (50 pcs)', 450.00, 'https://images.unsplash.com/photo-1543888544-2451ab04fb92?w=500&q=80', 2),
('Premium Kids Theme Decor', 4999.00, 'https://images.unsplash.com/photo-1502631155828-9ba53ecacdf7?w=500&q=80', 2),
('Fairy Lights Backdrop', 1299.00, 'https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?w=500&q=80', 2),

-- Perfumes (CategoryId 3)
('Chanel No.5 Perfume', 8999.00, 'https://images.unsplash.com/photo-1594035910387-fea47794261f?w=500&q=80', 3),
('Dior Sauvage For Him', 9500.00, 'https://images.unsplash.com/photo-1523293115678-efa301980be1?w=500&q=80', 3),
('Versace Eros Eau de Toilette', 7200.00, 'https://images.unsplash.com/photo-1593487568720-92097fb460fb?w=500&q=80', 3),
('Gucci Bloom Floral Scent', 8100.00, 'https://images.unsplash.com/photo-1587517904392-49bd651ff206?w=500&q=80', 3),
('Tom Ford Oud Wood', 12500.00, 'https://images.unsplash.com/photo-1615486511484-91acc31aede3?w=500&q=80', 3),

-- Cakes (CategoryId 4)
('Red Velvet Anniversary Cake', 1199.00, 'https://images.unsplash.com/photo-1614707267537-b85aaf00c4b7?w=500&q=80', 4),
('Dark Chocolate Truffle Cake', 899.00, 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=500&q=80', 4),
('Fresh Fruits Rainbow Cake', 1299.00, 'https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=500&q=80', 4),
('Vanilla Buttercream Floral Cake', 950.00, 'https://images.unsplash.com/photo-1557308536-ee471ef2c390?w=500&q=80', 4),
('Bento Mini Celebration Cake', 450.00, 'https://images.unsplash.com/photo-1606890737305-6afbd8fa225d?w=500&q=80', 4),

-- Gift Sets (CategoryId 5)
('Luxury Grooming Gift Set', 1499.00, 'https://images.unsplash.com/photo-1607344645866-009c320b63e0?w=500&q=80', 5),
('Elegant Watch & Wallet Combo', 2100.00, 'https://images.unsplash.com/photo-1549463051-419b5bfb7050?w=500&q=80', 5),
('Scented Candles & Spa Gift Set', 1250.00, 'https://images.unsplash.com/photo-1608528577891-eb055bfecafa?w=500&q=80', 5),
('Personalized Leather Diary Set', 899.00, 'https://images.unsplash.com/photo-1544816155-12df9643f363?w=500&q=80', 5),
('Premium Tea & Mug Selection', 1150.00, 'https://images.unsplash.com/photo-1576208571060-cdbc9c90ae1b?w=500&q=80', 5),

-- Hampers (CategoryId 6)
('Assorted Festive Hamper', 2499.00, 'https://images.unsplash.com/photo-1513885055283-bcdd793ac282?w=500&q=80', 6),
('Dry Fruits Royal Basket', 1899.00, 'https://images.unsplash.com/photo-1596647363435-09d57a4a9829?w=500&q=80', 6),
('Snack & Cravings Mega Box', 1450.00, 'https://images.unsplash.com/photo-1621939514649-280e2ee25f60?w=500&q=80', 6),
('Organic Self-Care Hamper', 2100.00, 'https://images.unsplash.com/photo-1583209814683-c023dd293cc6?w=500&q=80', 6),
('Cheese & Wine Date Hamper', 3500.00, 'https://images.unsplash.com/photo-1505935428862-770b6f24f629?w=500&q=80', 6),

-- Plants (CategoryId 7)
('Indoor Snake Plant', 699.00, 'https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=500&q=80', 7),
('Lucky Bamboo Glass Vase', 450.00, 'https://images.unsplash.com/photo-1563241527-3004b7be0ffd?w=500&q=80', 7),
('Peace Lily For Desk', 550.00, 'https://images.unsplash.com/photo-1593696954577-ab3d39317b97?w=500&q=80', 7),
('Money Plant with Ceramic Pot', 399.00, 'https://images.unsplash.com/photo-1614594975525-e45190c55d0b?w=500&q=80', 7),
('Ficus Bonsai Tree', 1299.00, 'https://images.unsplash.com/photo-1599598425947-3300262b71ab?w=500&q=80', 7);
