let {Signal, Adaptation, EMA, show} = require("../../../loader");
const { activate } = require("../../../src/RAI");

function Appliance(name, location, state = false, volume = 0) {
    this.name = name
    this.state = new Signal(0)
    this.volume = Math.min(volume, 100)
    this.location = location
    //console.log(this)
}

Appliance.prototype = {
    name: "",
    volume: 0, //max level 100%
    location: "",
    state: new Signal(0), //1 = on or 0 = off
    switch: function() {
        this.state.value = !this.state.value
    },
    setVolume: function(level) {
        this.volume = level
    },
    setLocation: function(roomName) {
        this.location = roomName
    },
    playSound: function(message) {
        console.log(`${message} output on ${this.location}'s ${this.name} at ${this.volume}%`)
    }
}

module.exports = Appliance