// Size of canvas. These get updated to fill the whole browser.
let width = 150;
let height = 150;

const numBoids = 6;
const visualRange = 100;

var boids = [];
var goals = [];
var numBoidInGoal = 0;
var colors = ["#ffffff", "#ff0000", "#00ff00", "#0000ff", "#ffff00", "#00ffff", "#ff00ff", "#aaaaaa", "#cc3300", "#33cc00"]

var milisaniye=0, saniye = 0, dakika = 0, pause = false;

function tick() {
  if(milisaniye < 10) milisaniye++;
  else if(saniye < 59) {
    milisaniye = 0;
    saniye++;
  }else{
    saniye = 0;
    dakika++;
  }
  document.getElementById("sure").innerHTML = dakika + ":" + saniye + "." + milisaniye;
  if(!pause) setTimeout(tick, 20);
}

function initBoids() {
  var centercoord = [Math.round(width / 4), Math.round(height / 2)]
  for (var i = 0; i < numBoids; i += 1) {
    boids[boids.length] = {
      x: centercoord[0] + Math.random() * 50 - 25,
      y: centercoord[1] + Math.random() * 50 - 25,
      // x:  200 + Math.random() * (Math.round(width / 2) - 200),
      // y: Math.random() * height,
      dx: Math.random() * 10 - 5,
      dy: Math.random() * 10 - 5,
      color: colors[i % colors.length],
      history: [],
      IsGoal: false,
    };
  }
}

function initGoals() {
  var margin = 200;
  var centercoord = [Math.round(3 * width / 4), Math.round(height / 2)]
  var dAngle = 2 * Math.PI / numBoids;
  for (var i = 0; i < numBoids; i += 1) {
    goals[goals.length] = {
      // x: Math.round(width / 2) + Math.random() * (Math.round(width / 2) - margin),
      // y: margin + Math.random() * (height - 2 * margin),
      x: centercoord[0] + Math.cos(dAngle * i) * 150,
      y: centercoord[1] + Math.sin(dAngle * i) * 150,
      IsEmpty: true,
    };
  }
}

function distance(boid1, boid2) {
  return Math.sqrt(
    (boid1.x - boid2.x) * (boid1.x - boid2.x) +
      (boid1.y - boid2.y) * (boid1.y - boid2.y),
  );
}


// Called initially and whenever the window resizes to update the canvas
// size and width/height variables.
function sizeCanvas() {
  const canvas = document.getElementById("boids");
  width = window.innerWidth;
  height = window.innerHeight;
  canvas.width = width;
  canvas.height = height;
}


function unitVektor(x, y) {
    var angle = Math.atan2(y, x);
    return [Math.cos(angle) * 1, Math.sin(angle) * 1];
}



// Move away from other boids that are too close to avoid colliding
function avoidOthers(boid) {
  if (boid.IsGoal) return;
  const minDistance = 50; // The distance to stay away from other boids
  const avoidFactor = 0.5; // Adjust velocity by this %
  let moveX = 0;
  let moveY = 0;
  for (let otherBoid of boids) {
    if (otherBoid !== boid && !otherBoid.IsGoal) {
      if (distance(boid, otherBoid) < minDistance) {
        var u = unitVektor(boid.x - otherBoid.x, boid.y - otherBoid.y)
        moveX += u[0];
        moveY += u[1];
      }
    }
  }

  boid.dx += moveX * avoidFactor;
  boid.dy += moveY * avoidFactor;
}



// Speed will naturally vary in flocking behavior, but real animals can't go
// arbitrarily fast.
function limitSpeed(boid) {
  const speedLimit = 5;

  const speed = Math.sqrt(boid.dx * boid.dx + boid.dy * boid.dy);
  if (speed > speedLimit) {
    boid.dx = (boid.dx / speed) * speedLimit;
    boid.dy = (boid.dy / speed) * speedLimit;
  }
}

function raceForGoal(boid) {
  if (boid.IsGoal) return;
  let nearestGoal = null;
  let distanceGoal = 10000000;
  for (let goal of goals) {
    var dis = distance(boid, goal);
    if (goal.IsEmpty && distanceGoal > dis){
      nearestGoal = goal;
      distanceGoal = dis;
      if(dis <= 10){
        goal.IsEmpty = false
        boid.IsGoal = true
        numBoidInGoal++;
        if(numBoidInGoal === goals.length){
          pause = true;
        }
        //delete boid
        // for( var i = 0; i < boids.length; i++){ 
        //   if ( boids[i] == boid) { 
        //     boids.splice(i, 1); 
        //   }
      // }
        console.log("Bir hedef doldu.")
      }
    }
  }
  if(nearestGoal){
    var u = unitVektor(nearestGoal.x - boid.x, nearestGoal.y - boid.y)
    boid.dx += u[0];
    boid.dy += u[1];
  }
}

const DRAW_TRAIL = true;

function drawBoid(ctx, boid) {
  if (!boid.IsGoal) {
    const angle = Math.atan2(boid.dy, boid.dx);
    ctx.translate(boid.x, boid.y);
    ctx.rotate(angle);
    ctx.translate(-boid.x, -boid.y);
    ctx.fillStyle = boid.color; // "#558cf4";
    ctx.beginPath();
    ctx.moveTo(boid.x, boid.y);
    ctx.lineTo(boid.x - 15, boid.y + 5);
    ctx.lineTo(boid.x - 15, boid.y - 5);
    ctx.lineTo(boid.x, boid.y);
    ctx.fill();
    ctx.setTransform(1, 0, 0, 1, 0, 0); 
  }
  if (DRAW_TRAIL) {
    ctx.strokeStyle = boid.color; //"#558cf466";
    ctx.beginPath();
    ctx.moveTo(boid.history[0][0], boid.history[0][1]);
    for (const point of boid.history) {
      ctx.lineTo(point[0], point[1]);
    }
    ctx.stroke();
  }
}

function drawGoal(ctx, goal) {
  // const angle = Math.atan2(boid.dy, boid.dx);
  // ctx.translate(boid.x, boid.y);
  // ctx.rotate(angle);
  // ctx.translate(-boid.x, -boid.y);
  ctx.fillStyle = "#00ff00";
  if (!goal.IsEmpty) {
    ctx.fillStyle = "#ff0000";
  }
  ctx.beginPath();
  ctx.moveTo(goal.x -5, goal.y -5);
  ctx.lineTo(goal.x -5, goal.y + 5);
  ctx.lineTo(goal.x + 5, goal.y + 5);
  ctx.lineTo(goal.x + 5, goal.y -5);
  ctx.lineTo(goal.x -5, goal.y -5);
  ctx.stroke();
  ctx.fill();
  ctx.setTransform(1, 0, 0, 1, 0, 0);

}

// Main animation loop
function animationLoop() {
  // Update each boid
  for (let boid of boids) {
    // Update the velocities according to each rule
    avoidOthers(boid);
    raceForGoal(boid);
    limitSpeed(boid);

    if(!boid.IsGoal){
      // Update the position based on the current velocity
      boid.x += boid.dx;
      boid.y += boid.dy;
      boid.history.push([boid.x, boid.y])
      // boid.history = boid.history.slice(-50); // Bu satır silinecek
    }
  }

  // Clear the canvas and redraw all the boids in their current positions
  const ctx = document.getElementById("boids").getContext("2d");
  ctx.clearRect(0, 0, width, height);
  for (let boid of boids) {
    drawBoid(ctx, boid);
  }
  for (let goal of goals){
    drawGoal(ctx, goal);
  }

  // Schedule the next frame
  window.requestAnimationFrame(animationLoop);
}

window.onload = () => {
  tick();
  // Make sure the canvas always fills the whole window
  window.addEventListener("resize", sizeCanvas, false);
  sizeCanvas();

  // Randomly distribute the boids to start
  initBoids();
  initGoals();

  // Schedule the main animation loop
  window.requestAnimationFrame(animationLoop);
};
