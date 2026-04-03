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

db.exec(`
    CREATE TABLE IF NOT EXISTS reminders (
    id INTEGER PRIMARY KEY,
    title TEXT NOT NULL,
    des TEXT,
    duetime TEXT,
    remindid INTEGER UNIQUE
    )
`)

db.exec(`
    CREATE TABLE IF NOT EXISTS routine (
    id INTEGER PRIMARY KEY,
    block TEXT NOT NULL,
    des TEXT,
    timeblock TEXT,
    routineid INTEGER UNIQUE
    )
`)

module.exports = db