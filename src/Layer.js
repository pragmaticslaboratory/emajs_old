const SignalComp = require('./SignalComp');

//Just avoid writing many times an empty function
let emptyFunction = function () {
};

function getCallStack() {
    let stack = [];
    let caller = getCallStack.caller;

    while (caller !== null) {
        stack.push(caller.name);
        //console.log("f:"+caller);
        caller = caller.caller;
        //console.log("f_DESPUES:"+caller);
    }
    return stack;
}

function filterScope(f) {
    //console.log("FFF1:"+filterScope.caller);
    //console.log("FFF2:"+arguments.callee.caller);
    let stack = getCallStack();
    //console.trace();
    console.log(stack);
    return stack.some(funName => f(funName));
}

function arraysEqual(a, b) {
    if (a === b) return true;
    if (a == null || b == null) return false;
    if (a.length !== b.length) return false;

    for (var i = 0; i < a.length; ++i) {
        if (a[i] !== b[i]) return false;
    }
    return true;
}


function Layer(adap) {
    Object.defineProperty(this, 'name', {
        set: function (name) {
            this._name = name;
        },
        get: function () {
            return this._name;
        }
    });

    Object.defineProperty(this, 'condition', {
        get: function () {
            return this._cond;
        }
    });

    this.cleanCondition = function () { //this method is reused when you re-init the condition
        this._cond = new SignalComp(this._cond.expression);
    };

    this.addVariation = function (obj, methodName, variation, originalMethod) {
        this._variations.push([obj, methodName, variation, originalMethod]);
    };

    this._installUniqueVariations = function(scope) {
        this._installVariations(scope);
        this._variations.forEach(function (variation) {
            let obj = scope || variation[0];
            let objectInstances = []
            if (scope) {
                objectInstances.push(["scopeInstance", scope])
            } else {
                let entries = Object.entries(global)
                let prototypeKeys = Object.keys(obj)
                entries.forEach(entry => {
                    let objectKeys = Object.keys(entry[1].__proto__)
                    if (arraysEqual(objectKeys, prototypeKeys))
                        objectInstances.push(entry)
                });
            }
            objectInstances.forEach(instance => {
                let object = instance[1];
                Object.defineProperty(object, '__unique', { value: true, writable: false });
            });
        });
    }

    this._installVariations = function (scope) {
        let thiz = this;
        this._variations.forEach(function (variation) {
            let obj = scope || variation[0];
            let methodName = variation[1];
            let variationMethod = variation[2];
            let originalMethod = variation[3];
            let objectInstances = []
            /*if (scope) {
                //objectInstances.push(["scopeInstance", scope])
            } else {
                let entries = Object.entries(global)
                let prototypeKeys = Object.keys(obj)
                entries.forEach(entry => {
                    let objectKeys = Object.keys(entry[1].__proto__)
                    if (arraysEqual(objectKeys, prototypeKeys))
                        objectInstances.push(entry)
                });
            }*/
            if(!obj.__unique) {
                obj[methodName] = function () {
                    Layer.proceed = function () {
                        return originalMethod.apply(obj, arguments);
                    };

                    //magic!!!!
                    Object.defineProperty(arguments.callee, "name", { get: function () { return methodName; } });

                    let result;
                    //console.log(["MOSTRANDO STACK", getCallStack()]);
                    if (typeof (thiz._scope) === "function" && !filterScope(thiz._scope)) {
                        result = originalMethod.apply(obj, arguments);
                    } else {
                        result = variationMethod.apply(obj, arguments);
                    }

                    //Layer.proceed = undefined;
                    return result;
                };
            }
            //});
            /*
            objectInstances.forEach(instance => {
                let object = instance[1]
                if(!object.__unique) {
                    object[methodName] = function () {
                        Layer.proceed = function () {
                            return originalMethod.apply(object, arguments);
                        };

                        //magic!!!!
                        Object.defineProperty(arguments.callee, "name", { get: function () { return methodName; } });

                        let result;
                        //console.log(["MOSTRANDO STACK", getCallStack()]);
                        if (typeof (thiz._scope) === "function" && !filterScope(thiz._scope)) {
                            result = originalMethod.apply(object, arguments);
                        } else {
                            result = variationMethod.apply(object, arguments);
                        }

                        Layer.proceed = undefined;
                        return result;
                    };
                }
            });*/
        });
    };

    this._uninstallUniqueVariations = function(scope) {
        this._uninstallVariations(scope)
        let obj = scope || variation[0];
        let prototypeKeys = Object.keys(obj);
        let entries = Object.entries(global);
        entries.forEach(entry => {
            let objectKeys = Object.keys(entry[1].__proto__)
            if(arraysEqual(objectKeys, prototypeKeys))
                delete entry[1]['__unique']
        });
    }

    this._uninstallVariations = function (scope) {
        this._variations.forEach(function (variation) {
            let obj = scope || variation[0];
            let methodName = variation[1];
            let originalMethod = variation[3];
            if (scope)
                scope[methodName] = originalMethod
            else {
                let prototypeKeys = Object.keys(obj);
                let entries = Object.entries(global);
                entries.forEach(entry => {
                    let objectKeys = Object.keys(entry[1].__proto__)
                    if (arraysEqual(objectKeys, prototypeKeys))
                        entry[1][methodName] = originalMethod;
                });
            }
        });
    };

    this.enableCondition = function () { //todo: when a condition is added, Should it check its predicate?
        let thiz = this;
        this._cond.on(function (active) {
            if (active !== thiz._active) {
                thiz._active = active;
            }
        });
    };

    this.isActive = function () { //This may be used only for debugging
        return this._active;
    };

    this.addSignal = function (signal) {
        this._cond.addSignal(signal);
    };

    //this._cond = adapt.condition || emptyFunction;
    this._cond = adap.condition === undefined ?
        new SignalComp("false") : typeof (adap.condition) === "string" ?
            new SignalComp(adap.condition) : adap.condition; //it should be already a signal composition

    this._enter = adap.enter || emptyFunction;
    this._exit = adap.exit || emptyFunction;
    this._active = false;
    this._name = adap.name || "_";
    this._scope = adap.scope || false;
    this.__original__ = adap;

    this._variations = [];
    this.enableCondition();
    //}
}

module.exports = Layer;


