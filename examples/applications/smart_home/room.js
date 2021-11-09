const { Signal } = require("../../../loader")

function Room(name, appliances = []) {
    this.name = name
    this.appliances = appliances
}

Room.prototype = {
    appliances: [],
    name: "",
    users: new Signal(0),
    userEnter: function() {
        this.users.value += 1
    }, playSound: function() {},
    userExit: function() {
        this.users.value = Math.max(0, this.users.value - 1)        
    },
    getAppliance: function(name) {
        return this.appliances.filter( app => app.name == name)[0]
    }
}

module.exports = Room