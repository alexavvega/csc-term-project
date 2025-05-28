const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./data/database.sqlite');

db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS orders (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER,
      product_name TEXT,
      price REAL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `, (err) => {
    if (err) {
      console.error("❌ Failed to create orders table:", err.message);
    } else {
      console.log("✅ Orders table created successfully.");
    }
  });
});

db.close();
