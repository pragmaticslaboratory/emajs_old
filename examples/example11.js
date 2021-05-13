let {Signal, Adaptation, EMA, show} = require("../loader");
const { activate } = require("../src/RAI");

Screen = {
    gyroscope: new Signal(0),
    touched: new Signal(false),
    rotate: function() {
        show("Rotating");
    }
};

PlayerView = {
    display: function() {
        show("Showing a Movie");
    }
}

//this videoGame does not support landscape
VideoGame = {
    display: function() {
        show("Showing a Video Game");
    }
}

//adaptations
LandscapeCondition = "gyroLevel > 45"
let Landscape = EMA.layer({
    condition:  LandscapeCondition,
    enter: function () {
        console.log("ENTER LANDSCAPE TRANSITION");
        screen.rotate();
    },
    exit: function() {
        show("LEAVING LANDSCAPE LAND")
    },
    scope: function(funName, obj) {
        return !(funName === "display" && obj === videoGame);
    }
});

PortraitCondition = "gyroLevel <= 45"
let Portrait = EMA.layer({
    condition:  PortraitCondition,
    enter: function () {
        show("ENTER PORTRAIT TRANSITION");
        screen.rotate();
    },
    scope: function(funName, obj) {
        return !(funName === "display" && obj === videoGame);
    }
});

FixedCondition = "fixed"
let KeepOrientation = EMA.layer({
    condition: FixedCondition,
    enter: function() {
        show("FIXED OBJECT");
    },
    exit: function() {
        show("OBJECT NO LONGER FIXED");
    },
    scope: function(funName, obj) {
        return !(funName === "display" && obj === videoGame);
    }
});

EMA.exhibit(Screen, {gyroLevel: Screen.gyroscope});
EMA.exhibit(Screen, {fixed: Screen.touched});

EMA.addPartialMethod(Landscape, VideoGame, "display",
    function () {
        show("[HORIZONTAL] video game " + screen.gyroscope.value);
        Adaptation.proceed();

    }
);
EMA.addPartialMethod(Portrait, VideoGame, "display",
    function() {
        show("[VERTICAL] video game ");
        Adaptation.proceed();
    }
);

EMA.addPartialMethod(Landscape, PlayerView, "display",
    function() {
        show("[HORIZONTAL] movie " + screen.gyroscope.value);
        Adaptation.proceed();
    }
);

EMA.addPartialMethod(Portrait, PlayerView, "display",
    function() {
        show("[VERTICAL] movie ");
        Adaptation.proceed();
    }
);

EMA.addPartialMethod(KeepOrientation, PlayerView, "display",
    function() {
        show("[FIXED] movie is moved");
        Adaptation.proceed();
    }
);

EMA.addPartialMethod(KeepOrientation, VideoGame, "display",
    function() {
        show("[FIXED] game is NOT moved");
        Adaptation.proceed();
    }
);

videoGame = Object.create(VideoGame);
playerView = Object.create(PlayerView);
screen = Object.create(Screen);

//Running the example

playerView.display();

show("\nChange SmartPhone position");
screen.gyroscope.value = 60;
EMA.activate(LandscapeCondition);
playerView.display();
videoGame.display();
screen.gyroscope.value = 10;
EMA.deactivate(LandscapeCondition);
EMA.activate(PortraitCondition);
playerView.display();
videoGame.display();
screen.touched.value = true;
EMA.activate(EMA.unique(FixedCondition), playerView)
playerView.display();
videoGame.display();
screen.gyroscope.value = 60;
EMA.activate(LandscapeCondition);
playerView.display();
videoGame.display();
screen.touched.value = false;
EMA.deactivate(EMA.unique(FixedCondition), playerView)
playerView.display();