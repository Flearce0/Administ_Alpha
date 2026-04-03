console.log('jav.js Loaded!') // DEBUG LINE

const htmlchange = document.getElementById.bind(document); // Get id

// BUG: tasks disappear when navigating between pages
// FIX: implement database later
let Cdata = []
let dailyS = 0
async function init() { // async = This function can now wait
    console.log('init started!')
    try {
        console.log('trying fetch...') // DEBUG LINE
        const resp = await fetch('/getTasks') // Wait for server's responce
        console.log('response status:', resp.status) // DEBUG LINE
        const tasks = await resp.json() // take that responce and convert it from JSON to JS array, wait then save at tasks
        console.log('tasks received:', tasks) // DEBUG LINE
        tasks.forEach(t => {
            Cdata.push(t) // populate Cdata from database
            CardsADD(t.title, t.des, t.due, t.priority, true, t.cardid)
        })
    } catch (error) {
        console.log('Database error:', error)
    }
    console.log('Cdata after loading:', Cdata) // DEBUG LINE
    console.log('Today tasks:', Cdata.filter(t => t.due === 'Today')) // DEBUG LINE

    tasksSYNC()

    const SavedTheme = localStorage.getItem('theme')
    if (SavedTheme === 'dark') {
        htmlchange('themes').checked = true // checked = checks the toggle box, if its toggled dark it stays dark
        ThemeButton() // Actually applies all the checks
    }

    const latedate = localStorage.getItem('lastdate')
    const today = new Date().toDateString()

    if (latedate !== today) { // Detects if its new day or not
        dailyS = 0
        localStorage.setItem('dailyScore', 0)
        localStorage.setItem('lastdate', today)
    } else {
        dailyS = Number(localStorage.getItem('dailyScore')) || 0
    }
    rankfunc()
}

document.addEventListener('DOMContentLoaded', function () {
    init()
})


function updT() {
    const bgC = htmlchange('bgC')
    bgC.classList.remove('bgEM', 'bgM', 'bgN', 'bgAN', 'bgEN', 'bgLN')
    const daytime = new Date().getHours();
    if (daytime < 8 && daytime > 0) {
        htmlchange("timechange").innerHTML = "Early Mornings, Flearce";
        bgC.classList.add("bgEM");
    }
    else if (daytime >= 8 && daytime < 12) {
        htmlchange("timechange").innerHTML = "Good Morning, Flearce";
        bgC.classList.add("bgM");
    }
    else if (daytime === 12) {
        htmlchange("timechange").innerHTML = "It's Mid Day, Flearce";
        bgC.classList.add("bgN");
    }
    else if (daytime > 12 && daytime < 18) {
        htmlchange("timechange").innerHTML = "Good Afternoon, Flearce";
        bgC.classList.add("bgAN");
    }
    else if (daytime >= 18 && daytime < 21) {
        htmlchange("timechange").innerHTML = "Good Evening, Flearce";
        bgC.classList.add("bgEN");
    }
    else if (daytime >= 21 || daytime === 0) {
        htmlchange("timechange").innerHTML = "Late Nights, Flearce";
        bgC.classList.add("bgLN");
    }
    else {
        htmlchange("timechange").innerHTML = "Oops, something went wrong!"
    }
}

function rankfunc() {
    console.log('rankfunc called, dailyS:', dailyS)
    console.log('JSplate element:', htmlchange('JSplate'))
    if (dailyS < 3) {
        htmlchange('JSplate').innerHTML = '<h2 class="rankE" style="font-size: 75px;">E</h2>';
    }
    else if (dailyS >= 3 && dailyS < 6) {
        htmlchange('JSplate').innerHTML = '<h2 class="rankD" style="font-size: 75px;">D</h2>';
    }
    else if (dailyS >= 6 && dailyS < 10) {
        htmlchange('JSplate').innerHTML = '<h2 class="rankC" style="font-size: 75px;">C</h2>';
    }
    else if (dailyS >= 10 && dailyS < 15) {
        htmlchange('JSplate').innerHTML = '<h2 class="rankB" style="font-size: 75px;">B</h2>';
    }
    else if (dailyS >= 15 && dailyS < 20) {
        htmlchange('JSplate').innerHTML = '<h2 class="rankA" style="font-size: 75px;">A</h2>';
    }
    else if (dailyS >= 20 && dailyS < 26) {
        htmlchange('JSplate').innerHTML = '<h2 class="rankS" style="font-size: 75px;">S</h2>';
    }
    else if (dailyS >= 26 && dailyS < 30) {
        htmlchange('JSplate').innerHTML = '<h2 class="rankSS" style="font-size: 75px;">SS</h2>';
    }
    else if (dailyS >= 30) {
        htmlchange('JSplate').innerHTML = '<h2 class="rankSSS" style="font-size: 75px;">SSS</h2>';
    } else {
        htmlchange('JSplate').innerHTML = '<h2 class="rankSSS" style="font-size: 75px;">ERROR</h2>';
    }
}

function updR() {
    const H = new Date().getHours()
    const M = new Date().getMinutes()

    if (H) {
        null // Unfinished
    }
}

updT()
setInterval(updT, 60000)

htmlchange("themes").addEventListener("click", ThemeButton); // Light/Dark Mode
htmlchange("cardS").addEventListener("click", cardinput); // Can save tasks

document.querySelectorAll('[data-bs-toggle="popover"]').forEach(el => {
    new bootstrap.Popover(el)
})

document.addEventListener('click', function (e) { // EDIT FUNCTION
    if (!e.target || !e.target.classList) return
    if (e.target.classList.contains('JSeditB')) { // Sets the edit button card
        const target = e.target.closest('.box1') // find the card to change things

        let CurrentT = target.querySelector('h2').innerHTML // Finds and reads text inside h2, which is the title of card
        let CurrentD = target.querySelector('p').innerHTML // Finds and reads current description that is p
        let CurrentDu = target.querySelector('.CardDu').innerHTML.replace('Due: ', '')
        let CurrentP = target.querySelector('.CardP').innerHTML.replace('Priority: ', '').replace('⭐️', '')
        console.log(CurrentD, CurrentT, CurrentDu, CurrentP) // querySelector = Find, innerHTML = Read

        htmlchange('cardTitleInptC').value = CurrentT
        htmlchange('cardDesInptC').value = CurrentD
        htmlchange('cardDueInptC').value = CurrentDu
        htmlchange('cardPriorInptC').value = CurrentP

        htmlchange('contentC').replaceWith(htmlchange('contentC').cloneNode(true))

        htmlchange('contentC').addEventListener('click', function () {
            const NewT = htmlchange('cardTitleInptC').value
            const NewD = htmlchange('cardDesInptC').value
            const NewDu = htmlchange('cardDueInptC').value
            const NewP = htmlchange('cardPriorInptC').value
            console.log(NewT, NewD, NewDu, NewP);

            target.querySelector('h2').innerHTML = NewT
            target.querySelector('p').innerHTML = NewD
            target.querySelector('.CardDu').innerHTML = `Due: ${NewDu}`
            target.querySelector('.CardP').innerHTML = `Priority: ${NewP}⭐️`

            const dataid = Number(target.dataset.id)
            console.log('dataid:', dataid)
            console.log('Cdata before:', Cdata)

            fetch('/updTask', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    title: NewT,
                    des: NewD,
                    due: NewDu,
                    priority: NewP,
                    cardid: dataid
                })
            })

            console.log('dataid:', dataid, typeof dataid)
            console.log('first cardid:', Cdata[0]?.cardid, typeof Cdata[0]?.cardid)

            const task = Cdata.find(t => t.cardid === dataid)
            task.title = NewT
            task.des = NewD
            task.due = NewDu
            task.priority = NewP

            console.log('CurrentDu:', CurrentDu)
            console.log('cardDueInptC value:', htmlchange('cardDueInptC').value)
            tasksSYNC()

            bootstrap.Modal.getInstance(htmlchange('staticBackdrop')).hide() // BUG: NOT HIDING
        })
    }
    if (e.target.classList.contains('JSdeleteB')) {
        const target = e.target.closest('.box1') // find the card to change things
        const dataid = Number(target.dataset.id)
        console.log('dataid:', dataid)
        console.log('Cdata before:', Cdata)
        fetch('/deleteTask', {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ cardid: dataid })
        })

        Cdata = Cdata.filter(t => t.cardid !== dataid)
        target.remove()
        tasksSYNC()
        console.log('Task deleted successfully!');
    }
    if (e.target.classList.contains('JSdoneB')) {
        const target = e.target.closest('.box1') // find the card to change things
        const dataid = Number(target.dataset.id)
        const tasks = Cdata.find(t => t.cardid === dataid)

        dailyS += Number(tasks.priority)
        console.log(`This score: ${dailyS}`)
        localStorage.setItem('dailyScore', dailyS)
        rankfunc()
        // Data retrive scripts
        console.log('Datas retrived successfuly!')
        fetch('/deleteTask', {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ cardid: dataid })
        })
        Cdata = Cdata.filter(t => t.cardid !== dataid)
        target.remove();
        tasksSYNC()
        console.log('Task removed successfully!')
    }
})

function ThemeButton() {
    htmlchange("BackGnd").classList.toggle("darkM");
    htmlchange("navB").classList.toggle("navDark");
    htmlchange("htmlCSS").classList.toggle("htmlD");
    document.querySelectorAll(".boxD").forEach(function (box) {
        box.classList.toggle("box2");
    });
    document.querySelectorAll('.boxD2').forEach(function (noti) {
        noti.classList.toggle('box3')
    })
    document.querySelectorAll(".boxD3").forEach(function (remind) {
        remind.classList.toggle("box4");
    });
    document.querySelectorAll('.gearIcon').forEach(function (gearI) {
        gearI.classList.toggle('gearIconD');
    })
    document.querySelectorAll('.plate').forEach(function (plateBG) {
        plateBG.classList.toggle('rankPlateD');
    })
    document.querySelectorAll('.line').forEach(function (line) {
        line.classList.toggle('lineD')
    })
    document.querySelectorAll('.borderL').forEach(function (Tborder) {
        Tborder.classList.toggle('borderD')
    })
    document.querySelectorAll('.modal').forEach(function (modals) {
        Currentmodal = modals.getAttribute('data-bs-theme')
        if (Currentmodal === 'dark') {
            modals.setAttribute('data-bs-theme', 'light')
        } else {
            modals.setAttribute('data-bs-theme', 'dark')
        }
    })
    document.querySelectorAll('.list-group').forEach(function (ls) {
        Currentls = ls.getAttribute('data-bs-theme')
        if (Currentls === 'dark') {
            ls.setAttribute('data-bs-theme', 'light')
        } else {
            ls.setAttribute('data-bs-theme', 'dark')
        }
    })

    if (htmlchange("BackGnd").classList.contains("darkM")) {
        localStorage.setItem('theme', 'dark')
    } else {
        localStorage.setItem('theme', 'light')
    }
}

async function cardinput() {
    let Ctitle = htmlchange('cardTitleInpt').value
    let Cdes = htmlchange('cardDesInpt').value
    let Cdue = htmlchange('cardDueInpt').value
    let CPrior = htmlchange('cardPriorInpt').value

    let Tlength = Ctitle.length
    let Dlength = Cdes.length
    if (Ctitle === '') Ctitle = '--'
    if (Cdes === '') Cdes = '--'
    if (Tlength >= 50 || Dlength >= 100) console.log("Text too long")
    else {
        console.log('Request Sent Succesfully')
        CardsADD(Ctitle, Cdes, Cdue, CPrior) // ⬇️
    }
}

async function CardsADD(Ctitle, Cdes, Cdue, CPrior, fromInit = false, Cid = null) {
    const card = document.createElement("div")
    const dataid = Cid || Date.now()
    card.classList.add('col-auto', 'box1', 'bgT1');
    card.dataset.id = dataid
    card.dataset.id
    console.log(`Current Id: ${card.dataset.id}`);

    // BUG: SAVING ONE OPTION WITHOUT TOUCHING THE OTHER ONE REWRITES THE OTHER OPTION MAKING THE THAT TAG EMPTY
    // BUG: When I edit I must edit Priority and Due date if I only edit one without touching the other one it will break
    card.innerHTML = `
        <div class="dropdown" style="position: relative;">
            <a class="dropdown-toggle kebabB d-flex justify-content-end mt-1 mb-1 cardBA"
                href="#" role="button" id="dropdownMenuLink1" data-bs-toggle="dropdown"
                aria-expanded="false">
                <img src="/images/three-dots-vertical.svg">
            </a>
            <div class="dropdown-menu dropdown-menu-end"
                aria-labelledby="dropdownMenuLink1">
                <a class="dropdown-item JSeditB" href="#" data-bs-toggle="modal"
                    data-bs-target="#staticBackdrop">
                    Edit
                </a>
                <a class="dropdown-item JSdeleteB" href="#">Delete</a>
                <a class="dropdown-item" href="#">Infos</a>
            </div>
        </div>
        <h2 class="me-3">${Ctitle}</h2>
        <p>${Cdes}</p>
        <div class="row mb-2">
            <div class="col-md-6 ms-1 duetab">
                <p class="overf1 CardDu">Due: ${Cdue}</p> <!-- NEED CHANGE HERE -->
            </div>
            <div class="col-md-6 ms-1 prioritytab">
                <p class="CardP me-2">Priority: ${CPrior}⭐️</p>
            </div>
        </div>
        <a data-bs-toggle="modal" data-bs-target="#Progressbarmodal">
            <div class="progress" role="progressbar" aria-label="Example with label"
                aria-valuenow="50" aria-valuemin="0" aria-valuemax="100">
                <div class="progress-bar" style="width: 50%">50%</div>
            </div>
        </a>
        <div class="row justify-content-center">
            <img style="width: auto; height: 100px;" src="/images/AdminLogo.png"
                alt="template.png"><br> <!-- NEED CHANGE HERE -->
        </div>
        <div class="row justify-content-end">
            <button type="button"
                class="btn btn-success w-50 text-center me-1 mb-1 JSdoneB">Done</button>
        </div>
    `
    if (!fromInit) {
        await fetch('/saveTask', { // Hit POST route in app.js
            method: 'POST', // Sends data
            headers: { 'Content-Type': 'application/json' }, // Tell server we sending JSON
            body: JSON.stringify({
                title: Ctitle,
                des: Cdes,
                due: Cdue,
                priority: CPrior,
                cardid: dataid
            }) // Convert object to string to send
        })

        Cdata.push({
            title: Ctitle,
            des: Cdes,
            due: Cdue,
            priority: CPrior,
            cardid: dataid
        })
    }
    console.log('Task Saved to DB')
    htmlchange('cardA').append(card);
    tasksSYNC()
}

async function RemindersADD(fromInit = false, Rid = null) {
    const reminder = document.createElement('div')
    const dataid = Rid || Number(Date.now()) + 1
    reminder.classList.add('box1', 'boxD2', 'mb-2', 'reminderTemp')
    reminder.dataset.id = dataid
    reminder.dataset.id
    console.log(`Current Reminder ID: ${reminder.dataset.id}`)

    reminder.innerHTML = `
            <div class="row ms-1">
                <h2 class="pt-1">AS 91868 Internal Assessment - Part A v2</h2>
                <p class="pb-2">Description</p>
                <div class="container">
                    <p>Due on: Monday, 23/03/2026</p>
                    <p>Remaining Time: 10D, 10H</p>
                </div>
            </div>
    `

    if (!fromInit) {
        await fetch('/saveRemind', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                title: null,
                des: null,
                duetime: null,
                remindid: dataid
            })
        })
    }

    Rdata.push({
        Rtitle: null,
        des: null,
        duetime: null,
        remindid: dataid
    })
    console.log('Reminder Saved to DB')
    htmlchange('').append(reminder)
}

function tasksSYNC() {
    console.log('tasksSYNC called, Cdata:', Cdata) // DEBUG LINE
    console.log('TDtasks:', Cdata.filter(t => t.due === 'Today')) // DEBUG LINE

    const TDcontainer = htmlchange('TDcontainer')
    TDcontainer.innerHTML = ''

    TDtasks = Cdata.filter(dueT => dueT.due === 'Today')

    if (TDtasks.length > 0) {
        console.log('Display tasks!') // DEBUG LINE 
        TDtasks.forEach(dueT => {
            console.log('creating todo for:', dueT.title) // DEBUG LINE
            const TodayT = document.createElement("div")
            TodayT.classList.add('row', 'mb-2', 'borderL')

            if (htmlchange('BackGnd').classList.contains('darkM')) {
                TodayT.classList.add('borderD')
            }
            TodayT.innerHTML = `
        <h2 class="fs-4 m-1">${dueT.title}</h2>
        <p>${dueT.des}</p>
    `
            htmlchange('TDcontainer').append(TodayT);
        })
    }
    else {
        TDcontainer.innerHTML = `
        <div class="row text-center">
            <p class="pt-3" style="font-weight: bolder;">No Tasks for now, yippie!</p>
        </div>
        `
    }
}