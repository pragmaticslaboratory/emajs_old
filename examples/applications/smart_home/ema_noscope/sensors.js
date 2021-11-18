let {Signal, Adaptation, EMA, show} = require("../loader");
const { activate } = require("../src/RAI");

LuminositySensor = {
    //luminosity from 0% to 100%
    value: new Signal(100)
}

TimeOfDay = {
    //1: Morning, 2:Afternoon, 3:Evening
    timeOfDay = new Signal(1)
}