const htmlchange = document.getElementById.bind(document); // Get id


function updT() {
    const daytime = new Date().getHours();
    if (daytime < 8 && daytime > 0) {
        htmlchange("timechange").innerHTML = "Early Mornings, Jailen Pan";
        htmlchange("bgC").classList.add("bgEM");
    }
    else if (daytime >= 8 && daytime < 12) {
        htmlchange("timechange").innerHTML = "Good Morning, Jailen Pan";
        htmlchange("bgC").classList.add("bgM");
    }
    else if (daytime === 12) {
        htmlchange("timechange").innerHTML = "It's Mid Day, Jailen Pan";
        htmlchange("bgC").classList.add("bgN");
    }
    else if (daytime > 12 && daytime < 18) {
        htmlchange("timechange").innerHTML = "Good Afternoon, Jailen Pan";
        htmlchange("bgC").classList.add("bgAN");
    }
    else if (daytime >= 18 && daytime < 21) {
        htmlchange("timechange").innerHTML = "Good Evening, Jailen Pan";
        htmlchange("bgC").classList.add("bgEN");
    }
    else if (daytime >= 21 || daytime === 0) {
        htmlchange("timechange").innerHTML = "Late Nights, Jailen Pan";
        htmlchange("bgC").classList.add("bgLN");
    }
    else {
        htmlchange("timechange").innerHTML = "Oops, something went wrong!"
    }
}

updT()
setInterval(updT, 60000)

htmlchange("themes").addEventListener("click", ThemeButton); // Light/Dark Mode
htmlchange("cardS").addEventListener("click", cardinput); // Can save tasks

document.querySelectorAll('[data-bs-toggle="popover"]').forEach(el => {
    new bootstrap.Popover(el)
})

document.addEventListener('click', function (e) {
    if (!e.target || !e.target.classList) return
    if (e.target.classList.contains('JSeditB')) { // Sets the edit button card
        const target = e.target.closest('.box1') // Targets the card to change things

        let CurrentT = target.querySelector('h2').innerHTML // Read text inside h2, which is the title of card
        let CurrentD = target.querySelector('p').innerHTML // Reads current description
        console.log(CurrentD, CurrentT)

        htmlchange('cardTitleInptC').value = CurrentT
        htmlchange('cardDesInptC').value = CurrentD

        htmlchange('contentC').replaceWith(htmlchange('contentC').cloneNode(true))

        htmlchange('contentC').addEventListener('click', function () {
            const NewT = htmlchange('cardTitleInptC').value
            const NewD = htmlchange('cardDesInptC').value

            target.querySelector('h2').innerHTML = NewT
            target.querySelector('p').innerHTML = NewD
        })
    }
})

function ThemeButton() {
    htmlchange("BackGnd").classList.toggle("darkM");
    htmlchange("navB").classList.toggle("navDark");
    document.querySelectorAll(".boxD").forEach(function (box) {
        box.classList.toggle("box2");
    });
}

async function cardinput() {
    const Ctitle = htmlchange('cardTitleInpt').value
    const Cdes = htmlchange('cardDesInpt').value

    let Tlength = Ctitle.length
    let Dlength = Cdes.length
    if (Ctitle === '' || Cdes === '') {
        console.log("Invalid letters")
    } else if (Tlength >= 50 || Dlength >= 100) {
        console.log("Text too long")
    } else {
        console.log('Request Sent Succesfully')
        CardsADD(Ctitle, Cdes)
    }
}

function CardsADD(Ctitle, Cdes) {
    const card = document.createElement("div")
    const dataid = Date.now()
    card.classList.add('col-auto', 'box1', 'bgT1');
    card.dataset.id = dataid
    card.dataset.id
    console.log(`Current Id: ${card.dataset.id}`);

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
                <a class="dropdown-item" href="#">Delete</a>
                <a class="dropdown-item" href="#">Something else here</a>
            </div>
        </div>
        <h2>${Ctitle}</h2>
        <p>${Cdes}</p>
        <div class="row mb-2">
            <div class="col-md-6 ms-1 duetab">
                <p class="overf1">Due: Next Month</p>
            </div>
            <div class="col-md-6 ms-1 prioritytab">
                <p>Priority: 5⭐️</p>
            </div>
        </div>
        <a data-bs-toggle="modal" data-bs-target="#Progressbarmodal">
            <div class="progress" role="progressbar" aria-label="Example with label"
                aria-valuenow="25" aria-valuemin="0" aria-valuemax="100">
                <div class="progress-bar" style="width: 25%">25%</div>
            </div>
        </a>
        <div class="row justify-content-center">
            <img style="width: auto; height: 100px;" src="/images/AdminLogo.png"
                alt="template.png"><br>
        </div>
        <div class="row justify-content-end">
            <button type="button"
                class="btn btn-success w-50 text-center me-1 mb-1">Done</button>
        </div>
    `
    htmlchange('cardA').append(card);
}


function CardsDELETE() {

}