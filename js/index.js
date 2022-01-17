//CANVAS VARIABLES

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const canvasTimer = document.getElementById("timebar");
const ctxTimer = canvasTimer.getContext("2d");

//IMAGES VARIABLES

const teaPotImg = new Image();
teaPotImg.src = "./images/teapot.png";

const teaCupImg = new Image();
teaCupImg.src = "./images/teacup.png";

const cupCakeImg1 = new Image();
cupCakeImg1.src = "./images/cupcake1.png";
const cupCakeImg2 = new Image();
cupCakeImg2.src = "./images/cupcake2.png";
const cupCakeImg3 = new Image();
cupCakeImg3.src = "./images/cupcake3.png";
const cupCakeImg4 = new Image();
cupCakeImg4.src = "./images/cupcake4.png";
const cupCakeImg5 = new Image();
cupCakeImg5.src = "./images/cupcake5.png";
const cupCakeImg6 = new Image();
cupCakeImg6.src = "./images/cupcake6.png";

const kettleImg = new Image();
kettleImg.src = "./images/kettle.png";

const gameOverImg = new Image();
gameOverImg.src = "./images/game-over.jpg";
const youWinImg = new Image();
youWinImg.src = "./images/you-win.png";

//GAME OBJECT

const game = {
  frame: 0,

  start: function () {
    this.interval = setInterval(updateGameArea, 20);
  },

  createBoard: function () {
    console.log("create board");
    ctx.fillStyle = "#7C99AC";
    ctx.fillRect(0, 85, 1200, 310);
    ctx.fillStyle = "#ddb8b8";
    ctx.fillRect(0, 0, 1200, 85);
    ctx.fillRect(0, 310, 1200, 85);
    ctx.drawImage(teaPotImg, 1120, 5, 70, 70);
    // let teaPotImg = new Image();
    // teaPotImg.src = "./images/teapot.png";
    // teaPotImg.onload = function () {
    // ctx.drawImage(teaPotImg, 1120, 5, 70, 70);
    // };
  },

  stop: function () {
    clearInterval(this.interval);
  },
};

//CLASS COMPONENT USED TO CREATE ALL OBJECTS IN THE CANVAS

class Component {
  constructor(width, height, img, x, y, speed) {
    this.width = width;
    this.height = height;
    this.img = img;
    // this.color = color;
    this.x = x;
    this.y = y;
    this.speed = speed;
  }

  draw() {
    // let compImg = new Image();
    // compImg.src = this.img;
    // compImg.onload = () => {
    ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
    // ctx.fillStyle = this.color;
    // ctx.fillRect(this.x, this.y, this.width, this.height);
  }

  resetPosition() {
    this.x = 570;
    this.y = 323;
  }

  moveLeft() {
    if (this.x > 0) {
      this.x -= this.speed;
    }
  }

  moveRight() {
    if (this.x < 1147) {
      this.x += this.speed;
    }
  }

  moveUp() {
    if (this.y > 0) {
      this.y -= this.speed;
    }
  }

  moveDown() {
    if (this.y < 345) {
      this.y += this.speed;
    }
  }

  left() {
    return this.x;
  }

  right() {
    return this.x + this.width;
  }

  up() {
    return this.y;
  }

  down() {
    return this.y + this.height;
  }

  crashWith(obstacle) {
    if (
      this.down() < obstacle.up() ||
      this.up() > obstacle.down() ||
      this.right() < obstacle.left() ||
      this.left() > obstacle.right()
    ) {
      return false;
    }
    return true;
  }
}

//GAME VARIABLES

const teaCup = new Component(43, 40, teaCupImg, 570, 323, 10);
// const teaCup = new Component(43, 40, "green", 570, 323, 10);

const cupCakeColors = ["blue", "red", "orange", "yellow", "purple", "aqua"];

const cupCakeImgs = [
  cupCakeImg1,
  cupCakeImg2,
  cupCakeImg3,
  cupCakeImg4,
  cupCakeImg5,
  cupCakeImg6,
];

const cupCakeYPositions = [85, 160, 235];
let cupCakeXPosition = 0;
let cupCakes = [];
let cupCake;

let gameTime = 29;

//--------FUNCTIONS------

//SELECT A RANDOM ELEMENT OF ARRAY - USED FOR CREATING OBSTACLES

function randomArrayElement(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

//CREATES THE FIRST 16 OBSTACLES FOR THE START OF THE GAME

function drawInitialCupCakes() {
  console.log("drawing cupcakes");
  for (let i = 0; i < 17; i++) {
    cupCake = new Component(
      65,
      70,
      randomArrayElement(cupCakeImgs),
      // randomArrayElement(cupCakeColors),
      cupCakeXPosition,
      randomArrayElement(cupCakeYPositions),
      0.5
    );
    cupCake.draw();
    cupCakeXPosition += 75;
    cupCakes.push(cupCake);
  }
}

//MOVE CUPCAKES
function moveCupcakes() {
  cupCakes.forEach(function (eachCupCake) {
    eachCupCake.x -= eachCupCake.speed;
    eachCupCake.draw();
  });
}

//CREATE NEW CUPCAKES
function createNewCupCake() {
  if (game.frame % 140 === 0) {
    cupCake = new Component(
      65,
      70,
      randomArrayElement(cupCakeImgs),
      // randomArrayElement(cupCakeColors),
      1200,
      randomArrayElement(cupCakeYPositions),
      0.5
    );
    cupCakes.push(cupCake);
  }
}

//CHECK IF TEACUP CRASHED AND RETURN TO START POSITION

function checkCrash() {
  cupCakes.some(function (eachCupCake) {
    if (teaCup.crashWith(eachCupCake)) {
      teaCup.resetPosition();
      teaCup.draw();
    }
  });
}

//CHECK IF WIN GAME

function winGame() {
  if (teaCup.x > 1120 && teaCup.y <= 33) {
    console.log("you win");
    game.stop();
    kettle.stopTimer();
    ctx.drawImage(youWinImg, 400, 120, 400, 100);
  }
}

//GAME OVER WHEN TIME ELAPSED

function gameOver() {
  game.stop();
  ctx.drawImage(gameOverImg, 500, 150, 300, 100);
}

//DRAW GAME WHEN PAGE LOADS
window.onload = () => {
  console.log("page is fully loaded");
  game.createBoard();
  teaCup.draw();
  drawInitialCupCakes();
  ctxTimer.fillStyle = "white"
  ctxTimer.fillRect(0,0,900,25);
  kettle.draw();
};

//EVENT LISTENERS FOR THE KEYS TO CONTROL THE GAME ADDED WHEN THE GAME START

function addControlEvents() {
  document.addEventListener("keydown", function (event) {
    switch (event.keyCode) {
      case 38: // up arrow
        teaCup.moveUp();
        break;
      case 40: // down arrow
        teaCup.moveDown();
        break;
      case 37: // left arrow
        teaCup.moveLeft();
        break;
      case 39: // right arrow
        teaCup.moveRight();
        break;
    }
  });
}

//REFRESH THE GAME EVERY 20MILLISECOND

function updateGameArea() {
  game.frame++;
  game.createBoard();
  teaCup.draw();
  moveCupcakes();
  createNewCupCake();
  checkCrash();
  winGame();
}

//WHEN THE PLAY BUTTON IS CLICKED
document.querySelector(".btn-game").addEventListener("click", function () {
  console.log("this works");
  document.querySelector(".btn-game").setAttribute("class", "hidden");

  //to remove scrolling in browser with arrow keys
  window.addEventListener(
    "keydown",
    function (e) {
      if (
        ["Space", "ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].indexOf(
          e.code
        ) > -1
      ) {
        e.preventDefault();
      }
    },
    false
  );

  addControlEvents(); //add eventlistener to move the player
  game.start();
  kettle.startTimer();
});

//TIMEBAR

// ctxTimer.fillStyle="darkgrey";
// ctxTimer.fillRect(0,0,600,45);

const kettle = {
  x: 0,
  y: 0,
  width: 30,
  height: 25,
  draw: function () {
    ctxTimer.drawImage(kettleImg, this.x, this.y, this.width, this.height);
  },
  rotate: function () {
    ctxTimer.rotate((Math.PI / 180) * 25);
  },
  startTimer: function () {
    this.interval = setInterval(moveTimer, 1000);
  },

  stopTimer:function(){
    clearInterval(this.interval);
  }
};

function moveTimer() {
  if (gameTime > 0) {
    kettle.x += kettle.width;
    kettle.draw();
    gameTime--;
  } else {
    gameOver();
  }
}
