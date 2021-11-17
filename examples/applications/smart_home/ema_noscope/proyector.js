Proyector = {
    on: new Signal(false),
    turnOn: function() {
        this.on = true;
    },
    turnOff: function() {
        this.on = false;
    }
}