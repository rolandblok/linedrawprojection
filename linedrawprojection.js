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

// var p5_gui = createGui('roland')
var p5gui;
var p5gui_params = {
  speed: 1,  speedMin : 0.1, speedMax: 5, speedStep: 0.05,
  gravity: 100, gravityMin:0, gravityMax: 500, gravityStep: 1,
  draw_mode: ['2d','3d', 'line']
}


var tria

// =================
// ===setup=========
// =================
function setup() {
  // createCanvas(400,400)
  // createCanvas(window.innerWidth, window.innerHeight, WEBGL)
  createCanvas(window.innerWidth, window.innerHeight,SVG)
  // https://github.com/zenozeng/p5.js-svg/
  // https://makeyourownalgorithmicart.blogspot.com/2018/03/creating-svg-with-p5js.html
  // https://stackoverflow.com/questions/23218174/how-do-i-save-export-an-svg-file-after-creating-an-svg-with-d3-js-ie-safari-an
  
  noLoop();
  window.addEventListener("resize", this.resize, false);
  
  window.addEventListener("focus", function(event) { console.log( "window has focus"); paused = false }, false);
  window.addEventListener("blur", function(event) { console.log( "window lost focus");paused = true }, false);
  

  sliderRange(0, 90, 1);
  var p5gui = createGui('roland').setPosition(width - 200, 0);;
  p5gui.addObject(p5gui_params);

  a = [100,0,0]
  b = [0,100,0]
  c = [0,0,100]
  tria = new triangle(a,b,c)
  
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
  background(200,200,200); // Set the background to white

  tria.draw2d(window.innerWidth, window.innerHeight)


  this.stats.end();

}


// =================
// ===MOUSE n KEYS=======
// =================
function mouseDragged(event) {
  RM = random(20,100)
} 
function mousePressed(event) {
  mouseDragged(event)
}
function keyPressed(event) {
  console.log("key " + event.key)
  if (event.key === 'p') {
    console.log('p')
  } 


}


function resize() {
  console.log("resize")
  resizeCanvas(window.innerWidth, window.innerHeight)
}