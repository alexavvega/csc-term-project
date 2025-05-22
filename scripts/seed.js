const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./data/database.sqlite');

db.serialize(() => {
  db.run("CREATE TABLE IF NOT EXISTS products (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, description TEXT, price REAL, image TEXT)");

  db.run("DELETE FROM products");

  const stmt = db.prepare("INSERT INTO products (name, description, price, image) VALUES (?, ?, ?, ?)");

  const products = [
    ["Battletoads", "Classic NES beat-'em-up", 8.99, "/images/Battletoads_Coverart.png"],
    ["Donkey Kong", "Barrel-jumping platformer", 69.00, "/images/Donkey_Kong_NES_Cover.png"],
    ["Duck Hunt", "Light gun shooting game", 33.99, "/images/DuckHuntBox.jpg"],
    ["Earthworm Jim 2", "Cartoon action platformer", 44.50, "/images/Earthworm_Jim_2_EUR.png"],
    ["Final Fantasy", "Classic turn-based RPG", 59.99, "/images/FF1_USA_boxart.jpg"],
    ["Gunstar Heroes", "Run-and-gun action", 43.95, "/images/Gunstar_heros_box.jpg"],
    ["Jurassic Park", "NES dino survival", 34.00, "/images/Jurassic_Park_box_art_NES.jpg"],
    ["Tetris", "Puzzle block rotation fun", 29.00, "/images/NES_Tetris_Box_Front.jpg"],
    ["Renegade", "Side-scrolling brawler", 42.75, "/images/RenegadeC64-article_image.jpg"],
    ["Sonic", "Speedy SEGA action", 49.99, "/images/Sonic1_box_usa.jpg"],
    ["Super Mario Bros", "The one that started it all", 49.99, "/images/Super_Mario_Bros._box.png"],
    ["ToeJam & Earl", "Funky alien co-op game", 41.50, "/images/ToeJam.jpg"]
  ];

  products.forEach(p => stmt.run(p));
  stmt.finalize();

  console.log("✅ Seeded 12 products.");
});

db.close();
