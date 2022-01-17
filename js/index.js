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
winSound.src = "./sounds/win-game.wav"

const gameOverSound = new Audio();
gameOverSound.src = "./sounds/time-out.mp3"

const crashSound = new Audio();
crashSound.src = "./sounds/crash-sound.mp3"

//GAME OBJECT

const game = {
  frame: 0,

  start: function () {
    this.interval = setInterval(updateGameArea, 20);
  },

  createBoard: function () {
    ctx.fillStyle = "#7C99AC";
    ctx.fillRect(0, 85, 1200, 310);
    ctx.fillStyle = "#ddb8b8";
    ctx.fillRect(0, 0, 1200, 85);
    ctx.fillRect(0, 310, 1200, 85);
    ctx.drawImage(teaPotImg, 1120, 5, 70, 70);
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
    this.x = 570;
    this.y = 327;
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

const teaCup = new Component(43, 40, teaCupImg, 570, 327, 10);


const cupCakeImgs = [
  cupCakeImg1,
  cupCakeImg2,
  cupCakeImg3,
  cupCakeImg4,
  cupCakeImg5,
  cupCakeImg6,
];


let cupCake, cookiesJar;

const cupCakeYPositions = [85, 235];  //removed 160 which is the middle row
let cupCakeXPosition = 0;
let cupCakes = [];

let cookiesJars = [];
const cookiesJarYposition = 160;
let cookiesJarXPosition = 0;

let cupCakeSpeed =0.5
let cookiesJarSpeed = 1.5 


let gameTime = 29;
let sugarRush,clearSugarRush;

//--------FUNCTIONS FOR THE GAME ------

//SELECT A RANDOM ELEMENT OF AN ARRAY - USED FOR CREATING OBSTACLES

function randomArrayElement(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

//CREATE THE FIRST OBSTACLES FOR THE START OF THE GAME 

function drawInitialCupCakes() {
  for (let i = 0; i < 17; i+=2) {
    cupCake = new Component(
      65,
      70,
      randomArrayElement(cupCakeImgs),
      cupCakeXPosition,
      randomArrayElement(cupCakeYPositions),
      cupCakeSpeed
    );
    cupCake.draw();
    cupCakeXPosition += 150;
    cupCakes.push(cupCake);
  }


  for (let i = 0; i < 6; i++) {
    cookiesJar = new Component(
      150,
      70,
      cookiesImg,
      cookiesJarXPosition,
      cookiesJarYposition,
      cookiesJarSpeed
    );
    cookiesJar.draw();
    cookiesJarXPosition += 300;
    cookiesJars.push(cookiesJar);
  }


}

//MOVE OBSTACLES
function moveCupcakes() {
  cupCakes.forEach(function (eachCupCake) {
    eachCupCake.x -= eachCupCake.speed;
    eachCupCake.draw();
  });

  cookiesJars.forEach(function (eachCookiesJar) {
    eachCookiesJar.x -= eachCookiesJar.speed;
    eachCookiesJar.draw();
  });
}

//CREATE NEW OBSTACLES
function createNewCupCake() {
  if (game.frame % 280 === 0) {
    cupCake = new Component(
      65,
      70,
      randomArrayElement(cupCakeImgs),
      1200,
      randomArrayElement(cupCakeYPositions),
      cupCakeSpeed
    );
    cupCakes.push(cupCake);
  }

  if (game.frame % 200 === 0) {
    cookiesJar = new Component(
      150,
      70,
      cookiesImg,
      1200,
      cookiesJarYposition,
      cookiesJarSpeed
    );
    cookiesJars.push(cookiesJar)
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
}

//CHECK IF WIN GAME

function winGame() {
  if (teaCup.x > 1120 && teaCup.y <= 33) {
    game.stop();
    kettle.stopTimer();
    // resetSugarRush();
    ctx.drawImage(youWinImg, 400, 120, 400, 100);
    winSound.play();
  }
}

//GAME OVER WHEN TIME ELAPSED

function gameOver() {
  game.stop();
  kettle.stopTimer();
  // resetSugarRush();
  ctx.drawImage(gameOverImg, 500, 140, 320, 110);
  gameOverSound.play();
}


//INCREASE/DECREASE SPEED OF CUPCAKES EVERY 7 SEC
// function startSugarRush() {
//   sugarRush = setInterval(function(){
//     cupCakeSpeed*=2;
//     cookiesJarSpeed*=2;
//     cupCakes.forEach(function(eachCupCake){
//       eachCupCake.speed*=2;
//     })
//     cookiesJars.forEach(function(eachCookiesJar){
//       eachCookiesJar.speed*=2;
//     })
// },7000);

//   clearSugarRush = setInterval(function(){
//     cupCakeSpeed/=2;
//     cookiesJarSpeed/=2;
//   cupCakes.forEach(function(eachCupCake){
//     eachCupCake.speed/=2;
//   })
//   cookiesJars.forEach(function(eachCookiesJar){
//     eachCookiesJar.speed/=2;
//   })

// },8500);

// }


function resetSugarRush(){
  clearInterval(sugarRush);
  clearInterval(clearSugarRush);
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

  stopTimer:function(){
    clearInterval(this.interval);
  }
};

function moveTimer() {
  if (gameTime > 0) {
    console.log(gameTime);
    ctxTimer.fillStyle = "white";
    ctxTimer.fillRect(0,0,canvasTimer.width,canvasTimer.height);
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
  moveCupcakes();
  createNewCupCake();
  checkCrash();
  winGame();
}

// ---EVENT LISTENERS---

//WAIT FOR THE PAGE TO FULLY LOAD BEFORE DRAWING THE GAME
window.onload = () => {
  game.createBoard();
  teaCup.draw();
  drawInitialCupCakes();
  ctxTimer.fillStyle = "white"
  ctxTimer.fillRect(0,0,canvasTimer.width,canvasTimer.height);
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

  //start game, timer and obstacle changing speed
  game.start();   
  kettle.startTimer();
  // startSugarRush() ;
});

