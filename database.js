const Datas = require('better-sqlite3')
const db = new Datas('database.db')

db.exec(`
    CREATE TABLE IF NOT EXISTS tasks (
    id INTEGER PRIMARY KEY,
    title TEXT NOT NULL,
    des TEXT,
    due TEXT,
    priority INTEGER,
    cardid INTEGER UNIQUE
    )
`)

module.exports = db