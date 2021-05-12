let Layer = require('./Layer');

class RAI {

    constructor() {
        if (!RAI.instance) {
            RAI.instance = this;
            this.init();
        }
        return RAI.instance;
    }

    init() {
        this._layers = []; //only layers
        this._signalInterfacePool = []; //objects x interface-object
        this._variations = []; //originalLayer x object x methodName x variation
        this._originalMethods = []; //object x name x original_method
    }

    layer(originalLayer) {
        let layer = new Layer(originalLayer);
        layer._name = layer._name !== "_" ? layer._name : "Layer_" + (this._layers.length + 1);
        this._layers.push(layer);
        
        //it is to know if signals are already send data
        this._receiveSignalsForSignalInterfaces(layer);
        return layer
    }

    deploy(originalLayer) {
        let layer = new Layer(originalLayer);
        layer._name = layer._name !== "_" ? layer._name : "Layer_" + (this._layers.length + 1);
        this._layers.push(layer);
        this._addSavedLayers(layer);

        //it is to know if signals are already send data
        this._receiveSignalsForSignalInterfaces(layer);
    }

    undeploy(originalLayer) {
        this._uninstallVariations(originalLayer);
        this._cleanSignalComposition(originalLayer);

        this._layers = this._layers.filter(function (layer) {
            return layer.__original__ !== originalLayer;
        });
    }

    _addSavedLayers(layer) {
        let variations = this._variations.filter(function (variation) {
            return layer === variation[0];
        });
        var thiz = this;
        variations.forEach(function (variation) {
            let obj = variation[1];
            let methodName = variation[2];
            let variationMethod = variation[3];

            thiz._addOriginalMethod(obj, methodName);
            let originalMethod = thiz._getOriginalMethod(obj, methodName);
            layer.addVariation(obj, methodName, variationMethod, originalMethod);
        });
    }

    _uninstallVariations(originalLayer) {
        this._layers.forEach(function (layer) {
            if (layer.__original__ === originalLayer) {
                layer._uninstallVariations();
            }
        });
    }

    exhibit(object, signalInterface) {
        this._addSignalInterface(object, signalInterface);
        this._addIdSignal(signalInterface);
        this._exhibitAnInterface(signalInterface);
    }

    addPartialMethod(layer, obj, methodName, variation) {
        this._variations.push([layer, obj, methodName, variation]);
        this._addSavedLayers(layer);
    }

    _receiveSignalsForSignalInterfaces(layer) {
        this._signalInterfacePool.forEach(function (si) {
            for (let field in si[1]) {
                if (si[1].hasOwnProperty(field)) {
                    layer.addSignal(si[1][field]);
                }
            }
        });
    }

    _addSignalInterface(object, signalInterface) {
        this._signalInterfacePool.push([object, signalInterface]);
    }

    _addIdSignal(signalInterface) {
        for (let field in signalInterface) {
            if (signalInterface.hasOwnProperty(field)) {
                signalInterface[field].id = field;
            }
        }
    }

    _exhibitAnInterface(signalInterface) {
        for (let field in signalInterface) {
            if (signalInterface.hasOwnProperty(field)) {

                this._layers.forEach(function (layer) {
                    layer.addSignal(signalInterface[field]);
                });
            }
        }
    }

    _addOriginalMethod(obj, methodName) {
        let originalMethod = this._getOriginalMethod(obj, methodName);

        if (originalMethod === undefined) {
            this._originalMethods.push([obj, methodName, obj[methodName]]);
        }
    }

    _getOriginalMethod(obj, methodName) {
        let found = this._originalMethods.find(function (tuple) {
            return obj === tuple[0] && methodName === tuple[1];
        });

        return found === undefined? undefined: found[2];
    }

    getLayers(filter) {
        filter = filter || function () {
            return true;
        };
        return this._layers.filter(filter);
    }

    getActiveLayers() {
        return this.getLayers(function (layer) {
            return layer.isActive()
        })
    };

    getInactiveLayers() {
        return this.getLayers(function (layer) {
            return !layer.isActive()
        })
    };

    _removingLayers(originalLayer) {
        this._variations = this._variations.filter(function (variation) {
            return originalLayer !== variation[0];
        });
    }

    _cleanSignalComposition(originalLayer) {
        let layer = this._layers.find(function (layer) {
            return layer.__original__ === originalLayer;
        });

        layer.cleanCondition();
    }

    //Activation methods
    //Act just for one of the layers satisfying the condition, the others use the opposite action
    unique(condition) {
        let layers = this._layers.filter(function(layer) {
            return layer._cond._expression == condition
        });
        let valid = [], invalid = []
        layers.forEach(layer => {
            if(layer.isActive())
                valid.push(layer)
            else
                invalid.push(layer)
        })
        return [valid, invalid]
    }

    //Act on maximum one of the layers
    atMostOne(condition) {
        let layers = this._layers.filter(function(layer) {
            return layer._cond == condition && layer.isActive()
        });
        let len = Math.floor(Math.random() * (layers.length + 1))
        return layers[len]
    }

    //Act on at least one layer
    atLeastOne(condition) {
        let layers = this._layers.filter(function(layer) {
            return layer._cond == condition && layer.isActive()
        });
        let split = Math.floor(Math.random() * (layers.length + 1));
        return [layers.slice(0, split), layers.slice(split)]
    }
    
    //Act on all layers
    allOf(condition) {
        return layers = this._layers.filter(function(layer) {
            return layer._cond == condition && layer.isActive()
        });
    }

    //Act for layers satisfying conditions within the range
    between(lower, higer) {

    }

    activate(layers, scope) {
        if(scope) {
            _scopedActivation(layers, scope);
        } else {
            if(Array.isArray(layers) && layers.length > 2) {
                //allOf, between
                for(const layer of layers) {
                    layer._enter();
                    layer._installVariations();
                }
            } else if(Array.isArray(layers) && layers.length == 2) {
                //unique, atLeasOne
                for(const layer in layers[0]) {
                    layer._scope = 
                    layer._enter();
                    layer._installVariations();
                }                    
                for(const layer in layers[1]) {
                    layer._exit();
                    layer._uninstallVariations();
                }
            } else if(Array.isArray(layers) && layers.length == 1) {
                //atMostone
                layers[0]._enter();
                layers[0]._installVariations();
            } else {//condition 
                let layer = this._layers.filter(function(layer) {
                    return layer._cond._expression == layers
                })
                layer[0]._enter();
                layer[0]._installVariations();
            }
        }
    }

    _scopedActivation(layers, scope) {
        if(Array.isArray(layers) && layers.length > 2) {
            //allOf, between
            for(const layer of layers) {
                layer._enter();
                layer._installVariations();
            }
        } else if(Array.isArray(layers) && layers.length == 2) {
            //unique, atLeasOne
            for(const layer in layers[0]) {
                layer._enter();
                layer._installVariations();
            }                    
            for(const layer in layers[1]) {
                layer._exit();
                layer._uninstallVariations();
            }
        } else if(Array.isArray(layers) && layers.length == 1) {
            //atMostone
            layers[0]._enter();
            layers[0]._installVariations();
        } else {//condition 
            let layer = this._layers.filter(function(layer) {
                return layer._cond._expression == layers
            })
            layer[0]._enter();
            layer[0]._installVariations();
        }
    }

    deactivate(layers, scope) {
        if(scope) {

        } else {

            let layer = this._layers.filter(function(layer) {
                return layer._cond._expression == layers
            })
            layer[0]._exit();
            layer[0]._uninstallVariations();
        }
    }
}

module.exports = new RAI();