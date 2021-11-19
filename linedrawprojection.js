//little script using processing.

var uniqueID = (function () {
  var id = 0; // This is the private persistent value
  // The outer function returns a nested function that has access
  // to the persistent value.  It is this nested function we're storing
  // in the variable uniqueID above.
  return function () { return id++; };  // Return and increment
})(); // Invoke the outer function after defining it.


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
  addEventListener("resize", this.resize, false);

  window.addEventListener("focus", function (event) { console.log("window has focus"); paused = false }, false);
  window.addEventListener("blur", function (event) { console.log("window lost focus"); paused = true }, false);




  settings.downloadSvg = () => {
    let svgElement = document.getElementsByTagName('svg')[0];
    let svg = svgElement.outerHTML;
    let file = new Blob([svg], { type: 'plain/text' });
    let a = document.createElement("a"), url = URL.createObjectURL(file);

    a.href = url;
    a.download = 'exported.svg';
    document.body.appendChild(a);
    a.click();

    setTimeout(function () {
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    }, 0);
  }

  var gui_folder_draw = gui.addFolder('draw options')
  settings.draw_edges = true
  settings.draw_normal = false
  settings.draw_hatching = false
  gui_folder_draw.add(settings, 'draw_edges').onChange(function (v) { draw() })
  gui_folder_draw.add(settings, 'draw_normal').onChange(function (v) { draw() })
  gui_folder_draw.add(settings, 'draw_hatching').onChange(function (v) { draw() })
  gui_folder_draw.open()
  var gui_folder_frustrum = gui.addFolder('frustrum')
  settings.fov = 45
  settings.aspect = window.innerWidth / window.innerHeight
  settings.near = 0.2
  settings.far = 1000
  gui_folder_frustrum.add(settings, 'fov').onChange(function (v) { draw() })
  gui_folder_frustrum.add(settings, 'aspect').onChange(function (v) { draw() })
  gui_folder_frustrum.add(settings, 'near').onChange(function (v) { draw() })
  gui_folder_frustrum.add(settings, 'far').onChange(function (v) { draw() })
  // gui_folder_frustrum.open()
  var gui_folder_camera = gui.addFolder('Camera')
  settings.camera_x = 250
  settings.camera_y = 250
  settings.camera_z = 200
  gui_folder_camera.add(settings, 'camera_x').onChange(function (v) { draw() })
  gui_folder_camera.add(settings, 'camera_y').onChange(function (v) { draw() })
  gui_folder_camera.add(settings, 'camera_z').onChange(function (v) { draw() })
  settings.look_at_x = 0
  settings.look_at_y = 0
  settings.look_at_z = 50
  gui_folder_camera.add(settings, 'look_at_x').onChange(function (v) { draw() })
  gui_folder_camera.add(settings, 'look_at_y').onChange(function (v) { draw() })
  gui_folder_camera.add(settings, 'look_at_z').onChange(function (v) { draw() })
  // gui_folder_camera.open()
  var gui_folder_hatching = gui.addFolder('Hatching')
  settings.hatch_min = 0.0002
  settings.hatch_grad = 0.003
  gui_folder_hatching.add(settings, 'hatch_min').onChange(function (v) { draw() })
  gui_folder_hatching.add(settings, 'hatch_grad').onChange(function (v) { draw() })
  gui_folder_hatching.open()

  gui.add(settings, 'downloadSvg')
  settings.lines_drawn = 0
  gui.add(settings, 'lines_drawn').listen()

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

  var my_triangles = []
  var my_lines = []
  var view_projection_matrix

  var my_light = normalize3([-10, 0, -10])


  // TEST TRIANGLE
  c = [40, 0, 0]
  b = [0, 20, 0]
  a = [0, 0, 20]
  my_triangles.push(new MyTriangle(a, b, c))

  // let s = my_sphere([50, -100, 0], 50, 3)
  // my_triangles = my_triangles.concat(s)
  // s = my_sphere([0, 50, 0], 20, 1)
  // my_triangles = my_triangles.concat(s)
  // s = my_sphere([0, -50, 50], 20, 2)
  // my_triangles = my_triangles.concat(s)
  // s = my_sphere([0, -150, 100], 20, 2)
  // my_triangles = my_triangles.concat(s)

  // s = my_sphere([-220, -220, 0], 20, 2)
  // my_triangles = my_triangles.concat(s)

  // LIGHT DIRECTION
  my_lines.push(new MyLine([0, 0, 0], scale3(my_light, 150), [0, 0, 0]))

  // XYZ axis
  my_lines.push(new MyLine([0, 0, 0], [100, 0, 0], [255, 0, 0]))
  my_lines.push(new MyLine([0, 0, 0], [0, 100, 0], [0, 255, 0]))
  my_lines.push(new MyLine([0, 0, 0], [0, 0, 100], [0, 0, 255]))


  // setup camera
  let cam_pos = [settings.camera_x, settings.camera_y, settings.camera_z]
  let cam_look_at = [settings.look_at_x, settings.look_at_y, settings.look_at_z]

  let view_matrix = lookAt4m(cam_pos, cam_look_at, [0, 0, 1])
  let projection_matrix = createPerspectiveUsingFrustum(settings.fov, settings.aspect, settings.near, settings.far)
  // let projection_matrix = perspective4m(0.4, 1) //  fovy, aspect
  view_projection_matrix = multiply4m(projection_matrix, view_matrix)

  // lighten the diorama
  for (let my_triangle of my_triangles) {
    my_triangle.light(my_light)
  }


  // project the diorama
  for (let my_triangle of my_triangles) {
    my_triangle.project(view_projection_matrix)
  }

  for (my_line of my_lines) {
    my_line.project(view_projection_matrix)
  }

  my_light = transform4(my_light, view_projection_matrix)

  my_light = normalize3(my_light)

  // get all lines, and determine visibility
  let all_lines = []
  for (let my_triangle of my_triangles) {
    let lines = my_triangle.getLinesCopy(settings)
    all_lines = all_lines.concat(lines)
  }
  for (let my_line of my_lines) {
    all_lines = all_lines.concat(my_line.get_copy(settings))
  }

   
  // check all intersections of lines with triangles : split these lines.
  let all_lines2 = []
  for (let my_line of all_lines) {
    let my_cur_lines = []  // because we could split lines, we have a current lines array!
    my_cur_lines.push(my_line)
    for (let my_triangle of my_triangles) {
      let split_off_lines = [] // I dont' want to check the split lines again for the same triangle.
      for (const [i, my_cur_line] of my_cur_lines.entries()) {
        // check if the line intersects      
        p = my_triangle.linePlaneIntersect(my_cur_line)
//  TODO ROLAND : nu als line op rand ligt, wordt deze weer gesplits!!!
        if (!Object.is(p, NaN)) { 
          // it intersects : split it. obscuration will be handdles laterz
          my_cur_lines.splice(i,1)  // remove current line, and replace by parts.
          my_cur_lines.push(new MyLine(my_cur_line.p[0], p)) 
          my_cur_lines.push(new MyLine(p, my_cur_line.p[1])) 
        }
      }
    }
    all_lines2 = all_lines2.concat(my_cur_lines)
  }


  // draw scene
  background(255, 255, 255); // Set the background to white

  settings.lines_drawn = 0
  // for (let my_triangle of my_triangles) {
  //   settings.lines_drawn += my_triangle.draw2d(window.innerWidth, window.innerHeight, settings )
  // }
  for (my_line of all_lines2) {
    settings.lines_drawn += my_line.draw2d(window.innerWidth, window.innerHeight)
  }




  this.stats.end();

}


// =================
// ===MOUSE n KEYS=======
// =================
function mouseDragged(event) {
  RM = random(20, 100)
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
  settings.aspect = window.innerWidth / window.innerHeight
  draw()

}
