const express = require('express')
const app = express()
const db = require('./database')

app.use(express.static("styles"));
app.use(express.json())
app.use(express.urlencoded({extended: true}))

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/templates/login.html");
})

app.get("/dashboard", (req, res) => {
    res.sendFile(__dirname + "/templates/index.html");
})

app.get("/records", (req, res) => {
    res.sendFile(__dirname + "/templates/records.html");
})

app.post('/saveTask', (req, res) => {
    const {title, des, due, priority, cardid} = req.body

    db.prepare(`
        INSERT INTO tasks (title, des, due, priority, cardid)
        VALUES(?, ?, ?, ?, ?)
    `).run(title, des, due, priority, cardid)

    res.json({success: true})
}) // Frontend sends task data -> save to db

app.get('/getTasks', (req, res) => {
    const tasks = db.prepare(`SELECT * FROM tasks`).all() // Get all rows from tasks table, and returns array/list of all results
    res.json(tasks) // Sends array back to frontend
}) // Frontend ask for task -> send from db

app.delete('/deleteTask', (req, res) => {
    console.log('delete request received:', req.body) // DEBUG LINE
    const { cardid } = req.body
    console.log('deleting cardid:', cardid) // DEBUG LINE
    db.prepare('DELETE FROM tasks WHERE cardid = ?').run(cardid)
    res.json({success:  true})
}) // Front end says delete -> send from db

app.put('/updTask', (req, res) => {
    console.log('Received:', req.body)
    const {title, des, due, priority, cardid} = req.body
    db.prepare(`
        UPDATE tasks SET title=?, des=?, due=?, priority=?
        WHERE cardid =?    
    `).run(title, des, due, priority, cardid)
    res.json({success: true})
}) // Frontend says edit -> upd in db

app.listen(6700);