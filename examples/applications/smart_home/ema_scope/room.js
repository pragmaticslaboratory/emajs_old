const { Signal } = require("../../../../loader")

Room = {
    appliances: [],
    name: "",
    users: new Signal(0),
    userEnter: function() {
        this.users.value += 1
    }, playSound: function() {},
    userExit: function() {
        this.users.value = Math.max(0, this.users.value - 1)        
    },
    addAppliance: function(app) {
        this.appliances.push(app);
    },
    getAppliance: function(name) {
        return this.appliances.filter( app => app.name == name)[0]
    }
};

module.exports = Room