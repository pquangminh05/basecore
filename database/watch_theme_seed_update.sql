USE basecoresales;

-- Categories for watch store
REPLACE INTO categories (Id, Name, Description) VALUES
(1, 'Luxury Watches', 'High-end luxury watch models'),
(2, 'Sport Watches', 'Chronograph and sport collections'),
(3, 'Smart Watches', 'Connected smart watch models'),
(4, 'Classic Watches', 'Dress and minimalist watches'),
(5, 'Watch Accessories', 'Straps, boxes, and care tools');

-- Product types for watches
REPLACE INTO producttypes (Id, Name, Description) VALUES
(1, 'Automatic', 'Mechanical automatic movement watches'),
(2, 'Quartz', 'Quartz movement watches'),
(3, 'Smartwatch', 'Smart connected watch models');

-- Brands (manufacturers)
REPLACE INTO manufacturers (Id, Name, Description) VALUES
(1, 'Rolex', 'Swiss luxury watch brand'),
(2, 'Omega', 'Swiss premium watchmaker'),
(3, 'Seiko', 'Japanese watch manufacturer');

-- Master data colors and sizes
REPLACE INTO productcolors (Id, Name) VALUES
(1, 'Black'),
(2, 'Silver'),
(3, 'Blue');

REPLACE INTO productsizes (Id, Name) VALUES
(1, '38mm'),
(2, '40mm'),
(3, '42mm');

-- Sample products
REPLACE INTO products (Id, Name, Price, Stock, ImageUrl, Description, CategoryId, ProductTypeId, ManufacturerId, ColorId, SizeId) VALUES
(1, 'Rolex Submariner Date', 285000000, 6, '', 'Iconic dive watch with automatic movement', 1, 1, 1, 1, 3),
(2, 'Omega Speedmaster Moonwatch', 198000000, 8, '', 'Legendary chronograph with classic design', 2, 2, 2, 2, 2),
(3, 'Seiko 5 Sports GMT', 12500000, 18, '', 'Daily sport watch with GMT function', 2, 1, 3, 1, 2),
(4, 'Apple Watch Series 10', 12990000, 20, '', 'Smartwatch with health and fitness tracking', 3, 3, 2, 3, 1),
(5, 'Leather Watch Strap 20mm', 890000, 40, '', 'Premium genuine leather replacement strap', 5, 3, 3, 2, 1);
