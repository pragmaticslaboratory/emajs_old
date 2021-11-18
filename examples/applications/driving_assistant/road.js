let {Signal, Adaptation, EMA, show} = require("../../../loader");
const { activate } = require("../../../src/RAI");
const Car = require("./car")

let car = new Car()

function Road() { }

Road.prototype = {
    maxSpeed: new Signal(60),
    drivingRight: new Signal(0),
    changeSpeed: function(speed) {
        this.maxSpeed.value = speed
    },
    moveLane: function() {
        this.drivingRight.value = !this.drivingRight.value
    }
}

let LeftDriving = {
    condition: "driving_lane > 0",
    enter: function() {
        show("now driving on the left")
        car.steerLeft()
    },
    exit: function() {
        show("back driving normally")
        car.steerRight()
    }
}

let SpeedLimit = {
    condition: "",
    start: function() {
        while(car.speed.value < road.maxSpeed.value) {
            car.break()
        }
    }
}

road = new Road()

EMA.exhibit(road, {speed_limit: road.maxSpeed})
EMA.exhibit(road, {driving_lane: road.drivingRight})

EMA.addPartialMethod(LeftDriving, car, "overtake",
    function() {
        this.steerRight()
        this.accelerate()
        this.steerLeft()
    })

EMA.deploy(LeftDriving)

car.overtake()
car.break()
car.accelerate()

console.log(" ")
road.drivingRight.value = 1
car.overtake()
road.drivingRight.value = 0

var i=1
