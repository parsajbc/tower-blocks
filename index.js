var gamebase = [];
var block = null;
var score = 0;
var rockbottom;
var myScore;
var w = 500;
var part;
var end = true;
var inter;

document.getElementById("login-warning").style.top = (document.body.clientHeight * 0.5 - 75);
document.getElementById("login-warning").style.left = (document.body.clientWidth * 0.5 - 300);

var myGameArea = {
    canvas: document.createElement("canvas"),
    make: function () {
        this.canvas.width = (document.body.clientWidth);
        this.canvas.height = (document.body.clientHeight);
        this.canvas.getContext('2d').fillStyle = 'black';
        document.body.insertBefore(this.canvas, document.body.childNodes[0]);
        this.frameNo = 0;
        myScore = new component("30px", "Consolas", (document.body.clientWidth - 200), 125, "text");
        rockbottom = myGameArea.canvas.height - 60;
        end = false;
        updateGameArea();
    },
    start: function () {
        this.interval = setInterval(updateGameArea, 15);
    },
    clear: function () {
        this.canvas.getContext("2d").clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
}

function makeGame() {
    block = new component(w, 30, (document.body.clientWidth * 0.5 - w / 2), 10, "block");
    gamebase.push(new component(w, 30, (document.body.clientWidth * 0.5 - w / 2), (document.body.clientHeight - 30), "base"));
    myGameArea.make();
}

function startGame() {
    myGameArea.start();
}

function drop() {
    block.gravity = 0.5;
    block.speedX = 0;
}

function component(width, height, x, y, type) {
    this.type = type;
    this.width = width;
    this.height = height;
    this.speedY = 0;
    this.speedX = 5;
    this.x = x;
    this.y = y;
    this.gravity = 0;
    this.gravitySpeed = 0;
    this.update = function () {
        if (this.type == "block") {
            myGameArea.canvas.getContext("2d").fillStyle = "black";
        }
        if (this.type == "base") {
            myGameArea.canvas.getContext("2d").fillStyle = "brown";
        }
        if (this.type == "part") {
            myGameArea.canvas.getContext("2d").fillStyle = "white";
        }
        if (this.type == "text") {
            myGameArea.canvas.getContext("2d").font = this.width + " " + this.height;
            myGameArea.canvas.getContext("2d").fillStyle = "blue";
            myGameArea.canvas.getContext("2d").fillText(("score: " + score), this.x, this.y);
        }
        myGameArea.canvas.getContext("2d").fillRect(this.x, this.y, this.width, this.height);
    }
    this.newPos = function () {
        if (this.type == "block") {
            this.gravitySpeed += this.gravity;
            this.y += this.speedY + this.gravitySpeed;
            this.x += this.speedX;
            this.hitBottom();
            this.hitWall();
        }
        if (this.type == "part") {
            this.gravitySpeed += this.gravity;
            this.y += this.speedY + this.gravitySpeed;
            this.hitBottom();
        }
    }
    this.hitWall = function () {
        var rightWall = document.body.clientWidth - this.width;
        if (this.speedX > 0 && this.x > rightWall) {
            this.x = rightWall;
            this.speedX = this.speedX * (-1);
        }
        if (this.speedX < 0 && this.x < 0) {
            this.x = 0;
            this.speedX = this.speedX * (-1);
        }
    }
    this.hitBottom = function () {
        if (this.type == "block") {
            if (this.y > rockbottom) {
                this.y = rockbottom;
                var n = this.gravitySpeed;
                this.gravitySpeed = 0;
                if (this.x >= (gamebase[gamebase.length - 1].x + gamebase[gamebase.length - 1].width)) {
                    end = true
                    return;
                }
                if ((this.x + this.width) <= gamebase[gamebase.length - 1].x) {
                    end = true
                    return;
                }
                if (this.x > gamebase[gamebase.length - 1].x) {
                    part = new component((this.x - gamebase[gamebase.length - 1].x), 30, (gamebase[gamebase.length - 1].x + gamebase[gamebase.length - 1].width), this.y, "part");
                    part.gravitySpeed = n;
                    // w = w - (this.x - gamebase[gamebase.length - 1].x + gamebase[gamebase.length - 1].width);
                    w -= (this.x - gamebase[gamebase.length - 1].x);
                    block = new component(w, 30, this.x, this.y, "block");
                    score++;
                }
                else if (this.x < gamebase[gamebase.length - 1].x) {
                    part = new component((gamebase[gamebase.length - 1].x - this.x), 30, this.x, this.y, "part");
                    part.gravitySpeed = n;
                    // w = w - (gamebase[gamebase.length - 1].x + gamebase[gamebase.length - 1].width);
                    w -= (gamebase[gamebase.length - 1].x - this.x);
                    block = new component(w, 30, gamebase[gamebase.length - 1].x, this.y, "block");
                    score++
                } else if (this.x == gamebase[gamebase.length - 1].x) {
                    part = null;
                    this.type = "base";
                    gamebase.push(this);
                    rockbottom -= 30;
                    if (rockbottom < (document.body.clientHeight - 13 * 30)) {
                        lowerTheBase()
                    }
                    block = new component(w, 30, (document.body.clientWidth / 2 - this.width / 2), 10, "block");
                    score++;
                    return;
                }
                block.type = "base";
                gamebase.push(block);
                block = null;
                rockbottom -= 30;
                if (rockbottom < (document.body.clientHeight - 13 * 30)) {
                    lowerTheBase()
                }
            }
        }
        if (this.type == "part") {
            if (this.y > (document.body.clientHeight + 30)) {
                part = null;
                block = new component(w, 30, (document.body.clientWidth / 2 - this.width / 2), 10, "block");
            }
        }
    }
}

function lowerTheBase() {
    rockbottom += 30;
    count = 0
    inter = setInterval(lower, 15);
}

function lower() {
    for (i = 0; i < gamebase.length; i++) {
        gamebase[i].y += 2;
    }
    count++;
    if (count == 15) {
        clearInterval(inter);
    }
}

function updateGameArea() {
    myGameArea.clear();
    if (!end) {
        myScore.update();
    }
    if (end) {
        document.getElementById("login-warning").style.display = "initial";
        myScore = new component("90px", "Consolas", (document.body.clientWidth * 0.5 - 200), 250, "text");
        myScore.update();
        document.getElementById("start").style.display = "inline-block";
        document.getElementById("header").style.display = "flex";
        clearInterval(myGameArea.interval);
    }
    myGameArea.frameNo += 1;

    if (block != null) {
        block.newPos();
    }
    if (block != null) {
        block.update();
    }
    if (part != null) {
        part.newPos();
    }
    if (part != null) {
        part.update();
    }


    for (i = 1; i < 14; i++) {
        if (gamebase.length >= i) {
            gamebase[gamebase.length - i].newPos();
            gamebase[gamebase.length - i].update();
        }
    }
}

function removeStartButton() {
    document.getElementById("login-warning").style.display = "none";
    if (end) {
        gamebase = [];
        w = 500;
        score = 0;
        block = null;
        makeGame();
    }
    document.getElementById("start").style.display = "none";
    document.getElementById("header").style.display = "none";
}

document.getElementById("body").addEventListener("keypress", keypress);
function keypress() {
    if (!end) {
        drop();
    }
}





// var myGamePiece;
// var gameBase;
// var myObstacles = [];
// var myScore;

// function startGame() {
//     myGamePiece = new component(30, 30, "red", 10, 120);
//     gameBase = new component(450, 30, "red", (document.body.clientWidth * 0.5 - 225), (document.body.clientHeight - 30));
//     myGamePiece.gravity = 0.05;
//     gameBase.gravity = 0;
//     myScore = new component("30px", "Consolas", "black", 280, 40, "text");
//     myGameArea.make();
// }

// function play() {
//     myGameArea.start();
// }

// var myGameArea = {
//     canvas: document.createElement("canvas"),
//     make: function () {
//         this.canvas.getContext("2d").fillStyle = "red";
//         this.canvas.width = (document.body.clientWidth);
//         this.canvas.height = (document.body.clientHeight);
//         this.context = this.canvas.getContext("2d");
//         document.body.insertBefore(this.canvas, document.body.childNodes[0]);
//         this.frameNo = 0;
//         updateGameArea();
//     },
//     start: function () {
//         this.interval = setInterval(updateGameArea, 15);
//     },
//     clear: function () {
//         this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
//     }
// }

// function component(width, height, color, x, y, type) {
//     this.type = type;
//     this.score = 0;
//     this.width = width;
//     this.height = height;
//     this.speedX = 0;
//     this.speedY = 0;
//     this.x = x;
//     this.y = y;
//     this.gravity = 0;
//     this.gravitySpeed = 0;
//     this.update = function () {
//         ctx = myGameArea.context;
//         if (this.type == "text") {
//             ctx.font = this.width + " " + this.height;
//             ctx.fillStyle = color;
//             ctx.fillText(this.text, this.x, this.y);
//         } else {
//             ctx.fillStyle = color;
//             ctx.fillRect(this.x, this.y, this.width, this.height);
//         }
//     }
//     this.newPos = function () {
//         this.gravitySpeed += this.gravity;
//         this.x += this.speedX;
//         this.y += this.speedY + this.gravitySpeed;
//         this.hitBottom();
//     }
//     this.hitBottom = function () {
//         var rockbottom = myGameArea.canvas.height - this.height;
//         if (this.y > rockbottom) {
//             this.y = rockbottom;
//             this.gravitySpeed = 0;
//         }
//     }
//     this.crashWith = function (otherobj) {
//         var myleft = this.x;
//         var myright = this.x + (this.width);
//         var mytop = this.y;
//         var mybottom = this.y + (this.height);
//         var otherleft = otherobj.x;
//         var otherright = otherobj.x + (otherobj.width);
//         var othertop = otherobj.y;
//         var otherbottom = otherobj.y + (otherobj.height);
//         var crash = true;
//         if ((mybottom < othertop) || (mytop > otherbottom) || (myright < otherleft) || (myleft > otherright)) {
//             crash = false;
//         }
//         return crash;
//     }
// }

// function updateGameArea() {
//     var x, height, gap, minHeight, maxHeight, minGap, maxGap;
//     myGameArea.clear();
//     for (i = 0; i < myObstacles.length; i += 1) {
//         if (myGamePiece.crashWith(myObstacles[i])) {
//             return;
//         }
//     }
//     myGameArea.frameNo += 1;
//     if (myGameArea.frameNo == 1 || everyinterval(150)) {
//         x = myGameArea.canvas.width;
//         minHeight = 20;
//         maxHeight = 200;
//         height = Math.floor(Math.random() * (maxHeight - minHeight + 1) + minHeight);
//         minGap = 50;
//         maxGap = 200;
//         gap = Math.floor(Math.random() * (maxGap - minGap + 1) + minGap);
//         myObstacles.push(new component(10, height, "green", x, 0));
//         myObstacles.push(new component(10, x - height - gap, "green", x, height + gap));
//     }
//     for (i = 0; i < myObstacles.length; i += 1) {
//         myObstacles[i].x += -1;
//         myObstacles[i].update();
//     }
//     myScore.text = "SCORE: " + myGameArea.frameNo;
//     myScore.update();
//     myGamePiece.newPos();
//     myGamePiece.update();
//     myGamePiece.newPos();
//     gameBase.update();
// }

// function everyinterval(n) {
//     if ((myGameArea.frameNo / n) % 1 == 0) { return true; }
//     return false;
// }

// function accelerate(n) {
//     myGamePiece.gravity = n;
// }