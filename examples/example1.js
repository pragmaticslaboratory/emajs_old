let {Signal, SignalComp, Adaptation, EMA, show} = require("../loader");

//Global activation

Battery = {
    //constructor() {
        name: "UMIDIGI",
        charge: new Signal(100),
        capacity: 5105,
    //},
    graph: function() {
        show("High Performance");
    }
};
battery = Object.create(Battery);

LowBatteryCondition = "level < 30"
let LowBattery = EMA.layer({
  condition: LowBatteryCondition,
  enter: function() {
    show("[LOW BATTERY] enter");
    show(battery.capacity);
},
scope: function(funName, obj) {
  return !(funName === "display" && obj === videoGame);
}
});

EMA.exhibit(Battery, {level: Battery.charge});
EMA.addPartialMethod(LowBattery, Battery, "graph", function() {show("Low Performance")} );

battery.graph();

battery.charge.value = 20;
EMA.activate(LowBatteryCondition);

battery.graph();
