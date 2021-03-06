// Move away from other boids that are too close to avoid colliding
function avoidOthers(boid) {
  if (boid.IsGoal) return;
  let moveX = 0;
  let moveY = 0;
  for (let otherBoid of boids) {
    if (otherBoid !== boid && !otherBoid.IsGoal) {
      if (distance(boid, otherBoid) < r_dispersion) {
        var u = unitVektor(boid.x - otherBoid.x, boid.y - otherBoid.y)
        moveX += u[0];
        moveY += u[1];
      }
    }
  }

  boid.dx += moveX * k_dispersion;
  boid.dy += moveY * k_dispersion;
}




function raceForGoal(boid) {
  if (boid.IsGoal) return;
  var dis = distance(boid, boid.Goal);
  if(dis <= 5){
    boid.Goal.IsEmpty = false
    boid.IsGoal = true
    numBoidInGoal++;
    if(numBoidInGoal === goals.length){
      pause = true;
    }
    console.log("Bir hedef doldu.")
  }
  if(boid.Goal.IsEmpty){
    var u = unitVektor(boid.Goal.x - boid.x, boid.Goal.y - boid.y)
    boid.dx += u[0] * k_align;
    boid.dy += u[1] * k_align;
    
  }
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
  initGoals();
  initBoids();

  // Schedule the main animation loop
  window.requestAnimationFrame(animationLoop);
};
