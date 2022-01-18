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

const cookiesImg = new Image();
cookiesImg.src = "./images/cookies.png";

const kettleImg = new Image();
kettleImg.src = "./images/kettle.png";

const gameOverImg = new Image();
gameOverImg.src = "./images/game-over.jpg";
const youWinImg = new Image();
youWinImg.src = "./images/you-win.png";

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

  start: function () {
    this.interval = setInterval(updateGameArea, 20);
  },

  createBoard: function () {
    ctx.fillStyle = "#7C99AC";
    ctx.fillRect(0, safeRowHeight, canvas.width, canvas.height - safeRowHeight);
    ctx.fillStyle = "#ddb8b8";
    ctx.fillRect(0, 0, canvas.width, safeRowHeight);
    ctx.fillRect(0, canvas.height - safeRowHeight, canvas.width, safeRowHeight);
    ctx.drawImage(teaPotImg, canvas.width - 70, 5, 70, 70);
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
  constructor(width,height,img,speed,posX,posY){
    this.width=width;
    this.height=height;
    this.img = img;
    this.speed = speed;
    this.posX = posX;
    this.posY = posY
  }
}

//GAME VARIABLES

const gridSize = 75;
const safeRowHeight=85;
const playerSpeed = 10;

let gameTime = 29;

let cupCakeConfig = new obstaclesConfig (
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
    0.5,
    0,
    [
      canvas.height - safeRowHeight - gridSize,    //bottom and 3rd row
      canvas.height - safeRowHeight - 3*gridSize,
    ]
);


let cookiesJarLowConfig = new obstaclesConfig (
  140,
  70,
  cookiesImg,
  1.5,
  0,
  canvas.height - safeRowHeight - 2*gridSize, //second row
  );

  let cookiesJarHighConfig = new obstaclesConfig(
  140,
  70,
  cookiesImg,
  -2,
  -2*gridSize,
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
  for (let i = 0; i < 17; i += 2) {       //cupcakes row 1 and 3
    cupCake = new Component(
      cupCakeConfig.width,
      cupCakeConfig.height,
      randomArrayElement(cupCakeConfig.img),
      cupCakeConfig.posX,
      randomArrayElement(cupCakeConfig.posY),
      cupCakeConfig.speed
    );
    cupCake.draw();
    cupCakeConfig.posX += 2*gridSize;
    cupCakes.push(cupCake);
  }

  for (let i = 0; i < 6; i++) {    //cookies jars row 2
    cookiesJar = new Component(
      cookiesJarLowConfig.width,
      cookiesJarLowConfig.height,
      cookiesJarLowConfig.img,
      cookiesJarLowConfig.posX,
      cookiesJarLowConfig.posY,
      cookiesJarLowConfig.speed
    );
    cookiesJar.draw();
    cookiesJarLowConfig.posX += 4*gridSize;
    cookiesJars.push(cookiesJar);
  }

  for (let i = 0; i < 6; i++) {    //cookies jars row 4
    cookiesJar = new Component(
      cookiesJarHighConfig.width,
      cookiesJarHighConfig.height,
      cookiesJarHighConfig.img,
      cookiesJarHighConfig.posX,
      cookiesJarHighConfig.posY,
      cookiesJarHighConfig.speed
    );
    cookiesJar.draw();
    cookiesJarHighConfig.posX += 4*gridSize;
    cookiesJarsTop.push(cookiesJar);
  }

}


//MOVE OBSTACLES
function moveObstacles() {
  cupCakes.forEach(function (eachCupCake) {
    eachCupCake.x -= eachCupCake.speed;
    eachCupCake.draw();
  });

  cookiesJars.forEach(function (eachCookiesJar) {
    eachCookiesJar.x -= eachCookiesJar.speed;
    eachCookiesJar.draw();
  });

  cookiesJarsTop.forEach(function (eachCookiesJar) {
    eachCookiesJar.x -= eachCookiesJar.speed;
    eachCookiesJar.draw();
  });
}

//CREATE NEW OBSTACLES
function createNewObstacles() {
  if (game.frame % 280 === 0) {
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

  if (game.frame % 200 === 0) {
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

  if (game.frame % 150 === 0) {
    cookiesJar = new Component(
      cookiesJarHighConfig.width,
      cookiesJarHighConfig.height,
      cookiesJarHighConfig.img,
      -2*gridSize,
      cookiesJarHighConfig.posY,
      cookiesJarHighConfig.speed
    );

    cookiesJarsTop.push(cookiesJar);
  }
}

//CHECK IF TEACUP CRASHED AND RETURN TO START POSITION

function checkCrash() {
  cupCakes.some(function (eachCupCake) {
    if (teaCup.crashWith(eachCupCake)) {
      crashSound.play();
      teaCup.resetPosition();
      teaCup.draw();
    }
  });

  cookiesJars.some(function (eachCookiesJar) {
    if (teaCup.crashWith(eachCookiesJar)) {
      crashSound.play();
      teaCup.resetPosition();
      teaCup.draw();
    }
  });

  cookiesJarsTop.some(function (eachCookiesJar) {
    if (teaCup.crashWith(eachCookiesJar)) {
      crashSound.play();
      teaCup.resetPosition();
      teaCup.draw();
    }
  });
}

//CHECK IF WIN GAME

function winGame() {
  if (teaCup.x > 1120 && teaCup.y <= 33) {
    game.stop();
    kettle.stopTimer();
    ctx.drawImage(youWinImg, 400, 120, 400, 100);
    winSound.play();
  }
}

//GAME OVER WHEN TIME ELAPSED

function gameOver() {
  game.stop();
  kettle.stopTimer();
  ctx.drawImage(gameOverImg, 500, 140, 320, 110);
  gameOverSound.play();
}

//TIMER

const kettle = {
  x: 0,
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
    gameTime--;
  } else {
    gameOver();
  }
}

//REFRESH THE GAME EVERY 20MILLISECOND

function updateGameArea() {
  game.frame++;
  game.createBoard();
  teaCup.draw();
  moveObstacles();
  createNewObstacles();
  checkCrash();
  winGame();
}

// ---EVENT LISTENERS---

//WAIT FOR THE PAGE TO FULLY LOAD BEFORE DRAWING THE GAME
window.onload = () => {
  game.createBoard();
  teaCup.draw();
  drawInitialObstacles();
  ctxTimer.fillStyle = "white";
  ctxTimer.fillRect(0, 0, canvasTimer.width, canvasTimer.height);
  kettle.draw();
};

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

  //add eventlistener to arrow keys to move the player
  addControlEvents();

  //start game and timer
  game.start();
  kettle.startTimer();
 
});


//AUDIO ON/OFF
document.querySelector(".sound-img").addEventListener("click",function(){

  winSound.muted = !winSound.muted;
  gameOverSound.muted=!gameOverSound.muted;
  crashSound.muted =!crashSound.muted;

  if (document.querySelector(".sound-img").src.includes("-off")) {
    document.querySelector(".sound-img").setAttribute("src","./images/sound-on.PNG");
  } else {
    document.querySelector(".sound-img").setAttribute("src","./images/sound-off.PNG");
  }

})

