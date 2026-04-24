USE basecoresales;

CREATE TABLE IF NOT EXISTS producttypes (
  Id INT NOT NULL AUTO_INCREMENT,
  Name VARCHAR(100) NOT NULL,
  Description VARCHAR(500) NOT NULL DEFAULT '',
  PRIMARY KEY (Id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS manufacturers (
  Id INT NOT NULL AUTO_INCREMENT,
  Name VARCHAR(100) NOT NULL,
  Description VARCHAR(500) NOT NULL DEFAULT '',
  PRIMARY KEY (Id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS productcolors (
  Id INT NOT NULL AUTO_INCREMENT,
  Name VARCHAR(50) NOT NULL,
  PRIMARY KEY (Id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS productsizes (
  Id INT NOT NULL AUTO_INCREMENT,
  Name VARCHAR(50) NOT NULL,
  PRIMARY KEY (Id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

ALTER TABLE products
  ADD COLUMN IF NOT EXISTS ProductTypeId INT NULL,
  ADD COLUMN IF NOT EXISTS ManufacturerId INT NULL,
  ADD COLUMN IF NOT EXISTS ColorId INT NULL,
  ADD COLUMN IF NOT EXISTS SizeId INT NULL;

ALTER TABLE products
  ADD CONSTRAINT fk_products_producttypes
  FOREIGN KEY (ProductTypeId) REFERENCES producttypes(Id) ON DELETE RESTRICT;

ALTER TABLE products
  ADD CONSTRAINT fk_products_manufacturers
  FOREIGN KEY (ManufacturerId) REFERENCES manufacturers(Id) ON DELETE RESTRICT;

ALTER TABLE products
  ADD CONSTRAINT fk_products_productcolors
  FOREIGN KEY (ColorId) REFERENCES productcolors(Id) ON DELETE RESTRICT;

ALTER TABLE products
  ADD CONSTRAINT fk_products_productsizes
  FOREIGN KEY (SizeId) REFERENCES productsizes(Id) ON DELETE RESTRICT;

INSERT INTO producttypes (Name, Description)
SELECT * FROM (
  SELECT 'Laptop' AS Name, 'Portable computer products' AS Description
  UNION ALL SELECT 'Phone', 'Mobile phone products'
  UNION ALL SELECT 'Accessory', 'Accessories and peripherals'
) AS tmp
WHERE NOT EXISTS (SELECT 1 FROM producttypes LIMIT 1);

INSERT INTO manufacturers (Name, Description)
SELECT * FROM (
  SELECT 'Dell' AS Name, 'Dell Technologies' AS Description
  UNION ALL SELECT 'Apple', 'Apple Inc.'
  UNION ALL SELECT 'Samsung', 'Samsung Electronics'
) AS tmp
WHERE NOT EXISTS (SELECT 1 FROM manufacturers LIMIT 1);

INSERT INTO productcolors (Name)
SELECT * FROM (
  SELECT 'Black' AS Name
  UNION ALL SELECT 'White'
  UNION ALL SELECT 'Blue'
) AS tmp
WHERE NOT EXISTS (SELECT 1 FROM productcolors LIMIT 1);

INSERT INTO productsizes (Name)
SELECT * FROM (
  SELECT 'S' AS Name
  UNION ALL SELECT 'M'
  UNION ALL SELECT 'L'
) AS tmp
WHERE NOT EXISTS (SELECT 1 FROM productsizes LIMIT 1);
