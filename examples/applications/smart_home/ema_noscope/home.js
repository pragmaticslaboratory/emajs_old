let {Signal, Adaptation, EMA, show} = require("../../../loader");
const { activate } = require("../../../src/RAI");
const Room = require("./room");
const Appliance = require("./appliance");


let doorChime = new Appliance("chime", "hall", true, 100)
let tv = new Appliance("tv", "bedroom")
let soundBar = new Appliance("Sound Bar", "Living Room")
let radio = new Appliance("Radio", "Kitchcen")

function Home() {
    let kitchen = new Room("kitchen", [radio])
    let bedroom = new Room("bedroom", [tv])
    let livingroom = new Room("living", [soundBar])
    let bathroom = new Room("bathroom", [radio])
    let hall = new Room("hall", [doorChime])
    this.rooms = [kitchen, bedroom, livingroom, bathroom, hall]
}

Home.prototype = {
    rooms: [],
    addRoom: function() {
        let r = new Room()
        this.rooms.push(r)
    }, 
    doorBell: function() {
        show("Silent door ring")
    }
}

let Advertice = {
    condition: "occupied > 0",
    enter: function() {
        show("RINGING")
    },
   /* scope: function(funName, obj) {
        return !(funName === "playSound" && obj.users._value > 0)
    }*/
}

InUseCondition = "on > 0"
let InUse = {
    condition: InUseCondition,
    enter: function() {
        show("ADAPTING THE RING FUNCTION")
    }
}

let home = new Home()
let bedroom = home.rooms[1]

EMA.exhibit(tv, {on: tv.state})

/*EMA.addPartialMethod(InUse, Appliance, "playSound",
    function(_param) {
        show("not advertising with sound as is already in use")
    })

EMA.addPartialMethod(InUse, radio, "playSound",
    function(_param) {
        show("not advertising with sound as is already in use")
    })
*/

home.rooms.forEach(r => {
    r.appliances.forEach( a => {
        EMA.addPartialMethod(InUse, a, "playSound",
        function(_param) {
            show("not advertising with sound as is already in use")
        })
})})

home.rooms.forEach( r => {
    EMA.exhibit(r, {occupied: r.users})
    EMA.addPartialMethod(Advertice, r, "playSound",
    function() {
        this.appliances.forEach( a => {
            a.playSound("Advertise")
            console.log(`ring alarm  ${this.name} on: ${a.name}`)
        })
    })
})

EMA.addPartialMethod(Advertice, home, "doorBell", 
    function() {
        home.rooms.forEach( r => {
            r.playSound()
        })
        //Adaptation.proceed()
    })


EMA.deploy(Advertice)
EMA.deploy(InUse)
home.doorBell()

console.log(" ")
bedroom.userEnter() //updates the signal
//home.doorBell()


console.log(" ")
tv.state.value = 1
tv.setVolume(21)
home.doorBell()
