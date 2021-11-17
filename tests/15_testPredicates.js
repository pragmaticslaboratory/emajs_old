let testCase = require('nodeunit').testCase;
const Adaptation = require('../src/Layer');
const EMA = require('../src/RAI');

module.exports = testCase({
    'setUp': function (test) {
        CSI.init();
        test();
    },
    'create': function (test) {
        let flags = [];
        let obj = {
            x: new Signal(9),
            m: function () {
                flags.push("original")
            },
        };

        let adap = {
            condition: "a > 1"
        };

        CSI.exhibit(obj, {a: obj.x});
        CSI.addPartialMethod(adap, obj, "m", function () {
            flags.push("variation")
        });
        CSI.deploy(adap);
        obj.m();
        test.deepEqual(flags, ["variation"]);

        test.done();
    },
    'unique-1': function (test) {
        let flags = [];
        let obj = {
            x: new Signal(-1),
            m: function () {
                flags.push("original");
            },
        };

        let adap = {
            condition: new SignalComp("a > 1")
        };

        CSI.exhibit(obj, {a: obj.x});
        CSI.addPartialMethod(adap, obj, "m", function () {
            flags.push("variation");
        });
        CSI.deploy(adap);
        obj.x.value = 10;
        obj.m();
        test.deepEqual(flags, ["variation"]);

        test.done();
    },
});