async function intro() {

    let FIRST = ["MECHANIC", "COOK", "CREWMEMBER"].random()

    let assignedKEYS = Object.keys(DATA.assigned)

    DISPLAY.innerHTML = ""

    displayDialogue("???", 'Älä päästä tuota koiraa laboratorioon!')

    await buttonOptions(['Run'])

    displayDialogue(DATA.assigned.RADIOOPERATOR, 'Huh?', true, Roles.RADIOOPERATOR)

    await buttonOptions(['Run'])

    displayDialogue("???", "Mä sanoin, että älä päästä tuota juttua laboratorioon!")

    await buttonOptions(['Run'])

    displayDialogue(DATA.assigned.RADIOOPERATOR, `I can't understand you at all man!`, true, Roles.RADIOOPERATOR)

    await buttonOptions(['Run'])

    displayDialogue(DATA.assigned.RADIOOPERATOR, `Commander, there's some guy yelling at us through the radio.`, true, Roles.RADIOOPERATOR)

    await buttonOptions(['Run'])

    displayDialogue(DATA.assigned.COMMANDER, `Eh, it's probably nothing. Might just be tryna warn us about a blizzard or somethin'`, true, Roles.COMMANDER)

    await buttonOptions(['Scratch at the door'])

    DISPLAY.innerHTML = ``

    displayAdd(`You scratch at the door.`)

    displayDialogue(DATA.assigned[FIRST], `Hey! There's something at the door!`, true, findPerson(DATA.assigned[FIRST]).role)

    await buttonOptions(['...'])

    displayDialogue(DATA.assigned.COMMANDER, `Well then go and see what it is!`, true, Roles.COMMANDER)

    displayAdd(`The door opens,`)

    let a = await buttonOptions([`Leap onto ${DATA.assigned[FIRST]}`, `(10%) Run into the building`])

    let victim

    if (a == 1 && Math.random() >= 0.1) {
        victim = DATA.assigned[assignedKEYS.random()]
        displayAdd(` and you run into the building, leaping onto ${victim}.`)
    } else {
        victim = DATA.assigned[FIRST]
        displayAdd(` and you leap onto ${victim}.`)
    }
    let findVictim = findPerson(victim)

    displayDialogue(victim, `Ugh! Get this thing off me!`, true, findVictim.role)

    await buttonOptions(['Lick their face.'])
    displayAdd(`You start aggressively licking the face of ${victim}.`)
    findVictim.status = Status.INFECTED

    displayDialogue(DATA.assigned.COMMANDER, "Take this thing to the kennel with the rest of em right now!", true, Roles.COMMANDER)

    DISPLAY.innerHTML = ``

    displayAdd(`The cage door shuts into place and ${DATA.assigned.DOGHANDLER} locks the padlock.`)

    await buttonOptions(['Bark'])

    displayDialogue("Dog", "Woof!", false, Roles.DOG)

    displayDialogue(DATA.assigned.DOGHANDLER, `That's it then. What're we gonna do with it?`, true, Roles.DOGHANDLER)

    await buttonOptions(['...'])

    displayDialogue(DATA.assigned.COMMANDER, 
        `It could be useful for any future sleddin'. We'll keep it here for now to make sure it's not diseased or somethin'.`,
    true, Roles.COMMANDER)

    //

    DATA.seeintro = 1
    DATA.day++

    await buttonOptions(['Begin.'])

    saveState()

    /*displayAdd(`<h4>Location: Kennel</h4>`)

    DISPLAY.appendChild(listPeople())

    displayAdd(`<p>You can only infect one.</p>`)

    DISPLAY.appendChild(buttonOptions("inf", getPeopleNamesArray()))*/

}