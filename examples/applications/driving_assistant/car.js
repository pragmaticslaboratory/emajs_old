let {Signal, Adaptation, EMA, show} = require("../../../loader");
const { activate } = require("../../../src/RAI");

function Car() {
    this.speed = new Signal(60)
    this.lane = "right"
}

Car.prototype = {
    speed: new Signal(60),
    lane: "right",
    accelerate: function() {
        this.speed.value += 10
        show(`current speed up: ${this.speed.value}`)
    },
    break: function() {
        this.speed.value -= 10
        show(`current speed down: ${this.speed.value}`)
    },
    steerLeft: function() {
        this.lane = "left"
        show("MOVED TO THE LEFT LANE")
    },
    steerRight: function() {
        this.lane = "right"
        show("MOVED TO THE RIGHT LANE")
    },
    overtake: function() {
        this.steerLeft()
        this.accelerate()
        this.steerRight()
    }
}

module.exports = Car