DISPLAY = getEl("display")

function waitForData() {
    setTimeout(() => {
        if (!dataready) {
            return waitForData()
        } else {
            run()
        }
    }, 100);
}

function displayAdd(html) {
    DISPLAY.innerHTML += html
}
async function buttonOptions(options, purpose = "",) {

    let btnsArr = []
    let btns = document.createElement("div")
    btns.classList.add("options")
    let btnid = `${purpose}-${Date.now()}`
    btns.id = btnid
    let i = 0
    options.forEach(option => {
        let btn = document.createElement("button")
        btn.innerText = option
        btns.appendChild(btn)
        btn.id = i
        i++
        btnsArr.push(btn)
    });

    DISPLAY.appendChild(btns)

    btns.scrollIntoView()

    return new Promise((resolve) => {
        btnsArr.forEach(btn => {
            btn.onclick = function () {
                resolve(btn.id);
                btnsArr = []
                getEl(btnid).remove()
            }
        })
    });

}

async function run() {
    if (DATA.seeintro == 0) {
        await intro()
    }
    console.log(DATA)
    DISPLAY.innerHTML = ``

    DISPLAY.innerHTML += `<div>Day: ${DATA.day}</div>`
    DISPLAY.innerHTML += `<div>Location: ${getLocationName(findPerson(DATA.host).location)}</div>`
    DISPLAY.innerHTML += `<div>Current Host: ${DATA.host}</div>`
    DISPLAY.innerHTML += `<div>Infected: ${getListOf(Status.INFECTED).length-1}/${getListOf(Status.ALIVE).length-1}</div>`
}

waitForData()