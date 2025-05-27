const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');
const path = './data/database.sqlite';

// Make sure /data exists
if (!fs.existsSync('./data')) {
  fs.mkdirSync('./data');
}

const db = new sqlite3.Database(path);

db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      password TEXT NOT NULL
    )
  `, (err) => {
    if (err) {
      console.error("❌ Failed to create table:", err.message);
    } else {
      console.log("✅ Users table created.");
    }
  });
});

db.close();
