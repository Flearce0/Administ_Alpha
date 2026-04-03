require('dotenv').config()
console.log(process.env.SECRET)
const express = require('express')
const app = express()
const db = require('./database')
const session = require('express-session')

app.use(express.static("styles"));
app.use(express.json())
app.use(express.urlencoded({extended: true}))

app.use(session({secret: process.env.SECRET, 
    resave: false,
    saveUninitialized: false
}))

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/templates/frontpage.html");
})

app.get('/login', (req, res) => {
    res.sendFile(__dirname + "/templates/login.html")
})

app.get("/dashboard", isLoggedIn, (req, res) => {
    res.sendFile(__dirname + "/templates/index.html");
})

app.get("/records", (req, res) => {
    res.sendFile(__dirname + "/templates/records.html");
})

app.post('/verify', (req, res) => {
    if (req.body.passkey === process.env.PASSKEY) {
        req.session.isLoggedIn = true
        res.redirect('/dashboard')
    } else {
        console.log("Invalid Passkey")
    }
})

app.get('/logout', (req, res) => {
    req.session.destroy((st) => {
        res.redirect('/login')
    })
})

function isLoggedIn(req, res, next) {
    if (req.session.isLoggedIn === true) {
        next()
    }
    else {
        res.redirect('/login')
    }
}


app.post('/saveTask', isLoggedIn, (req, res) => {
    const {title, des, due, priority, cardid} = req.body

    db.prepare(`
        INSERT INTO tasks (title, des, due, priority, cardid)
        VALUES(?, ?, ?, ?, ?)
    `).run(title, des, due, priority, cardid)

    res.json({success: true})
}) // Frontend sends task data -> save to db

app.get('/getTasks',  isLoggedIn, (req, res) => {
    const tasks = db.prepare(`SELECT * FROM tasks`).all() // Get all rows from tasks table, and returns array/list of all results
    res.json(tasks) // Sends array back to frontend
}) // Frontend ask for task -> send from db

app.delete('/deleteTask', isLoggedIn, (req, res) => {
    console.log('delete request received:', req.body) // DEBUG LINE
    const { cardid } = req.body
    console.log('deleting cardid:', cardid) // DEBUG LINE
    db.prepare('DELETE FROM tasks WHERE cardid = ?').run(cardid)
    res.json({success:  true})
}) // Front end says delete -> send from db

app.put('/updTask', isLoggedIn, (req, res) => {
    console.log('Received:', req.body)
    const {title, des, due, priority, cardid} = req.body
    db.prepare(`
        UPDATE tasks SET title=?, des=?, due=?, priority=?
        WHERE cardid =?    
    `).run(title, des, due, priority, cardid)
    res.json({success: true})
}) // Frontend says edit -> upd in db

app.listen(6700);