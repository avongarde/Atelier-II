// Francisco Samayoa, Annie Zhang, Isaak Shingray ~ Assignment 1: Mushroom Forest
// fern, tint and grass

// https://p5js.org/examples/interaction-wavemaker.html

// Spring drawing constants for top bar
// var springHeight = 32,
//     left,
//     right,
//     maxHeight = 400,
//     minHeight = 200,
//     over = false,
//     move = false;

// Spring simulation constants
// var M = 0.8,  // Mass
//     K = 0.2,  // Spring constant
//     D = 0.92, // Damping
//     R = 150;  // Rest position

// Spring simulation variables
// var ps = R,   // Position
//     vs = 0.0, // Velocity
//     as = 0,   // Acceleration
//     f = 0;    // Force

let offset = 0.5;
let easing = 0.05;
var mushroom, smallMushroom;

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
  // mushroom2 = loadImage("mushroom2.jpg")
  smallMushroom = loadImage("smallMushroom.png");

  soundFormats('mp3', 'ogg');
  mySound = loadSound('passthehours.mp3');
}

function setup() {
  createCanvas(window.innerWidth, window.innerHeight);
  frameRate(30);
  imageMode(CENTER);
  noStroke();
  background(255, 10);
  // image()
  // smallMushroom.loadPixels();
  // mushroom.loadPixels();
  // mushroom.blend(smallMushroom, 0, 0, window.innerWidth, window.innerHeight, 0, 0, window.innerWidth,
  //   window.innerHeight, ADD);
  // image(smallMushroom, width/2, height/2);
  image(mushroom, width/2, height/2);
  //image(mushroom2, 0, 0);
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
  // background(112, 0, 102, 10);
  // grass();
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
  // if (newUp == true) {
  //   tint(0, 153, 204);
  //   image(mushroom, offset, 0);
  // } else if (newRight == true) {
  //   tint(204, 153, 0);
  //   image(mushroom, offset, 0);
  // } else if (newLeft == true) {
  //   tint(0, 204, 153);
  //   image(mushroom, offset, 0);
  // } else if (newDown == true) {
  //   tint(255, 126);
  //   image(mushroom, offset, 0);
  // }
  grass();
  // if (over) {
  //   updateSpring();
  //   drawSpring();
  //   // clear();
  // }

  stroke(255, opacity);
  opacity *= 0.99;
  translate(width/2, height);
  var angle = random(0, 6.14);
  // branch(281, angle);
  // branch(500, angle);

  let dx = newX - mushroom.width / 2 - offset;
  offset += dx * easing;
  let dy = newY - mushroom.height /  - offset;
  offset += dy * easing;
  tint(255, 127); // Display at half opacity
  image(mushroom, offset, 0);
  branch(281, angle);
}

function branch(length, theta) {
  line(0, 0, 0, -length);
  translate(0, -length);

  var a = random(1.0);

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
//
// function keyReleased(){
//
//   // Send Data to the server to draw it in all other canvases
//   // dataServer.publish(
//   //   {
//   //     channel: channelName,
//   //     message:{
//   //
//   //      x: mouseX,
//   //      y: mouseY
//   //
//   //          //get the value from the text box and send it as part of the message
//   //     }
//   //   });
// }

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

// function drawSpring() {
//   // Draw base
//   // tint(0);
//   fill(226, 255, 140);
//   var baseWidth = 0.5 * ps + -8;
//   // rect(width/2 - baseWidth, ps + springHeight, width/2 + baseWidth, height);
//   rect(mouseX - baseWidth, mouseY + springHeight, width/2 + baseWidth, height);
//
//   // Set color and draw top bar
//   // if (over || move) {
//   //   fill(255);
//   // } else {
//   //   fill(204);
//   // }
//     fill(244, 104, 66);
//       arc(left+100, ps+50, right-100, ps + springHeight+100, PI, TWO_PI);
//
// }

// function updateSpring() {
//   // Update the spring position
//   if ( !move ) {
//     f = -K * ( ps - R ); // f=-ky
//     as = f / M;          // Set the acceleration, f=ma == a=f/m
//     vs = D * (vs + as);  // Set the velocity
//     ps = ps + vs;        // Updated position
//   }
//
//   if (abs(vs) < 0.1) {
//     vs = 0.0;
//   }
//
//   // Test if mouse if over the top bar
//   if (mouseX <width && mouseY < height + springHeight) {
//     over = true;
//   } else {
//     over = false;
//   }
//
//   // Set and constrain the position of top bar
//   if (move) {
//     ps = mouseY - springHeight/2;
//     ps = constrain(ps, minHeight, maxHeight);
//   }
// }

// function mousePressed() {
//   if (over) {
//     updateSpring();
//     drawSpring();
//     move = true;
//   }
// }
//
// function mouseReleased() {
//   move = false;
//   updateSpring();
//   drawSpring();
// }

// function keyPressed() {
//   if (keyCode === UP_ARROW) {
//     tint(0, 153, 204, 126);
//     image(mushroom, offset, 0);
//   } else if (keyCode === RIGHT_ARROW) {
//     tint(204, 153, 0, 126);
//     image(mushroom, offset, 0);
//   } else if (keyCode === LEFT_ARROW) {
//     tint(0, 204, 153, 126);
//     image(mushroom, offset, 0);
//   } else if (keyCode === DOWN_ARROW) {
//     tint(255, 126);
//     image(mushroom, offset, 0);
//   }
//
//   // return false; // prevent default
// }
