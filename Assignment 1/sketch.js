// Francisco Samayoa, Annie Zhang, Isaak Shingray ~ Assignment 1: Mushroom Forest

// https://p5js.org/examples/interaction-wavemaker.html

let offset = 0.5;
let easing = 0.05;
var mushroom, smallMushroom; // background images

var newX = 0; // mouseX > PubNub (Isaak)
var newX2 = 0; // mouseX > PubNub (Annie)
var newY = 0; // mouseY > PubNub (Isaak)
var newY2 = 0; // mouseY > PubNub (Annie)
var newUp = false;
var newDown = false;
var newLeft = false;
var newRight = false;
var t = 0; // time variable

var opacity = 255;

var dataServer;
var pubKey = 'pub-c-570f662f-35f0-48b0-be48-9e2b76cb7ecf';
var subKey = 'sub-c-f73902d4-1e53-11e9-b4a6-026d6924b094';

var channelName = "messageChannel";

var value = 0;

function preload() {
  mushroom = loadImage("mushroom.jpg");
  smallMushroom = loadImage("smallMushroom.png");

  soundFormats('mp3', 'ogg');
  mySound = loadSound('passthehours.mp3');
}

function setup() {
  createCanvas(window.innerWidth, window.innerHeight);
  frameRate(30); // slow the frame rate to save CPU
  imageMode(CENTER);
  noStroke();
  background(255, 10);
  image(mushroom, width/2, height/2);
  left = width/2 - 100;
  right = width/2 + 100;
  mySound.setVolume(0.5);
  mySound.play();
  // initialize pubnub
 dataServer = new PubNub(
 {
   publish_key   : pubKey,  //get these from the pubnub account online
   subscribe_key : subKey,
   ssl: true  //enables a secure connection. This option has to be used if using the OCAD webspace
 });

 //attach callbacks to the pubnub object to handle messages and connections
 dataServer.addListener({ message: readIncoming});
 dataServer.subscribe({channels: [channelName]});
}

function draw() {
  // Arrow keys controlling the image tint
  if (keyIsDown(UP_ARROW)) {
    tint(0, 153, 204);
    image(mushroom, offset, 0);
  } else if (keyIsDown(RIGHT_ARROW)) {
    tint(204, 153, 0);
    image(mushroom, offset, 0);
  } else if (keyIsDown(LEFT_ARROW)) {
    tint(0, 204, 153);
    image(mushroom, offset, 0);
  } else if (keyIsDown(DOWN_ARROW)) {
    tint(255, 126);
    image(mushroom, offset, 0);
  }
  // Call the grass function
  grass();

  stroke(255, opacity);
  opacity *= 0.99;
  translate(width/2, height);
  var angle = random(0, 6.14);

  let dx = newX - mushroom.width / 2 - offset;
  offset += dx * easing;
  let dy = newY - mushroom.height /  - offset;
  offset += dy * easing;
  tint(255, 127); // Display at half opacity
  image(mushroom, offset, 0);
  // Call the branch function after the image offsets
  branch(281, angle);
}

function branch(length, theta) {
  line(0, 0, 0, -length);
  translate(0, -length);

  if(length > 2){
    push();
      rotate(theta);
      branch(0.618 * length, theta);
    pop();
    push();
      rotate(-theta);
      branch(0.618 * length, theta);
    pop();
  }
}

function readIncoming(inMessage) //when new data comes in it triggers this function,
{                               // this works becsuse we subscribed to the channel in setup()

  // simple error check to match the incoming to the channelName
  if(inMessage.channel == channelName)
  {
    newX = inMessage.message.x;
    newX2 = inMessage.message.x2;
    newY = inMessage.message.y;
    newY2 = inMessage.message.y2;
    newUp = inMessage.message.up;
    newDown = inMessage.message.down;
    newLeft = inMessage.message.left;
    newRight = inMessage.message.right;
    //console.log(inMessage.message.x2, inMessage.message.y2);
  }
}

function grass(){
  // Make the grass green
  fill(40, 200, 40);

  // make a x and y grid of ellipses
  for (let x = 0; x <= width; x = x + 30) {
    for (let y = 500; y <= height; y = y + 30) {
      // starting point of each circle depends on mouse position
      let xAngle = map(mouseX, 0, width, -4 * PI, 4 * PI, true);
      let yAngle = map(mouseY, 0, height, -4 * PI, 4 * PI, true);
      // and also varies based on the particle's location
      let angle = xAngle * (x / width) + yAngle * (y / height);

      // each particle moves in a circle
      let myX = x + 20 * cos(2 * PI * t + angle);
      let myY = y + 20 * sin(2 * PI * t + angle);

      ellipse(myX, myY, 10); // draw particle
    }
  }
  t = t + 0.01; // update time
}
