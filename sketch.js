var bg, bgImg
var bottomGround
var topGround
var balloon, balloonImg
var obsG1, obsG2, obsG3;
var obsA1, obsA2;
var obsG1Image, obsG2Image, obsG3Image;
var obsA1Image, obsA2Image;
var bottomObsGroup, topObsGroup;
var gameState = 0;
var restart, gameOver;
var restartImg, gameOverImg;
var score = 0;
var scoreBarGroup;
var lifeCount = 3;
var lifeCountImg;
var dieSound , gameOverSound;


function preload() {
  bgImg = loadImage("assets/bg.png");
  obsG1Image = loadImage("assets/obsBottom1.png")
  obsG2Image = loadImage("assets/obsBottom2.png")
  obsG3Image = loadImage("assets/obsBottom3.png")
  obsA1Image = loadImage("assets/obsTop1.png")
  obsA2Image = loadImage("assets/obsTop2.png")
  balloonImg = loadAnimation("assets/balloon1.png", "assets/balloon2.png", "assets/balloon3.png")
  restartImg = loadImage("assets/restart.png");
  gameOverImg = loadImage("assets/gameOver.png");
  lifeCountImg = loadImage("assets/heartimage.png");
  dieSound = loadSound("assets/die.mp3");
  gameOverSound = loadSound("assets/gameOver.wav");
}

function setup() {

  createCanvas(900, 600);
  bottomObsGroup = new Group();
  topObsGroup = new Group();
  scoreBarGroup = new Group();
  //background image
  bg = createSprite(165, 485, 1, 1);
  bg.addImage(bgImg);
  bg.scale = 1.5;

  //creating top and bottom grounds
  bottomGround = createSprite(200, 600, 800, 20);
  bottomGround.visible = false;

  topGround = createSprite(200, 0, 800, 5);
  topGround.visible = false;

  //creating balloon     
  balloon = createSprite(100, 200, 20, 50);
  balloon.addAnimation("balloon", balloonImg);
  balloon.scale = 0.2;
  restart = createSprite(width / 2, height / 2 + 50);
  restart.addImage(restartImg);
  restart.scale = 0.7;

  gameOver = createSprite(width / 2, height / 2 - 50);
  gameOver.addImage(gameOverImg);

  restart.visible = false;
  gameOver.visible = false;







}

function draw() {
  background("black");

  if (gameState === 0) {
    //making the hot air balloon jump
    if (keyDown("space")) {
      balloon.velocityY = -4;
    }
    //adding gravity
    balloon.velocityY = balloon.velocityY + 0.1;
    bg.velocityX = -4;
    if (bg.x < 0) {
      bg.x = bg.width / 2;
    }
    spawnGroundObs();
    spawnTopObs();

    balloon.isTouching(scoreBarGroup, increaseScore);
    balloon.isTouching(bottomObsGroup, checkCollisionBottom);
    balloon.isTouching(topObsGroup, checkCollisionTop);
    balloon.isTouching(bottomGround, checkCollision);
    balloon.isTouching(topGround,checkCollision);


  }
  else {
    bg.velocityX = 0;
    bottomObsGroup.setVelocityXEach(0);
    topObsGroup.setVelocityXEach(0);
    bottomObsGroup.setLifetimeEach(-1);
    topObsGroup.setLifetimeEach(-1);
    scoreBarGroup.setVelocityXEach(0);
    scoreBarGroup.setLifetimeEach(-1);



  }




  balloon.collide(bottomGround);
  balloon.collide(topGround);

  if (mousePressedOver(restart)) {
    reset();
  }




  drawSprites();

  textSize(20);
  text("Score = " + score, 750, 50);

  for (var i = 0; i < lifeCount; i++) {
    image(lifeCountImg, 750 + i * 30, 70, 20, 20);


  }



}

function checkCollision(spriteA, spriteB) {

  lifeCount--;
  spriteA.y=height/2 

  dieSound.play();
  
  if (lifeCount <= 0) {

    gameIsOver();

  }

}

function checkCollisionBottom(spriteA, spriteB) {

  lifeCount--;
  bottomObsGroup.remove(spriteB);
  dieSound.play();
  

  if (lifeCount <= 0) {

    gameIsOver();
  }

}

function checkCollisionTop(spriteA, spriteB) {

  lifeCount--;
  topObsGroup.remove(spriteB);
  dieSound.play();
  

  if (lifeCount <= 0) {

    gameIsOver();
  }

}

function gameIsOver(){

  gameState = 1;
    restart.visible = true;
    gameOver.visible = true;
    restart.depth = balloon.depth + 1;
    gameOver.depth = balloon.depth + 1;
    gameOverSound.play();

}

function increaseScore(spriteA, spriteB) {
  score += 20;
  spriteB.destroy();
}

function reset() {

  gameState = 0;
  restart.visible = false;
  gameOver.visible = false;
  balloon.x = 100;
  balloon.y = 200;
  bottomObsGroup.destroyEach();
  topObsGroup.destroyEach();
  scoreBarGroup.destroyEach();
  score = 0;
  lifeCount=3

}


function spawnGroundObs() {
  if (frameCount % 100 === 0) {
    groundObs = createSprite(width + 50, height - random(100, 150));
    var scoreBar = createSprite(width + 50, height / 2, 10, height);
    scoreBar.visible = false;
    var randomNum = Math.round(random(1, 3));
    switch (randomNum) {
      case 1: groundObs.addImage(obsG1Image);
        break;

      case 2: groundObs.addImage(obsG2Image);
        break;

      case 3: groundObs.addImage(obsG3Image);
        break;
      default: break;
    }
    groundObs.velocityX = -(4+Math.floor(score/100));
    scoreBar.velocityX = -(4+Math.floor(score/100));
    groundObs.scale = 0.17;
    groundObs.lifetime = 250;
    scoreBar.lifetime = 250;
    bottomObsGroup.add(groundObs);
    scoreBarGroup.add(scoreBar);
    balloon.depth = groundObs.depth + 1;
  }
}

//spawningTopObs
function spawnTopObs() {

  if (frameCount % 169 === 0) {
    topObs = createSprite(width + 50, random(0, 200));
    var scoreBar = createSprite(width + 50, height / 2, 10, height);
    scoreBar.visible = false;
    var randomNum = Math.round(random(1, 2));
    switch (randomNum) {
      case 1: topObs.addImage(obsA1Image);
        break;

      case 2: topObs.addImage(obsA2Image);
        break;
      default: break;
    }
    topObs.velocityX = -(5+Math.floor(score/100));
    topObs.scale = 0.1;
    topObs.lifetime = 250;
    scoreBar.velocityX = -(5+Math.floor(score/100));
    scoreBar.lifetime = 250;
    scoreBarGroup.add(scoreBar);
    topObsGroup.add(topObs);
    balloon.depth = topObs.depth + 1;
  }
}



