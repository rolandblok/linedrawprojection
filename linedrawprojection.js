//little script using processing.

var uniqueID = (function() {
  var id = 0; // This is the private persistent value
  // The outer function returns a nested function that has access
  // to the persistent value.  It is this nested function we're storing
  // in the variable uniqueID above.
  return function() { return id++; };  // Return and increment
})(); // Invoke the outer function after defining it.

var my_triangles = []
var my_lines = []
var view_projection_matrix



this.stats = new Stats();
document.body.appendChild(this.stats.dom);
stats.showPanel(0)  // 0: fps, 1: ms, 2: mb, 3+: custom

var gui = new dat.GUI();
var settings = []
var setup_done = false

// =================
// ===setup=========
// =================
function setup() {
  // createCanvas(400,400)
  // createCanvas(window.innerWidth, window.innerHeight, WEBGL)
  createCanvas(window.innerWidth, window.innerHeight)
  // createCanvas(window.innerWidth, window.innerHeight,SVG)
  // https://github.com/zenozeng/p5.js-svg/
  // https://makeyourownalgorithmicart.blogspot.com/2018/03/creating-svg-with-p5js.html
  // https://stackoverflow.com/questions/23218174/how-do-i-save-export-an-svg-file-after-creating-an-svg-with-d3-js-ie-safari-an
  
  noLoop();
  window.addEventListener("resize", this.resize, false);
  
  window.addEventListener("focus", function(event) { console.log( "window has focus"); paused = false }, false);
  window.addEventListener("blur", function(event) { console.log( "window lost focus");paused = true }, false);
  


  c = [20,0,0]
  b = [0,20,0]
  a = [0,0,20]
  my_triangles.push(new MyTriangle(a,b,c))

  let s = my_sphere([50,0,0], 50, 2 )
  my_triangles = my_triangles.concat(s)
  s = my_sphere([0,50,0], 20, 2 )
  my_triangles = my_triangles.concat(s)

  
  my_lines.push(new MyLine([0,0,0], [100,0,0], [255,0,0]))
  my_lines.push(new MyLine([0,0,0], [0,100,0], [0,255,0]))
  my_lines.push(new MyLine([0,0,0], [0,0,100], [0,0,255]))



  var gui_folder_camera = gui.addFolder('Camera')
  settings.camera_x = 100
  settings.camera_y = 100
  settings.camera_z = 100
  gui_folder_camera.add(settings,'camera_x').onChange(function(v){draw()})
  gui_folder_camera.add(settings,'camera_y').onChange(function(v){draw()})
  gui_folder_camera.add(settings,'camera_z').onChange(function(v){draw()})
  settings.look_at_x= 0
  settings.look_at_y= 0
  settings.look_at_z = 0
  gui_folder_camera.add(settings,'look_at_x').onChange(function(v){draw()})
  gui_folder_camera.add(settings,'look_at_y').onChange(function(v){draw()})
  gui_folder_camera.add(settings,'look_at_z').onChange(function(v){draw()})
  gui_folder_camera.open()

  setup_done = true

}

// =================
// ===draw==========
// =================
var last_time_ms = 0
var dirs = [-1, 1]

function draw() {
  if (!setup_done) return
  
  this.stats.begin();

  dt_ms = millis() - last_time_ms
  last_time_ms = millis()
  
    // setup camera
    let cam_pos =     [settings.camera_x,  settings.camera_y,  settings.camera_z]
    let cam_look_at = [settings.look_at_x, settings.look_at_y, settings.look_at_z]
  
    let view_matrix = lookAt4m(cam_pos, cam_look_at, [0,0,1])
    let projection_matrix = perspective4m(0.4, 1) //  fovy, aspect
    view_projection_matrix = multiply4m(projection_matrix, view_matrix)


    for (let my_triangle of my_triangles) {
      my_triangle.project(view_projection_matrix)
    }
    
    for (my_line of my_lines) {
      my_line.project(view_projection_matrix)
    }

  
  // draw scene
  background(200,200,200); // Set the background to white

  
  for (let my_triangle of my_triangles) {
    my_triangle.draw2d(window.innerWidth, window.innerHeight)
  }
  for (my_line of my_lines) {
    my_line.draw2d(window.innerWidth, window.innerHeight)
  }


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