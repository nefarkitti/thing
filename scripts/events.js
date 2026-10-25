async function eventCheck(destination) {

    // ENTER OFFICE FIRST DAY
    if (DATA.day == 1 && destination == "manageroffice" && !DATA.events.includes("deliberation")) {
        DATA.events.push("deliberation")

        DISPLAY.innerHTML = ``

        displayAdd(`You enter the room full of people as they're discussing something.`)

        displayDialogue(DATA.assigned.COMMANDER, "So what are we going to do about the dog?", true, Roles.COMMANDER)

        await buttonOptions(['...'])
    }


}