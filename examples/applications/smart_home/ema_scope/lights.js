let {Signal, Adaptation, EMA, show} = require("../loader");
const { activate } = require("../src/RAI");

Lights = {
    level: 0,
    sensors: [],
    setLevel: function(newLevel) {
        this.level = newLevel
    },
    addSensor: function(sensor) {
        this.sensors.push(sensor)
    }
}



User = {
    percentage: 76
}

EveningCondition = "timeOfDay = 3"
let EveningLights = EMA.layer({
    condition: EveningLights,
    enter: function() {
        lights.setLevel(user.percentage)
    },
    exit: function() {
        ligths.setLevel(0)
    }
})

ProyectorCondition ="on = true"
let OnProyector = EMA.layer({
    condition:ProyectorCondition,
})

EMA.exhibit(LuminositySensor, {luminosity: LuminositySensor.value})
EMA.exhibit(TimeOfDay, {tod: TimeOfDay.timeOfDay})

EMA.addPartialMethod(OnProyector, Proyector, "cinema",
    function() {
        lights.setLevel(0);
        curtains.close();
    }
);

proyector = Object.create(Proyector)
lights = Object.create(Lights)
curtains = Object.create(Curtains)

show("Execution")
TimeOfDay.timeOfDay = 3;
proyector.turnOn();
proyector.cinema();