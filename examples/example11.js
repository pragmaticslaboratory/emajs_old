let {Signal, Adaptation, EMA, show} = require("../loader");

let screen = {
    gyroscope: new Signal(0),
    rotate: function () {
        show("Rotating");
    }
};

let playerView = {
    display: function () {
        show("Showing a Movie");
    }
};

//this videoGame does not support landscape
let videoGame = {
    display: function() {
        show("Showing a Video Game");
    }
};

//adaptation
LandscapeCondition = "gyroLevel > 45"
let Landscape = {
    condition:  LandscapeCondition,
    enter: function () {
        console.log("ENTER TRANSITION");
        screen.rotate();
    },
    scope: function(funName, obj) {
        return !(funName === "display" && obj === videoGame);
    }
};

PortraitCondition = "gyroLevel < 45"
let Portrait = {
    condition:  PortraitCondition,
    enter: function () {
        console.log("ENTER TRANSITION");
        screen.rotate();
    },
    scope: function(funName, obj) {
        return !(funName === "display" && obj === videoGame);
    }
};

FixedCondition = "fixed"
let KeepOrientation = {
    condition: FixedCondition,
    enter: function() {
        console.log("FIXED OBJECT");
    },
    scope: function(funName, obj) {
        return !(funName === "display" && obj === videoGame);
    }
}

BetweenRange = ["gyroLevel > 45", "gyroLevel < 135"]

EMA.exhibit(screen, {gyroLevel: screen.gyroscope});

EMA.addPartialMethod(Landscape, playerView, "display",
    function () {
        show("[LAYER] Landscape Mode " + screen.gyroscope.value);
        Adaptation.proceed();

    }
);
EMA.addPartialMethod(Portrait, playerView, "display",
    function () {
        show("[VERTICAL] Portrait Mode " + screen.gyroscope.value);
        Adaptation.proceed();
    }
);

EMA.addPartialMethod(Landscape, videoGame, "display",
    function () {
    show("[HORIZONTAL] Landscape Mode " + screen.gyroscope.value);
        Adaptation.proceed();
    }
);

EMA.addPartialMethod(Portrait, videoGame, "display",
    function () {
        show("[VERTICAL] Portrait Mode " + screen.gyroscope.value);
        Adaptation.proceed();
    }
);

EMA.addPartialMethod(KeepOrientation, videoGame, "display",
    function () {
        show("[LAYER] Nothing is moved");
        Adaptation.proceed();
    }
);

EMA.deploy(Landscape);
EMA.deploy(Portrait);
EMA.deploy(KeepOrientation);
playerView.display();

show("\nChange SmartPhone position");
screen.gyroscope.value = 60;
playerView.display();
videoGame.display();
screen.gyroscope.value = 10;
playerView.display();
videoGame.display();
//activate(FixedCondition, playerView)
screen.gyroscope.value = 60;
playerView.display();
videoGame.display();
