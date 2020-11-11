var PLAY = 1;
var END = 0;
var gameState = PLAY;

var trex, trex_running, trex_collided,trex_bend;
var ground, invisibleGround, groundImage;

var cloudsGroup, cloudImage;
var obstaclesGroup, obstacle1, obstacle2, obstacle3, obstacle4, obstacle5, obstacle6;

var score;

var gameOverImg,restartImg;
var jumpSound , checkPointSound, dieSound;

var groundspeed=-12;

var switc=false;
function preload(){
  trex_running = loadAnimation("trex1.png","trex3.png","trex4.png");
  trex_collided = loadAnimation("trex_collided.png");
  
  trex_bend=loadAnimation("trex.png","trexb.png");
  
  groundImage = loadImage("ground2.png");
  
  cloudImage = loadImage("cloud.png");
  
  obstacle1 = loadImage("obstacle1.png");
  obstacle2 = loadImage("obstacle2.png");
  obstacle3 = loadImage("obstacle3.png");
  obstacle4 = loadImage("obstacle4.png");
  obstacle5 = loadImage("obstacle5.png");
  obstacle6 = loadImage("obstacle6.png");
  
   restartImg = loadImage("restart.png")
  gameOverImg = loadImage("gameOver.png")
  
  jumpSound = loadSound("jump.mp3")
  dieSound = loadSound("die.mp3")
  checkPointSound = loadSound("checkPoint.mp3")
}

function setup() {
  var canvas =createCanvas(600, 150);
  canvas.position(windowWidth/2-300,windowHeight/2-150)
  trex = createSprite(50,130,20,50);
  trex.addAnimation("running", trex_running);
  trex.addAnimation("collided" ,trex_collided);
  trex.addAnimation("bending",trex_bend);
  trex.scale = 0.5;
  
  ground = createSprite(200,130,400,20);
  ground.addImage("ground",groundImage);
  ground.x = ground.width /2;
  
   gameOver = createSprite(300,55);
  gameOver.addImage(gameOverImg);
  
  restart = createSprite(300,100);
  restart.addImage(restartImg);
  
  gameOver.scale = 0.5;
  restart.scale = 0.5;
  
  invisibleGround = createSprite(200,130,400,10);
  invisibleGround.visible = false;
  
  //create Obstacle and Cloud Groups
  obstaclesGroup = createGroup();
  cloudsGroup = createGroup();
  
  
  trex.setCollider("rectangle",0,0,80,80);
    
  score = 0;
  
}

function draw() {
    background("grey");
  if(switc==true){
  background("grey");
  fill("#00224b")
  }
  if(switc==false){
  background("#00224b");
  fill("white");
}
    if(Math.round(score)%700==0){
        switc=!switc;
    }
  //displaying score
  text("Score: "+ Math.round(score), 500,50);
  
   
  if(gameState === PLAY){
    gameOver.visible = false;
    restart.visible = false;
    //move the ground
    ground.velocityX = groundspeed;
    //scoring
    score = score + 0.2;
    
    if (ground.x < 0){
      ground.x = ground.width/2;
    }
    
    //jump when the space key is pressed
    if(keyDown("space") && trex.y >= 100) {
        trex.velocityY = -25;
        jumpSound.play();
        trex.changeAnimation("running", trex_running);
        trex.scale = 0.5;
    }
    else if(keyDown("up_arrow") && trex.y >= 100){
        trex.velocityY = -25;
        jumpSound.play();
        trex.changeAnimation("running", trex_running);
        trex.scale = 0.5;
    }
    if(keyDown("down_arrow")){
       trex.setCollider("rectangle",0,0,80,40);
      trex.changeAnimation("bending",trex_bend);
        trex.scale=0.6;
       }
      if(keyWentUp('down_arrow')){
          trex.changeAnimation("running", trex_running);
                trex.setCollider("rectangle",0,0,80,80);
          trex.scale=0.5;
      }
    
      if(score>0 && score%700==0){
      groundspeed-=1;
    }
    if(score>0 && Math.round(score)%100==0){
      checkPointSound.play();
    }
    
    //add gravity
    trex.velocityY = trex.velocityY + 3;
  
    //spawn the clouds
    spawnClouds();
  
    //spawn obstacles on the ground
    spawnObstacles();
    
    if(obstaclesGroup.isTouching(trex)){
        gameState = END;
        dieSound.play();
    }
  }
   else if (gameState === END) {
      gameOver.visible = true;
      restart.visible = true;
      ground.velocityX = 0;
      trex.velocityY = 0
     
      //change the trex animation
      trex.changeAnimation("collided", trex_collided);
     
      //set lifetime of the game objects so that they are never destroyed
    obstaclesGroup.setLifetimeEach(-1);
    cloudsGroup.setLifetimeEach(-1);
     
     obstaclesGroup.setVelocityXEach(0);
     cloudsGroup.setVelocityXEach(0);
     
     
   }
  
 
  //stop trex from falling down
  trex.collide(invisibleGround);
  
  if(mousePressedOver(restart)&&gameState==END){
    reset();
  }
  
  drawSprites();
}

function spawnObstacles(){
 if (frameCount % 60 === 0){
   var obstacle = createSprite(630,110,10,40);
   obstacle.velocityX = groundspeed;
   
    //generate random obstacles
    var rand = Math.round(random(1,6));
    switch(rand) {
      case 1: obstacle.addImage(obstacle1);
              break;
      case 2: obstacle.addImage(obstacle2);
              break;
      case 3: obstacle.addImage(obstacle3);
              break;
      case 4: obstacle.addImage(obstacle4);
              break;
      case 5: obstacle.addImage(obstacle5);
              break;
      case 6: obstacle.addImage(obstacle6);
              break;
      default: break;
    }
   
    //assign scale and lifetime to the obstacle           
    obstacle.scale = 0.5;
    obstacle.lifetime = 300;
   
   //add each obstacle to the group
    obstaclesGroup.add(obstacle);
 }
}

function spawnClouds() {
  //write code here to spawn the clouds
  if (frameCount % 60 === 0) {
     cloud = createSprite(600,100,40,10);
    cloud.y = Math.round(random(10,60));
    cloud.addImage(cloudImage);
    cloud.scale = 0.5;
    cloud.velocityX = -3;
    
     //assign lifetime to the variable
    cloud.lifetime = 200;
    
    //adjust the depth
    cloud.depth = trex.depth;
    trex.depth = trex.depth + 1;
    
    //adding cloud to the group
   cloudsGroup.add(cloud);
    }
}
function reset(){
  gameState=PLAY;
  obstaclesGroup.destroyEach();
  cloudsGroup.destroyEach();
  trex.changeAnimation("running", trex_running);
  score=0;
  groundspeed=-12
  switc=false;
}
