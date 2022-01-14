const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");


function drawBasicCanvas() {
 ctx.fillStyle = "#ddb8b8";
  ctx.fillRect(0, 0, 1200, 85);
  ctx.fillRect(0, 310, 1200, 85);
  let teaPotImg = new Image();
  teaPotImg.src = "./images/teapot.png";
  teaPotImg.onload = function () {
  ctx.drawImage(teaPotImg, 1120, 5, 70, 70);
  };
}

class Component {
  constructor(width, height, img, x, y) {
    this.width = width;
    this.height = height;
    this.img = img;
    this.x = x;
    this.y = y;
  }

  draw() {
    ctx.fillStyle = this.color;
    ctx.fillRect(this.x, this.y, this.width, this.height)
    let compImg = new Image();
    compImg.src = this.img;
    compImg.onload = () => {
   ctx.drawImage(compImg, this.x, this.y, this.width, this.height);
    };
  }
}

const teaCup = new Component(60, 60, "./images/teacup.png", 570, 323);


  drawBasicCanvas();
  teaCup.draw();


  //add event listener to get the player moving to play game function so the teacup cannot move till the game starts