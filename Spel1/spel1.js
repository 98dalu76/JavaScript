//Saving the canvas and its content to variables
var bg = document.getElementById("bg"),
    fg = document.getElementById("fg"),
    ffg = document.getElementById("ffg");

var bg_ctx = bg.getContext("2d"),
    fg_ctx = fg.getContext("2d"),
    ffg_ctx = ffg.getContext("2d");

//Setting the canvas dimensions to the maximum available size within the window
bg_ctx.canvas.width = window.innerWidth;
bg_ctx.canvas.height = window.innerHeight;

//Setting the height and width of the canvas to variables
var dimX = bg_ctx.canvas.width,
    dimY = bg_ctx.canvas.height;

//Adding event handlers for the keys
document.getElementById("main").addEventListener("keydown", function () {
    keyDown(event);
});

//Initializing secondary canvases
var init = function (ctx) {
    ctx.canvas.width = dimX;
    ctx.canvas.height = dimY;
}

init(fg_ctx);
init(ffg_ctx);

var drawPlayerWidget = function (ctx) {
    //fg_ctx.clearRect(0, 0, 100, 100);

    //Drawing player widget
    ctx.strokeStyle = "#FFFFFF";
    ctx.strokeText("Player 1: ", 20, 30);
    ctx.strokeText("Player 2: ", 20, 50);

    ctx.beginPath();

    ctx.lineWidth = 10;

    ctx.moveTo(65, 27);
    ctx.lineTo(100, 27);

    ctx.strokeStyle = p1C;
    ctx.stroke();

    ctx.closePath();

    ctx.beginPath();

    ctx.lineWidth = 10;

    ctx.moveTo(65, 47);
    ctx.lineTo(100, 47);

    ctx.strokeStyle = p2C;
    ctx.stroke();

    ctx.closePath();
}

//Returns random X and Y-values
var randPos = function (axis) {
    return (Math.floor(Math.random() * ((axis - 100) - 100 + 1) + 100));
}

var randNum = function (max, min) {
    return (Math.floor(Math.random() * (max - min + 1)) + min);
}

//Returns random hex color
var randColor = function () {
    return '#' + Math.floor(Math.random() * 16777215).toString(16)
}

//Adding starting dimensions for the players
var p1X = 0,
    p1Y = 0;
var p2X = 0,
    p2Y = 0;

//Adding arrays for storing line areas
var p1P = [[], []],
    p2P = [[], []];

//Adding speeds for the players
var p1VX = 1,
    p1VY = 1;
var p2VX = 1,
    p2VY = 1;

//Setting random speeds for the players
var setRandSpeed = function (player) {
    var n = randNum(-2, 2);
    if (n === -1 ||  n === 1) {
        window[player + "VX"] = 0;
        window[player + "VY"] = n;
    } else if (n === 0 ||  n === 2) {
        window[player + "VY"] = n - 1;
        window[player + "VY"] = 0;
    }
}

//Adding colors for the players
var p1C = randColor(),
    p2C = randColor();

//Adding scores for the players
var p1S = 0,
    p2S = 0;

var paintPlayers = function (ctx) {
    //Drawing player 1
    ctx.beginPath();
    ctx.arc(p1X, p1Y, 5, 0, Math.PI * 2);

    ctx.strokeStyle = p1C;
    ctx.stroke();
    ctx.closePath();

    //Drawing player 2
    ctx.beginPath();
    ctx.arc(p2X, p2Y, 5, 0, Math.PI * 2);

    ctx.strokeStyle = p2C;
    ctx.stroke();
    ctx.closePath();

    //Adding player 1 coords to array
    p1P[0].push(p1X);
    p1P[1].push(p1Y);

    //Moving player 1
    p1X += p1VX;
    p1Y += p1VY;

    //Adding player 2 coords to array
    p2P[0].push(p2X);
    p2P[1].push(p2Y);

    //Moving player 2
    p2X += p2VX;
    p2Y += p2VY;
}

//Drawing the yellow circle on the players position
var drawPlayerCircle = function (ctx) {
    //Setting color to yellow
    ctx.fillStyle = "yellow";

    //Drawing player circle
    ctx.beginPath();
    ctx.arc(p1X, p1Y, 5, 0, Math.PI * 2);
    ctx.fill();
    ctx.closePath();

    ctx.beginPath();
    ctx.arc(p2X, p2Y, 5, 0, Math.PI * 2);
    ctx.fill();
    ctx.closePath();
}

var reset = function () {
    //Clearing up from last game
    bg_ctx.clearRect(0, 0, dimX, dimY);

    //Adding starting dimensions for the players
    p1X = randPos(dimX), p1Y = randPos(dimY);
    p2X = randPos(dimX), p2Y = randPos(dimY);

    setRandSpeed("p1");
    setRandSpeed("p2");

    //Adding arrays for storing line areas
    p1P = [[p1X], [p1Y]], p2P = [[p2X], [p2Y]];
}

//Checking for collisions
var colDetection = function () {
    for (var i = 0; i < p1P[0].length; i++) {
        //Player 2 with player 1
        if (p1P[0][i] === p2X && p1P[1][i] === p2Y) {
            reset();
        }
        //Player 1 with player 2
        if (p2P[0][i] === p1X && p2P[1][i] === p1Y) {
            reset();
        }
        //Player 1 with self
        if (p1P[0][i] === p1X && p1P[1][i] === p1Y) {
            reset();
        }
        //Player 2 with self
        if (p2P[0][i] === p2X && p2P[1][i] === p2Y) {
            reset();
        }
    }
    //Player 1 with wall
    if (p1X >= dimX - 4 || p1X <= 4 || p1Y >= dimY - 4 || p1Y <= 4) {
        reset();
    }
    //Player 2 with wall
    if (p2X >= dimX - 4 || p2X <= 4 || p2Y >= dimY - 4 || p2Y <= 4) {
        reset();
    }
}

//Updating the canvas
var update = function (colReturn) {
    paintPlayers(bg_ctx);

    fg_ctx.clearRect(0, 0, dimX, dimY);
    drawPlayerCircle(fg_ctx);

    colDetection();

    requestAnimationFrame(update);
}

var keyDown = function (e) {
    if (e.keyCode === 65) {
        if (p1VX === 1 && p1VY === 0) {
            p1VX = 0;
            p1VY = -1;
        } else if (p1VX === 0 && p1VY === 1) {
            p1VX = 1;
            p1VY = 0;
        } else if (p1VX === -1 && p1VY === 0) {
            p1VX = 0;
            p1VY = 1;
        } else if (p1VX === 0 && p1VY === -1) {
            p1VX = -1;
            p1VY = 0;
        }
    } else if (e.keyCode === 68) {
        if (p1VX === 1 && p1VY === 0) {
            p1VX = 0;
            p1VY = 1;
        } else if (p1VX === 0 && p1VY === 1) {
            p1VX = -1;
            p1VY = 0;
        } else if (p1VX === -1 && p1VY === 0) {
            p1VX = 0;
            p1VY = -1;
        } else if (p1VX === 0 && p1VY === -1) {
            p1VX = 1;
            p1VY = 0;
        }
    }

    if (e.keyCode === 37) {
        if (p2VX === 1 && p2VY === 0) {
            p2VX = 0;
            p2VY = -1;
        } else if (p2VX === 0 && p2VY === 1) {
            p2VX = 1;
            p2VY = 0;
        } else if (p2VX === -1 && p2VY === 0) {
            p2VX = 0;
            p2VY = 1;
        } else if (p2VX === 0 && p2VY === -1) {
            p2VX = -1;
            p2VY = 0;
        }
    } else if (e.keyCode === 39) {
        if (p2VX === 1 && p2VY === 0) {
            p2VX = 0;
            p2VY = 1;
        } else if (p2VX === 0 && p2VY === 1) {
            p2VX = -1;
            p2VY = 0;
        } else if (p2VX === -1 && p2VY === 0) {
            p2VX = 0;
            p2VY = -1;
        } else if (p2VX === 0 && p2VY === -1) {
            p2VX = 1;
            p2VY = 0;
        }
    }
}

drawPlayerWidget(ffg_ctx);

reset();

update();
