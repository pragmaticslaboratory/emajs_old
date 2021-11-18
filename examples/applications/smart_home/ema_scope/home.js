let {Signal, Adaptation, EMA, show} = require("../../../../loader");
const { scope } = require("../../../../src/RAI");
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
        show("RINGING");
    },
    exit: function() {
        show("NO RING NO MORE");
    }
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

EMA.exhibit(Room, {occupied: Room.users});
EMA.exhibit(Appliance, {on: Appliance.state});

EMA.addPartialMethod(InUse, Appliance, "playSound",
    function(_param) {
            show("not advertising with sound as is already in use")
});

EMA.addPartialMethod(Advertice, Home, "doorBell", 
    function() {
        Home.rooms.forEach( r => {
            console.log(`room ${r.name}`)
            r.playSound()
        });
        //console.log(`Esta es la adaptación: ${Adaptation}`)
        //Adaptation.proceed();   
    }
);

EMA.addPartialMethod(Advertice, Room, "playSound",
    function() {
        console.log("adapted playsound");
        Room.appliances.forEach( a => {
            a.playSound("Advertise")
            console.log(`ring alarm for ${Room.name} on: ${a.name}`)
        })
});

home = Object.create(Home);

function startHome(h) {
    let kitchen = Object.create(Room); 
    kitchen.addAppliance(radio);
    h.addRoom(kitchen, "kitchen");
    bedroom = Object.create(Room);
    bedroom.addAppliance(tv);
    h.addRoom(bedroom, "bedroom");
    let livingroom = Object.create(Room);
    livingroom.addAppliance(soundBar);
    h.addRoom(livingroom, "livingroom");
    let bathroom = Object.create(Room);
    bathroom.addAppliance(radio);
    h.addRoom(bathroom, "bathroom");
    let hall = Object.create(Room);
    hall.addAppliance(doorChime);
    h.addRoom(hall, "hall");
}
startHome(home);

home.doorBell();

console.log(" ")
EMA.scope(AdverticeCondition)
bedroom.userEnter() //updates the signal

home.doorBell()

/*
console.log(" ")
tv.state.value = 1
tv.setVolume(21)
home.doorBell()
*/