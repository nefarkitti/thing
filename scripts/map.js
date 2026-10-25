let MAP = {
    outside: {
        name: "Outside",
        desc: "",
        connecting: ["shed", "lefthall", "laundry"],
        present: []
    },

    shed: {
        name: "Shed",
        desc: "",
        connecting: ["outside"],
        present: []
    },

    lefthall: {
        name: "Left Wing Hallway",
        desc: "",
        connecting: ["outside", "midhall", "manageroffice", "kennel", "recroom", "supply1"],
        present: []
    },
    midhall: {
        name: "Middle Hallway",
        desc: "",
        connecting: ["lefthall", "righthall", "sleepquarters", "bathroom", "geologylab", "kitchen", "messhall", "infirmary"],
        present: []
    },
    righthall: {
        name: "Right Wing Hallway",
        desc: "",
        connecting: ["midhall", "outside", "specimenlab", "supply2", "maproom", "radioroom", "greenhouse"],
        present: []
    },

    //LEFTHALL
    manageroffice: {
        name: "Managers's Office",
        desc: "",
        connecting: ["lefthall"],
        present: []
    },
    supply1: {
        name: "Supply Room 1",
        desc: "",
        connecting: ["lefthall"],
        present: []
    },
    recroom: {
        name: "Rec Room",
        desc: "",
        connecting: ["lefthall"],
        present: []
    },
    kennel: {
        name: "Kennel",
        desc: "Dogs are kept here. You are not a dog.",
        connecting: ["lefthall"],
        present: []
    },
    //LEFTHALL
    //MIDHALL
    sleepquarters: {
        name: "Sleeping Quarters",
        desc: "",
        connecting: ["midhall"],
        present: []
    },
    bathroom: {
        name: "Bathroom",
        desc: "",
        connecting: ["midhall"],
        present: []
    },
    geologylab: {
        name: "Geology Lab",
        desc: "",
        connecting: ["midhall"],
        present: []
    },
    kitchen: {
        name: "Kitchen",
        desc: "",
        connecting: ["midhall"],
        present: []
    },
    messhall: {
        name: "Mess Hall",
        desc: "",
        connecting: ["midhall"],
        present: []
    },
    infirmary: {
        name: "Infirmary",
        desc: "",
        connecting: ["midhall"],
        present: []
    },
    //MIDHALL
    //RIGHTHALL
    specimenlab: {
        name: "Specimen Lab",
        desc: "",
        connecting: ["righthall"],
        present: []
    },
    supply2: {
        name: "Supply Room 2",
        desc: "",
        connecting: ["righthall"],
        present: []
    },
    maproom: {
        name: "Map Room",
        desc: "",
        connecting: ["righthall"],
        present: []
    },
    radioroom: {
        name: "Radio Room",
        desc: "",
        connecting: ["righthall"],
        present: []
    },
    greenhouse: {
        name: "Greenhouse",
        desc: "",
        connecting: ["righthall", "laundry"],
        present: []
    },
    //RIGHTHALL

    laundry: {
        name: "Laundry Room",
        desc: "",
        connecting: ["greenhouse", "outside"],
        present: []
    }

}

function getLocationName(loc) {
    return MAP[loc].name
}

function updateMap() {
    let locations = Object.keys(MAP)

    locations.forEach(location => {
        MAP[location].present = []
    })

    DATA.people.forEach(person => {
        MAP[person.location].present.push(person.name)
    })
}

function getPeopleNearYou() {

    let l = []

    MAP[findPerson(DATA.host).location].present.forEach(name=>{
        let person = findPerson(name)
        if (person != DATA.host && person.status == Status.ALIVE) {
            l.push(name)
        }
    })

    return l

}
