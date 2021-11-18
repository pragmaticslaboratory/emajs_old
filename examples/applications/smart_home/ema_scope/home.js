let {Signal, Adaptation, EMA, show} = require("../../../../loader");
const { activate } = require("../../../../src/RAI");
const Room = require("./room");
const Appliance = require("./appliance");


let doorChime = Object.create(Appliance);
doorChime.defineProperties("chime", "hall", 100);
let tv = Object.create(Appliance);
tv.defineProperties("tv", "bedroom");
let soundBar = Object.create(Appliance);
soundBar.defineProperties("Sound Bar", "Living Room");
let radio = Object.create(Appliance);
radio.defineProperties("Radio", "Kitchcen")


let bedroom;

function startHome(home) {
    let kitchen = Object.create(Room); 
    kitchen.addAppliance(radio);
    home.addRoom(kitchen, "kitchen");
    bedroom = Object.create(Room);
    bedroom.addAppliance(tv);
    home.addRoom(bedroom, "bedroom");
    let livingroom = Object.create(Room);
    livingroom.addAppliance(soundBar);
    home.addRoom(livingroom, "livingroom");
    let bathroom = Object.create(Room);
    bathroom.addAppliance(radio);
    home.addRoom(bathroom, "bathroom");
    let hall = Object.create(Room);
    hall.addAppliance(doorChime);
    home.addRoom(hall, "hall");
}

Home = {
    rooms: [],
    addRoom: function(room, name = room.name) {
        room.name = name;
        this.rooms.push(room)
    }, 
    doorBell: function() {
        show("Silent door ring")
    }
}

AdverticeCondition = "occupied > 0"
let Advertice = EMA.layer({
    condition: AdverticeCondition,
    enter: function() {
        show("RINGING")
    },
    /*scope: function(funName, obj) {
        return !(funName === "playSound" && obj.users._value > 0)
    }*/
});

InUseCondition = "on > 0"
let InUse = EMA.layer({
    condition: InUseCondition,
    enter: function() {
        show("ADAPTING THE RING FUNCTION")
    }/*,
    scope: function(funName, obj) {
        return !(funName === "playSound");
    }*/
});

let home = Object.create(Home); 
startHome(home);

EMA.exhibit(tv, {on: tv.state})

EMA.addPartialMethod(InUse, Appliance, "playSound",
    function(_param) {
            show("not advertising with sound as is already in use")
});

EMA.exhibit(Room, {occupied: Room.users});
EMA.addPartialMethod(Advertice, Room, "playSound",
    function() {
        this.appliances.forEach( a => {
            a.playSound("Advertise")
            console.log(`ring alarm  ${this.name} on: ${a.name}`)
        })
});

EMA.addPartialMethod(Advertice, Home, "doorBell", 
    function() {
        home.rooms.forEach( r => {
            console.log(`room ${r.name}`)
            r.playSound()
        })
        Adaptation.proceed()
});

EMA.deploy(Advertice)

home.doorBell()

console.log(" ")
bedroom.userEnter() //updates the signal
EMA.scope(AdverticeCondition)
home.doorBell()

/*
console.log(" ")
tv.state.value = 1
tv.setVolume(21)
home.doorBell()
*/