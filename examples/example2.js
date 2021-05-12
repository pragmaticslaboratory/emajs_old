let {Signal, SignalComp, Adaptation, EMA, show} = require("../loader");

//Local activation
Battery = {
    name: "UMIDIGI",
    charge: new Signal(100),
    capacity: 5105,
    printName: function() {
        show(this.name);
    },
    graph: function() {
        show("High Performance");
    }
};

LowBatteryCondition = "level < 30"
let LowBattery = EMA.layer({
  condition: LowBatteryCondition,
  enter: function() {
    show("[LOW BATTERY] enter");
},
scope: function(funName, obj) {
  return !(funName === "display" && obj === videoGame);
}
});


EMA.exhibit(Battery, {level: Battery.charge});
EMA.addPartialMethod(LowBattery, Battery, "graph", function() {
    show("Low Performance in " + this.name);
    this.printName();
});

battery = Object.create(Battery);
battery2 = Object.create(Battery);
battery2.name = "UMIDIGI_2"


battery.graph();
battery.printName();

battery.charge.value = 20;
EMA.activate(LowBatteryCondition);
battery.graph();
battery2.graph();
EMA.deactivate(LowBatteryCondition);
battery.graph();
//EMA.activate(LowBatteryCondition, battery2);

