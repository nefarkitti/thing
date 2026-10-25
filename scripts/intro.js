async function intro() {

    let FIRST = ["MECHANIC", "COOK", "CREWMEMBER"].random()

    let assignedKEYS = Object.keys(DATA.assigned)

    DISPLAY.innerHTML = ""

    DISPLAY.innerHTML = `
    <p>
    Unidentified Extraterrestial Parasite v1.0.0
    </p>
    I turned John Carpenter's "The Thing" into a browser game. <br>
    I don't own the concept. Nor will I ever claim to. <br>
    This was just a fun thing to make for halloween. <br>
    Play as the elusive Unidentified Extraterrestial Parasite (or U.E.P.!),
    which has the mission of spreading itself across all humanity. But before you can do that,
    you have to get out of the South Greenland ARCANA Research Facility first!
    <hr>
    <hr style="filter:opacity(0%)">
    `

    await buttonOptions(['PLAY'])

    DISPLAY.innerHTML = ""

    displayDialogue("???", 'Älä päästä tuota koiraa laboratorioon!', false, Roles.OTHERRESEARCHER)

    await buttonOptions(['Run'])

    displayDialogue(DATA.assigned.RADIOOPERATOR, 'Huh?', true, Roles.RADIOOPERATOR)

    await buttonOptions(['Run'])

    displayDialogue("???", "Mä sanoin, että älä päästä tuota juttua laboratorioon!", false, Roles.OTHERRESEARCHER)

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

    await buttonOptions(['...'])

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

    await buttonOptions(['Begin.'])

    DATA.seeintro = 1
    DATA.day++
    DATA.people.forEach(person=>{
        if (person.role == Roles.DOG) return;
        person.location = "manageroffice"
    })
    findPerson(DATA.assigned.DOGHANDLER).location = "kennel"

    saveState()

    /*displayAdd(`<h4>Location: Kennel</h4>`)

    DISPLAY.appendChild(listPeople())

    displayAdd(`<p>You can only infect one.</p>`)

    DISPLAY.appendChild(buttonOptions("inf", getPeopleNamesArray()))*/

}