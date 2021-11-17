Battery = {
    name: "UMIDIGI",
    charge: 100,
    capacity: 5105,
    printName: function() {
        show(this.name);
    },
    graph: function() {
        show("High Performance");
    }
};

Person = {
    name: "Nicolas",
    printName: function() {
        show(this.name);
    },
    graph: function() {
        show("painting");
    }
};

battery = Object.create(Battery);
person1 = Object.create(Person);
person2 = Object.create(Person);

let vars = Object.keys(global)
let entries = Object.entries(global)
let protoKeys = Object.keys(Person)
entries.forEach(entry => {
    let objectKeys = Object.keys(entry[1].__proto__)
    if(arraysEqual(objectKeys, protoKeys))
        console.log("found a person")
});

function arraysEqual(a, b) {
    if (a === b) return true;
    if (a == null || b == null) return false;
    if (a.length !== b.length) return false;
  
    for (var i = 0; i < a.length; ++i) {
      if (a[i] !== b[i]) return false;
    }
    return true;
  }