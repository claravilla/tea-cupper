//CANVAS VARIABLES

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const canvasTimer = document.getElementById("timebar");
const ctxTimer = canvasTimer.getContext("2d");

//IMAGES VARIABLES

const safeRowImgTop = new Image();
safeRowImgTop.src = "./images/wooden-top.jpg";

const safeRowImgBottom = new Image();
safeRowImgBottom.src = "./images/wooden-bottom.jpg";

const backGroundImg = new Image();
backGroundImg.src = "./images/cloth.jpg";

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

const cookiesImg = new Image();
cookiesImg.src = "./images/cookies.png";

const kettleImg = new Image();
kettleImg.src = "./images/kettle.png";

const gameOverImg = new Image();
gameOverImg.src = "./images/game-over.JPG";
const youWinImg = new Image();
youWinImg.src = "./images/you-win.PNG";

//SOUNDS VARIABLES

const winSound = new Audio();
winSound.src = "./sounds/win-game.wav";

const gameOverSound = new Audio();
gameOverSound.src = "./sounds/time-out.mp3";

const crashSound = new Audio();
crashSound.src = "./sounds/crash-sound.mp3";

//GAME OBJECT

const game = {
  frame: 0,

  gameHasEnded: false,

  start: function () {
    this.interval = setInterval(updateGameArea, 20);
    this.gameHasEnded = false;
  },

  createBoard: function () {
    ctx.drawImage(
      backGroundImg,
      0,
      safeRowHeight - 1,
      canvas.width,
      canvas.height - safeRowHeight
    );
    ctx.drawImage(safeRowImgTop, 0, 0, canvas.width, safeRowHeight - 1);
    ctx.drawImage(
      safeRowImgBottom,
      0,
      canvas.height - safeRowHeight,
      canvas.width,
      safeRowHeight
    );
    ctx.drawImage(teaPotImg, canvas.width - 70, 5, 70, 70);
    drawLives(lives);
  },

  stop: function () {
    clearInterval(this.interval);
  },

  reset: function () {
    gameSpeed = 1;
    game.frame = 0;
    gameTime = 29;
    playerHasCrashed = false;
    lives = 5;
    cupCakes = [];
    cookiesJars = [];
    cookiesJarsTop = [];
    teaCup.resetPosition();
    kettle.x = 5;
    cupCakeConfig.posX = 0;
    cookiesJarLowConfig.posX = 0;
    cookiesJarHighConfig.posX = -2 * gridSize;
  },
};

//CLASS COMPONENT USED TO CREATE ALL OBJECTS IN THE CANVAS

class Component {
  constructor(width, height, img, x, y, speed) {
    this.width = width;
    this.height = height;
    this.img = img;
    this.x = x;
    this.y = y;
    this.speed = speed;
  }

  draw() {
    ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
  }

  resetPosition() {
    this.x = (canvas.width - 43) / 2;
    this.y = canvas.height - 60;
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
    if (this.y > 3) {
      this.y -= this.speed;
    }
  }

  moveDown() {
    if (this.y < 420) {
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

//CLASS TO GROUP ALL OBSTACLES DETAILS IN ONE PLACE

class obstaclesConfig {
  constructor(width, height, img, speed, posX, posY) {
    this.width = width;
    this.height = height;
    this.img = img;
    this.speed = speed;
    this.posX = posX;
    this.posY = posY;
  }
}

//GAME VARIABLES

const gridSize = 75;
const safeRowHeight = 85;

const playerSpeed = 15;
let lives = 5;
let playerHasCrashed = false;

let gameTime = 29;
let gameSpeed = 1;
let speedInterval, clearSpeedInterval;
const gameSpeedValues = [0.5, 3];

//OBSTACLES AND PLAYER VARIABLES

let cupCakeConfig = new obstaclesConfig(
  65,
  70,
  [
    cupCakeImg1,
    cupCakeImg2,
    cupCakeImg3,
    cupCakeImg4,
    cupCakeImg5,
    cupCakeImg6,
  ],
  gameSpeed * 0.5,
  0,
  [
    canvas.height - safeRowHeight - gridSize, //bottom and 3rd row
    canvas.height - safeRowHeight - 3 * gridSize,
  ]
);

let cookiesJarLowConfig = new obstaclesConfig(
  140,
  70,
  cookiesImg,
  gameSpeed * 1.5,
  0,
  canvas.height - safeRowHeight - 2 * gridSize //second row
);

let cookiesJarHighConfig = new obstaclesConfig(
  140,
  70,
  cookiesImg,
  gameSpeed * -2,
  -2 * gridSize,
  safeRowHeight
);

let cupCake, cookiesJar;
let cupCakes = [];
let cookiesJars = [];
let cookiesJarsTop = [];

const teaCup = new Component(
  47,
  44,
  teaCupImg,
  (canvas.width - 43) / 2,
  canvas.height - 60,
  playerSpeed
);

//--------FUNCTIONS FOR THE GAME ------

//SELECT A RANDOM ELEMENT OF AN ARRAY - USED FOR CREATING OBSTACLES

function randomArrayElement(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

//CREATE THE FIRST OBSTACLES FOR THE START OF THE GAME

function drawInitialObstacles() {
  for (let i = 0; i < 17; i += 2) {
    //cupcakes row 1 and 3
    cupCake = new Component(
      cupCakeConfig.width,
      cupCakeConfig.height,
      randomArrayElement(cupCakeConfig.img),
      cupCakeConfig.posX,
      randomArrayElement(cupCakeConfig.posY),
      cupCakeConfig.speed
    );
    cupCake.draw();
    cupCakeConfig.posX += 2 * gridSize;
    cupCakes.push(cupCake);
  }

  for (let i = 0; i < 6; i++) {
    //cookies jars row 2
    cookiesJar = new Component(
      cookiesJarLowConfig.width,
      cookiesJarLowConfig.height,
      cookiesJarLowConfig.img,
      cookiesJarLowConfig.posX,
      cookiesJarLowConfig.posY,
      cookiesJarLowConfig.speed
    );
    cookiesJar.draw();
    cookiesJarLowConfig.posX += 4 * gridSize;
    cookiesJars.push(cookiesJar);
  }

  for (let i = 0; i < 6; i++) {
    //cookies jars row 4
    cookiesJar = new Component(
      cookiesJarHighConfig.width,
      cookiesJarHighConfig.height,
      cookiesJarHighConfig.img,
      cookiesJarHighConfig.posX,
      cookiesJarHighConfig.posY,
      cookiesJarHighConfig.speed
    );
    cookiesJar.draw();
    cookiesJarHighConfig.posX += 4 * gridSize;
    cookiesJarsTop.push(cookiesJar);
  }
}

//MOVE OBSTACLES
function moveObstacles(array) {
  array.forEach((eachElement) => {
    eachElement.x -= eachElement.speed;
    eachElement.draw();
  });
}

//CREATE NEW OBSTACLES
function createNewObstacles() {
  if (game.frame % ((gridSize * 2) / cupCakeConfig.speed) === 0) {
    cupCake = new Component(
      cupCakeConfig.width,
      cupCakeConfig.height,
      randomArrayElement(cupCakeConfig.img),
      canvas.width,
      randomArrayElement(cupCakeConfig.posY),
      cupCakeConfig.speed
    );
    cupCakes.push(cupCake);
  }

  if (game.frame % ((gridSize * 4) / cookiesJarLowConfig.speed) === 0) {
    //
    cookiesJar = new Component(
      cookiesJarLowConfig.width,
      cookiesJarLowConfig.height,
      cookiesJarLowConfig.img,
      canvas.width,
      cookiesJarLowConfig.posY,
      cookiesJarLowConfig.speed
    );
    cookiesJars.push(cookiesJar);
  }

  if (game.frame % ((gridSize * 4) / cookiesJarHighConfig.speed) === 0) {
    cookiesJar = new Component(
      cookiesJarHighConfig.width,
      cookiesJarHighConfig.height,
      cookiesJarHighConfig.img,
      -2 * gridSize,
      cookiesJarHighConfig.posY,
      cookiesJarHighConfig.speed
    );

    cookiesJarsTop.push(cookiesJar);
  }
}

//CHECK IF TEACUP CRASHED

function checkCrash() {
  cupCakes.some(function (eachCupCake) {
    if (teaCup.crashWith(eachCupCake)) {
      crashSound.play();
      playerHasCrashed = true;
    } 
  });

  cookiesJars.some(function (eachCookiesJar) {
    if (teaCup.crashWith(eachCookiesJar)) {
      crashSound.play();
      playerHasCrashed = true;
    } 
  });

  cookiesJarsTop.some(function (eachCookiesJar) {
    if (teaCup.crashWith(eachCookiesJar)) {
      crashSound.play();
      playerHasCrashed = true;
    } 
  });

  if (playerHasCrashed) {
    lives--;
    if (lives > 0) {
      playerHasCrashed = false;
      teaCup.resetPosition();
      teaCup.draw();
    } else {
      gameOver();
    }
  }
}

//DRAW LIVES

function drawLives(numberOfLives) {
  let x = 5;
  for (let i = 0; i < numberOfLives - 1; i++) {
    ctx.drawImage(teaCupImg, x, 5, 20, 20);
    x += 25;
  }
}

//INCREASE SPEED OF GAME

function modifySpeed() {
  speedInterval = setInterval(function () {
    gameSpeed = randomArrayElement(gameSpeedValues);
    revertSpeed();
  }, 7000);
}

function revertSpeed() {
  clearSpeedInterval = setTimeout(function () {
    gameSpeed = 1;
  }, 2000);
}

//CHECK IF WIN GAME

function winGame() {
  if (teaCup.x > 1120 && teaCup.y <= 33) {
    game.stop();
    kettle.stopTimer();
    ctx.drawImage(youWinImg, 450, 170, 400, 100);
    winSound.play();
    clearInterval(speedInterval);
    clearInterval(clearSpeedInterval);
    endGame();
  }
}

//GAME OVER

function gameOver() {
  game.stop();
  kettle.stopTimer();
  ctx.drawImage(gameOverImg, 500, 160, 350, 110);
  gameOverSound.play();
  clearInterval(speedInterval);
  clearInterval(clearSpeedInterval);
  endGame();
}

//END GAME AND DISPLAY BUTTON TO PLAY AGAIN

function endGame() {
  game.gameHasEnded = true;
  document.querySelector(".btn-game").innerHTML = "REPLAY";
  document.querySelector(".btn-game").classList.remove("hidden");
}

//TIMER

const kettle = {
  x: 5,
  y: 0,
  width: 30,
  height: 25,
  draw: function () {
    ctxTimer.drawImage(kettleImg, this.x, this.y, this.width, this.height);
  },

  startTimer: function () {
    this.interval = setInterval(moveTimer, 1000);
  },

  stopTimer: function () {
    clearInterval(this.interval);
  },
};

function moveTimer() {
  if (gameTime > 0) {
    ctxTimer.fillStyle = "white";
    ctxTimer.fillRect(0, 0, canvasTimer.width, canvasTimer.height);
    kettle.x += kettle.width;
    kettle.draw();
    ctxTimer.fillStyle = "red";
    ctxTimer.fillRect(0, 0, kettle.x, 25);
    gameTime--;
  } else {
    ctxTimer.fillRect(0, 0, 905, 25);
    kettle.draw();
    gameOver();
  }
}

//REFRESH THE GAME EVERY 20MILLISECOND

function updateGameArea() {
  game.frame++;
  game.createBoard();
  teaCup.draw();
  moveObstacles(cupCakes);
  moveObstacles(cookiesJars);
  moveObstacles(cookiesJarsTop);
  createNewObstacles();
  checkCrash();
  winGame();
}

// ---EVENT LISTENERS---

//WAIT FOR THE PAGE TO FULLY LOAD BEFORE DRAWING THE GAME
window.onload = gameSetup;

function gameSetup() {
  game.createBoard();
  teaCup.draw();
  drawInitialObstacles();
  ctxTimer.fillStyle = "white";
  ctxTimer.fillRect(0, 0, canvasTimer.width, canvasTimer.height);
  kettle.draw();
}

//EVENT LISTENERS FOR THE KEYS TO CONTROL THE GAME

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

//EVENT LISTENER WHEN THE PLAY BUTTON IS CLICKED
document.querySelector(".btn-game").addEventListener("click", function () {
  //remove the Play button
  document.querySelector(".btn-game").classList.add("hidden");

  if (!game.gameHasEnded) {
    //so this is the first game as the boolean is set to false by default
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

    //add eventlistener to arrow keys to move the player
    addControlEvents();
  }

  if (game.gameHasEnded) {
    //if the boolean is set to true, reset game value and clear the board
    game.reset();
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctxTimer.clearRect(0, 0, canvasTimer.width, canvasTimer.height);
    gameSetup();
  }

  //start game and timer
  game.start();
  kettle.startTimer();

  //start random speed change
  modifySpeed();
  revertSpeed();
});

//EVENT LISTENER FOR AUDIO ON/OFF
document.querySelector(".sound-img").addEventListener("click", function () {
  winSound.muted = !winSound.muted;
  gameOverSound.muted = !gameOverSound.muted;
  crashSound.muted = !crashSound.muted;

  if (document.querySelector(".sound-img").src.includes("-off")) {
    document
      .querySelector(".sound-img")
      .setAttribute("src", "./images/sound-on.PNG");
  } else {
    document
      .querySelector(".sound-img")
      .setAttribute("src", "./images/sound-off.PNG");
  }
});
