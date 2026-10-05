const sqlite3 = require('sqlite3').verbose()
const db = new sqlite3.Database('database.sqlite')

db.run(`
  CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    quantity REAL,
    unit TEXT,
    price REAL,
    category TEXT,
    expiryDate TEXT
  )
`)

module.exports = db
