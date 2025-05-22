-- TABLE ALREADY EXISTS !!! IMPORT HERE
CREATE TABLE IF NOT EXISTS Users (
 user_id INTEGER PRIMARY KEY,
  username TEXT NOT NULL UNIQUE,
  email TEXT UNIQUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP 
);

CREATE TABLE IF NOT EXISTS Products ( -- Products table here NEW CREATION SEPERATE FROM USERS ID
  product_id INTEGER PRIMARY KEY,
  name TEXT NOT NULL,
  price REAL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

--  UserProducts table to track quantities of items
CREATE TABLE IF NOT EXISTS UserProducts (
  user_id INTEGER,
  product_id INTEGER,
  quantity INTEGER NOT NULL DEFAULT 0,
  last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (user_id, product_id),
  FOREIGN KEY (user_id) REFERENCES Users(user_id),
  FOREIGN KEY (product_id) REFERENCES Products(product_id)
);



INSERT INTO UserProducts (user_id, product_id, quantity) 
VALUES (1, 2, 5)
ON CONFLICT (user_id, product_id) 
DO UPDATE SET quantity = quantity + 5, last_updated = CURRENT_TIMESTAMP; -- Update quantity function


UPDATE UserProducts -- If users choose to decrease number of products
SET quantity = quantity - 1, last_updated = CURRENT_TIMESTAMP
WHERE user_id = 1 AND product_id = 2 AND quantity >= 1;


SELECT p.name, up.quantity, p.price, (p.price * up.quantity) as total_value
FROM UserProducts up
JOIN Products p ON up.product_id = p.product_id
WHERE up.user_id = 1; -- All quantity amount per user

-- Total inventory count for a user
SELECT SUM(quantity) as total_items
FROM UserProducts
WHERE user_id = 1;