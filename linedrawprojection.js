//little script using processing.

var uniqueID = (function() {
  var id = 0; // This is the private persistent value
  // The outer function returns a nested function that has access
  // to the persistent value.  It is this nested function we're storing
  // in the variable uniqueID above.
  return function() { return id++; };  // Return and increment
})(); // Invoke the outer function after defining it.


this.stats = new Stats();
document.body.appendChild(this.stats.dom);
stats.showPanel(0)  // 0: fps, 1: ms, 2: mb, 3+: custom
var stats_energy_panel = stats.addPanel( new Stats.Panel( 'energy', '#ff8', '#221' ) );

// var p5_gui = createGui('roland')

var p5gui;
var p5gui_params = {
  speed: 1,  speedMin : 0.1, speedMax: 5, speedStep: 0.05,
  gravity: 100, gravityMin:0, gravityMax: 500, gravityStep: 1
}




// =================
// ===setup=========
// =================
function setup() {
  // createCanvas(400,400)
  createCanvas(window.innerWidth, window.innerHeight)
  window.addEventListener("resize", this.resize, false);
  
  window.addEventListener("focus", function(event) { console.log( "window has focus"); paused = false }, false);
  window.addEventListener("blur", function(event) { console.log( "window lost focus");paused = true }, false);
  

  sliderRange(0, 90, 1);
  var p5gui = createGui('roland').setPosition(width - 200, 0);;
  p5gui.addObject(p5gui_params);
  
}

// =================
// ===draw==========
// =================
var last_time_ms = 0
var dirs = [-1, 1]
function draw() {
  this.stats.begin();

  dt_ms = millis() - last_time_ms
  last_time_ms = millis()
  
  
  // draw scene
  background(255); // Set the background to white



  // draw the mouse
  fill(155);
  circle(mouseX, mouseY, 80);

  disks.forEach(disk => {disk.draw()});

  stats_energy_panel.update( system_energy(), this.max_energy*2 );
  this.stats.end();

}

let max_energy = 0
function system_energy() {
  let energy = 0; 
  disks.forEach(disk => {energy+= disk.energy()})
  energy *= 0.0001
  if (energy > max_energy)  this.max_energy = energy 
  return energy;
}


// =================
// ===MOUSE n KEYS=======
// =================
function mouseDragged(event) {
  RM = random(20,100)
  let new_circle = new MyCircle(event.x, event.y, RM)
  overlaps = false
  disks.forEach(disk => {
    if (new_circle.overlaps(disk)){overlaps = true} })
  if (!overlaps) {
    let new_disk = Disk.instanceFromCircle(new_circle, RM, random(-1,1)*220, random(-1,1)*220)
    disks.push(new_disk)
  }
} 
function mousePressed(event) {
  mouseDragged(event)
}
function keyPressed(event) {
  console.log("key " + event.key)
  if (event.key === 'p') {
    paused = !paused
  } else if (event.key === 'r') {
    disks = []    
  }

}


function resize() {
  console.log("resize")
  resizeCanvas(window.innerWidth, window.innerHeight)
}