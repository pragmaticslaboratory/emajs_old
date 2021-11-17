let {Signal, Adaptation, EMA, show} = require("../loader");
const { activate } = require("../src/RAI");

Curtains = {
    state: true,
    sensors: [],
    close: function() {
        state = false
    },
    open: function() {
        state = true
    },
    addSensor: function(sensor) {
        this.sensors.push(sensor)
    }
}