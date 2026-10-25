const JSON_URL = "json/"
let ROLES_JSON

let DISPLAY

let FIRST_NAMES
let LAST_NAMES

let DATA = {
    actions: 12,
    seeintro: 0,
    seed: 0,
    day: 0,
    travelling: "",
    host: "Dog",
    people: [],
    events: [],
    assigned: {}
}

let dataready = false

const Status = {
    ALIVE: 0,
    INFECTED: 1,
    DEAD: 2,
    MISSING: 3,
    INJURED: 4,
    JAILED: 5,
}
const Roles = {
    DOG: 0,
    COOK: 1,
    MECHANIC: 2,
    CREWMEMBER: 3,
    RADIOOPERATOR: 4,
    COMMANDER: 5,
    DOGHANDLER: 6,
    OTHERRESEARCHER: 7,
    DOCTOR: 8,
}
const RequiredRoles = ["COMMANDER", "RADIOOPERATOR", "MECHANIC", "COOK", "DOGHANDLER", "CREWMEMBER", "DOCTOR"]

class Person {
    constructor(name, role, status, awareness = 0, suspicion = {}, goals = [], loc = "kennel", order = "") {
        this.name = name
        this.role = role
        this.status = status
        this.awa = awareness
        this.sus = {}
        this.goals = []
        this.location = loc
        this.order = order
        this.idle = 0
    }
}

function getEl(id) {
    return document.getElementById(id)
}
function getRandomFullName() {
    return `${FIRST_NAMES.random()} ${LAST_NAMES.random()}`
}
function splitFullName(name) {
    return name.split(' ')
}
function findPerson(name) {
    let found = false
    for (let i = 0; i < DATA.people.length; i++) {
        const p = DATA.people[i]
        if (p.name == name) {
            found = p
            break;
        }
    }
    return found
}
function getListOf(status) {
    let l = []
    DATA.people.forEach(person => {
        if (person.status == status) {
            l.push(person.name)
        }
    })
    return l
}
function getAliveSum() {
    let alive = [Status.ALIVE, Status.INJURED, Status.JAILED, Status.INFECTED]
    let l = []
    DATA.people.forEach(person => {
        if (alive.includes(person.status)) {
            l.push(person.name)
        }
    })
    return l
}
function getRoleString(roleenum) {

    return Object.keys(Roles)[roleenum]

}
function getPeopleNamesArray(all = false) {
    let a = []
    DATA.people.forEach(person => {
        if (!all && person.name == DATA.host) return;
        a.push(person.name)
    })
    return a
}
function listPeople(all = false) {
    let list = document.createElement("div")
    list.classList.add("people-list")

    let o = 2

    DATA.people.forEach(person => {

        let stringRole = Object.keys(Roles)[person.role]

        if (!all && person.name == DATA.host) return;
        o++
        if (o >= 3) o == 1;

        let p = document.createElement("div")
        p.classList.add("person")
        if (o % 2 == 0) p.classList.add("alt");

        let portrait = document.createElement("img")
        portrait.src = `assets/roles/${stringRole}.png`
        p.appendChild(portrait)

        let detail = document.createElement("div")
        detail.classList.add("detail")
        p.appendChild(detail)

        let name = document.createElement("h3")
        name.innerText = person.name
        detail.appendChild(name)

        let role = document.createElement("h5")
        role.innerText = `Role: ${ROLES_JSON[stringRole].display}`
        detail.appendChild(role)

        let desc = document.createElement("span")
        desc.classList.add("roledesc")
        desc.innerText = ROLES_JSON[stringRole].desc
        detail.appendChild(desc)

        list.appendChild(p)
    })

    console.log(DATA.people)

    return list
}
function displayDialogue(talker, speech, alt = false, role) {
    let alttext = ""
    if (alt) alttext = " alt";
    DISPLAY.innerHTML += `
    <div class="dialogue-box${alttext}">
    <img src="assets/roles/${getRoleString(role)}.png">
    <div class="detail">
    <h3>${talker}</h3>
    <span>${speech}</span>
    </div>
    </div>
    `
}
function displayPerson(who, alt = false) {
    let alttext = ""
    if (alt) alttext = " alt";
    DISPLAY.innerHTML += `
    <div class="dialogue-box${alttext}">
    <img src="assets/roles/${getRoleString(who.role)}.png">
    <div class="detail">
    <h3>${who.name}</h3>
    <h5>Role: ${getRoleString(who.role)}</h5>
    <span class="roledesc">${ROLES_JSON[getRoleString(who.role)].desc}</span>
    </div>
    </div>
    `
}
function addSuspicion(to, who, by) {
    if (who.name in to.sus) {
        to.sus[who.name] += by
    } else {
        to.sus[who.name] = by
    }
    saveState()
}
function addAwareness(to, by) {
    to.awa += by
    saveState()
}
async function init() {
    let d = document.getElementById("display")
    try {
        d.innerHTML += `<div>loading names</div>`
        const firstnames = await axios.get(`${JSON_URL}names-firsts.json`);
        const lastnames = await axios.get(`${JSON_URL}names-last.json`);
        d.innerHTML += `<div>names loaded successfully</div>`
        d.innerHTML += `<div>loading roles</div>`
        const roles = await axios.get(`${JSON_URL}roles.json`)
        d.innerHTML += `<div>roles loaded successfully</div>`

        FIRST_NAMES = firstnames.data
        LAST_NAMES = lastnames.data
        ROLES_JSON = roles.data

        d.innerHTML += `<div>loading save</div>`

        if (loadState() == true) {
            d.innerHTML += `<div>existing save loaded</div>`
            console.log("save exists, starting from last point")
            dataready = true
        } else {
            console.log("save doesnt exist!")
            DATA.people.push(
                new Person("Dog", Roles.DOG, Status.INFECTED)
            )

            RequiredRoles.forEach(role => {
                let p = new Person(getRandomFullName(), Roles[role], Status.ALIVE)
                DATA.assigned[role] = p.name
                DATA.people.push(
                    p
                )
            })

            dataready = true
        }

    } catch (e) {
        d.innerHTML += `<div class="error">loading failed, dumping cause</div>`
        var aux = e.stack.split("\n"); //removing the line that we force to generate the error (var err = new Error();) from the message
        let final = []
        aux.forEach(line => {
            if (line.startsWith("@http")) {
                final.push(line)
            }
        })

        d.innerHTML += `<div class="error">${e}</div>`
        d.innerHTML += `<div class="error">${final.join(" ")}</div>`
        console.error(e)
    }
}


Array.prototype.random = function () {
    return this[Math.floor((Math.random() * this.length))];
}
function saveState() {
    localStorage.setItem("jcttwg-save", JSON.stringify(DATA))
}
function loadState() {
    const getSave = localStorage.getItem("jcttwg-save");
    try {
        if (getSave != null && getSave != "null") {
            DATA = JSON.parse(getSave)
            return true
        } else {
            return false
        }
    } catch (e) {
        console.error(e)
        return false
    }
}
function resetData() {
    DATA = null
    saveState()
    location.reload()
}
window.addEventListener('load', function () {
    console.log("window loaded")

    function displayError(t) {
        console.log("hey")
        document.getElementById("display").innerHTML += `<div class="error">${t}</div>`
    }
    addEventListener('error', ({ error }) => {
        console.warn(`Uncaught global error "${error?.stack}"`);
        displayError(`Uncaught global error "${error?.stack}"`)
    });
    addEventListener('unhandledrejection', event => {

        let getFile = event.reason.fileName.split("/").splice(-2, 2).join("/")
        let getLn = event.reason.lineNumber

        console.warn(`Unhandled promise rejection "${event.reason}"`);
        displayError(`Unhandled promise rejection "${event.reason}" - ${getFile}:${getLn}`)
    });

    init()
})