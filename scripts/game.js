DISPLAY = getEl("display")

function waitForData() {
    setTimeout(() => {
        if (!dataready) {
            return waitForData()
        } else {
            console.log(DATA)
            menu()
        }
    }, 100);
}

function displayAdd(html) {
    DISPLAY.innerHTML += html
}
async function buttonOptions(options, purpose = "", list = false) {

    let btnsArr = []
    let btns = document.createElement("div")
    btns.classList.add("options")
    if (list) btns.classList.add("listed")
    let btnid = `${purpose}-${Date.now()}`
    btns.id = btnid
    let i = 0
    options.forEach(option => {
        let btn = document.createElement("button")
        btn.innerText = option
        if (typeof option == "object") { // is this completely out of pocket? Yes. Does it work? Also yes.
            btn.classList.add("disabled")
            btn.disabled = true
        }
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

function displayHUD() {
    DISPLAY.innerHTML += `
    <div class="space-between">
    <div>${getListOf(Status.INFECTED).length}/${getAliveSum().length} Infected</div>
    <div>Day: ${DATA.day}</div>
    </div>`
    DISPLAY.innerHTML += `
    <div class="space-between">
    <div>Location: ${getLocationName(findPerson(DATA.host).location)}</div>
    <div>AP: ${DATA.actions}</div>
    </div>`
    DISPLAY.innerHTML += `<div class="location-desc">${MAP[findPerson(DATA.host).location].desc}</div>`
    DISPLAY.innerHTML += `
    <div class="space-between">
    <div>Current Host:</div>
    <div></div>
    </div>`
    displayPerson(findPerson(DATA.host))

    let nearyou = "Nobody."
    let getnearyou = getPeopleNearYou()
    if (getnearyou.length >= 1) {
        nearyou = getnearyou.join(", ")
    }

    DISPLAY.innerHTML += `<div>Near you: ${nearyou}</div>`
}

async function defeat() {

    DISPLAY.innerHTML = ``

    displayAdd(`There are no more infected people.`)

}

function step(price) {

    DATA.actions -= price

    DATA.people.forEach(person => {
        if (person.goals.length > 1 && getListOf(Status.ALIVE).includes(person.name) && person.name != DATA.host) {
            person.location = person.goals[1]
            person.goals.shift()
        }
    })

    updateMap()
    saveState()
}

async function advanceDay() {

    DISPLAY.innerHTML = ``
    displayAdd(`You've ran out of action points for the day. Everyone goes to sleep.`)
    await buttonOptions(['Go to bed'])

    DATA.people.forEach(person => {
        if (person.status == Status.DEAD) return;

        person.location = "sleepquarters"
        person.goals = ROLES_JSON[getRoleString(person.role)].routines.wake.random()
    })

    DATA.day++
    DATA.actions = 12

    updateMap()
    saveState()
    menu()
}

async function travelMenu() {
    // make this save later?
    DISPLAY.innerHTML = ``
    displayHUD()
    displayAdd(`Travel to...`)
    let locations = []
    MAP[findPerson(DATA.host).location].connecting.forEach(viable => {
        locations.push(viable)
    })
    let movingto = await buttonOptions(locations, "", true)
    await eventCheck(locations[movingto])
    findPerson(DATA.host).location = locations[movingto]
    step(1)
    return menu();
}

async function menu() {
    if (DATA.seeintro == 0) {
        await intro()
    }

    if (getListOf(Status.INFECTED).length == 0) return defeat();
    if (DATA.actions == 0) return advanceDay();

    updateMap()

    DISPLAY.innerHTML = ``
    displayHUD()

    /*Object.keys(DATA.assigned).forEach(role => {
        let p = DATA.assigned[role]
        displayAdd(`<div>${role} ${findPerson(p).location}</div>`)
    })*/

    if (getListOf(Status.DEAD).length >= 1) {

        displayAdd('<hr>')

        let menuoptions = ['Wait (1AP)', 'Travel (1AP)', ['Kill']]

        let menubtn = await buttonOptions(menuoptions)
        menubtn = menubtn.toString()
        switch (menubtn) {
            case "0":
                step(1)
                return menu();
            case "1":
                return travelMenu()
            default:
                console.log("something borked up")
                return menu();
        }





    } else { // get out of cell
        let options = ['Bark', 'Kill one of your cellmates']

        let sel = await buttonOptions(options)

        if (sel == 0) {
            DISPLAY.innerHTML = ``
            displayDialogue('Dog', "Woof!", false, Roles.DOG)
            displayDialogue(DATA.assigned.DOGHANDLER, "Aw, look at you!", true, Roles.DOGHANDLER)
            await buttonOptions(['...'])
            return menu()
        } else {
            DISPLAY.innerHTML = ``
            displayAdd(`You viciously rip apart one of the dogs cowering away from you with tendrils shooting out of your maw,
                then slowly drag the corpse back to eat them.`)
            displayDialogue(DATA.assigned.DOGHANDLER, "Wha- What the fuck?!", true, Roles.DOGHANDLER)
            displayAdd(`Panicked, ${DATA.assigned.DOGHANDLER} reaches for a shotgun propped up by the wall and aims it towards you.`)
            displayDialogue(DATA.assigned.DOGHANDLER, `I canNOT be having that here! Die you stupid son of a-`, true, Roles.DOGHANDLER)

            let sel = await buttonOptions(['Stand still and enjoy your meal', `Lunge towards ${DATA.assigned.DOGHANDLER} with your tendrils`])
            if (sel == 0) {
                DATA.people.forEach(person => {
                    addAwareness(person, 10)
                })
                displayAdd(`${DATA.assigned.DOGHANDLER} fires the shotgun.`)
                displayDialogue(DATA.assigned.DOGHANDLER, `-bitch!`, true, Roles.DOGHANDLER)
                displayAdd(`The pellets tear you to little pieces of meat, which then start slowly sliding towards ${DATA.assigned.DOGHANDLER}.`)
                displayDialogue(DATA.assigned.DOGHANDLER, `A-are you fucking kidding me right now!?!`, true, Roles.DOGHANDLER)
                displayAdd(`Despite their attempts to flee, they trip and fall and eventually parts of your body finally reach them, enveloping them
                    more and more until you have completely covered them in your mass.`)
            } else {
                displayAdd(`Right before ${DATA.assigned.DOGHANDLER} can pull the trigger, your tendrils reach his arms and tear them off `)
                displayDialogue(DATA.assigned.DOGHANDLER, `AGh FUCK GODDAMNIT WTHAT THE FUCK FUCK NO`, true, Roles.DOGHANDLER)
                displayAdd(`Before they can utter another word, you rip their head off and forcefully drag them through the bars to feed on.
                    Having gotten stronger, you are now free to leave the cage.`)
            }
            findPerson(DATA.assigned.DOGHANDLER).status = Status.INFECTED
            DATA.people[0].status = Status.DEAD
            DATA.host = DATA.assigned.DOGHANDLER
            saveState()
            await buttonOptions(['Escape'])
            return menu()
        }
    }
}

waitForData()