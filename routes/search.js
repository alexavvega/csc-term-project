const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./data/database.sqlite');

app.get('/search', (req, res) => {
  const q = req.query.q;

  if (!q) return res.send("No search query provided.");

  const query = `%${q.toLowerCase()}%`;

  db.all(
    'SELECT * FROM products WHERE LOWER(name) LIKE ? OR LOWER(description) LIKE ?',
    [query, query],
    (err, rows) => {
      if (err) {
        console.error(err.message);
        return res.status(500).send("Search failed.");
      }

      // You can render a results page or just return JSON
      res.render('search-results.ejs', { results: rows, query: q });
    }
  );
});
