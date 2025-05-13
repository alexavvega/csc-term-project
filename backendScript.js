// Import sqlite3
const sqlite3 = require('sqlite3').verbose();

// Connect SQLite database (creates file if it doesn't exist)
const db = new sqlite3.Database('temporary.db', (err) => {
    if (err) {
        return console.error('Connection error:', err.message);
    }
    console.log('Connected to SQLite database.');
});

// Create table
db.run(`
    CREATE TABLE IF NOT EXISTS temporary_table (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL
    )
`, (err) => {
    if (err) {
        return console.error('Table creation error:', err.message);
    }
    console.log('Table created or already exists.');

    // Insert temp data
    const stmt = db.prepare("INSERT INTO temporary_table (name) VALUES (?)");
    stmt.run("temporary1");
    stmt.run("temporary2");
    stmt.finalize();

    // Query data
    db.all("SELECT * FROM temporary_table", [], (err, rows) => {
        if (err) {
            return console.error('Query error:', err.message);
        }
        console.log('Data in table:');
        rows.forEach((row) => {
            console.log(row);
        });

        // Close database
        db.close((err) => {
            if (err) {
                return console.error('Closing error:', err.message);
            }
            console.log('Database connection closed.');
        });
    });
});
