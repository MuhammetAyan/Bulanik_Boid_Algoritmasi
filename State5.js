
// Find the center of mass of the other boids and adjust velocity slightly to
// point towards the center of mass.
function boidRules(boid) {
  if (boid.IsGoal) return;

  let centerX = 0;
  let centerY = 0;

  for (let otherBoid of boids) {
    var dis = distance(boid, otherBoid);
    if (otherBoid !== boid && !otherBoid.IsGoal && !boid.IsGoal) {
      // if(fuzzy_dispersion(dis) > 0){
        var u = unitVektor(boid.x - otherBoid.x, boid.y - otherBoid.y)
        centerX -= u[0] * fuzzy_dispersion(dis)
        centerY -= u[1] * fuzzy_dispersion(dis)
      // }
      // if(fuzzy_align(dis) > 0){
        // The resultant force will be zero so that the alignment can go to the goal.
        // var u = unitVektor(otherBoid.dx, otherBoid.dy)
        // centerX -= u[0] * fuzzy_align(dis)
        // centerY -= u[1] * fuzzy_align(dis)
      // }
      // if(fuzzy_cohesion(dis) > 0){
        var u = unitVektor(boid.x - otherBoid.x, boid.y - otherBoid.y)
        centerX -= u[0] * fuzzy_cohesion(dis)
        centerY -= u[1] * fuzzy_cohesion(dis)
      // }
    }
  }
  boid.dx += centerX;
  boid.dy += centerY;
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
    var u = unitVektor(nearestGoal.x - boid.x, nearestGoal.y - boid.y);
    boid.dx += u[0] * 0.5 //fuzzy_align(dis)
    boid.dy += u[1] * 0.5//fuzzy_align(dis)
  }
}



// Main animation loop
function animationLoop() {
  // Update each boid
  for (let boid of boids) {
    // Update the velocities according to each rule
    boidRules(boid);  
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
