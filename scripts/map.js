let MAP = {
    outside: {
        name: "Outside",
        connecting: ["shed"],
        present: []
    },

    shed: {
        name: "Shed",
        connecting: ["outside"],
        present: []
    },

    lefthall: {
        name: "Left Wing Hallway",
        connecting: ["outside", "midhall"],
        present: []
    },
    midhall: {
        name: "Middle Hallway",
        connecting: ["lefthall", "righthall"],
        present: []
    },
    righthall: {
        name: "Right Wing Hallway",
        connecting: ["midhall", "outside"],
        present: []
    },


    manageroffice: {
        name: "Manager's Office",
        connecting: ["lefthall"],
        present: []
    },
    supply1: {
        name: "Supply Room 1",
        connecting: ["lefthall"],
        present: []
    },
    recroom: {
        name: "Rec Room",
        connecting: ["lefthall"],
        present: []
    },
    kennel: {
        name: "Kennel",
        connecting: ["lefthall"],
        present: []
    }
}

function getLocationName(loc) {
    return MAP[loc].name
}