/* MIT License

Copyright (c) 2024 Bhavya Jain, Austin Lu

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE. */

//Screen Zoom
function setZoom() {
  SCREEN_ZOOM = 0.97 * (window.innerWidth / 1850);
  document.body.style.transform = `scale(${SCREEN_ZOOM})`;
  document.body.style.transformOrigin = "0 0"; // Set the origin to top-left
}
setZoom();

//Dark Mode toggle
function toggleDarkMode() {
  document.body.classList.toggle('dark-mode');
}

// Version toggle
function toggleVersion() {
  if (triangle.checked) {
    SELECTED_TRIANGLES = [];
    TRIANGLES = [];
    drawTriangles();
    createTriangleGrid();
  } else {
    SELECTED_TRIANGLES = [];
    TRIANGLES = [];
    drawTriangles();
    createSquareGrid();
  }
}

// Displays the grid when you first open the program
function initialize() {
  if (triangle.checked) {
    createTriangleGrid();
  } else {
    createSquareGrid();
  }
  for (i=0; i<X_COORDS.length; i++) {
    SPECIAL_POINTS[i] = {x: X_COORDS[i], y: Y_COORDS[i]}
  };
  //console.log(SPECIAL_POINTS);
  CANVAS.addEventListener('click', clickHandler); // Left click for handling based on selected option
  drawNew();
  drawLightSource();
}

// Handles clicks
function clickHandler(event) {
  //console.log("mouse click");
  if(DRAGGING) {
    updateScreen();
    return;
  } 
  if (SELECT_BUTTON.checked) {
    setLightSource(event);
  } else if (MAGNIFY_BUTTON.checked) {
    magnify(event);
    //var x = event.offsetX * parseFloat(zoomInput.value);
    //var y = event.offsetY * parseFloat(zoomInput.value);
    centerView(event, parseFloat(zoomInput.value));
  } else if (DEMAGNIFY_BUTTON.checked) {
    demagnify(event);
   // var x = event.offsetX / parseFloat(zoomInput.value);
    //var y = event.offsetY / parseFloat(zoomInput.value);
    //var x = event.offsetX;
    //var y = event.offsetY;
    centerView(event, 1 / parseFloat(zoomInput.value));
  } else if (CENTER_BUTTON.checked) {
    centerView(event);
  }
}

// Function to magnify
function magnify(event) {
  let inputValue = parseFloat(zoomInput.value);
  TOTAL_ZOOM *= inputValue;
  updateScreen();
}

// Function to demagnify
function demagnify(event) {
  let inputValue = parseFloat(zoomInput.value);
  TOTAL_ZOOM /= inputValue;
  updateScreen();
}

// Function to center the view
function centerView(event, scale = 1) {
  var x = event.offsetX * scale;
  var y = event.offsetY * scale;
  X_TRANS *= scale;
  Y_TRANS *= scale;
  X_TRANS += (500-x);
  Y_TRANS += (400-y);
  updateScreen();
}

function resetZoomDrag() {
  X_TRANS = 0;
  Y_TRANS = 0;
  X_START = 0;
  Y_START = 0;
  X_END = 0;
  Y_END = 0;
  TOTAL_ZOOM = 1;
  updateScreen();
}

//map function, pos is a position vector maps from the unmagnified values to a scale factor
function map(pos) {
  return pos.mult(TOTAL_ZOOM).add(new Vector(X_TRANS, Y_TRANS)); // Re-add this when we want to drag
}

//map function, maps from the magnified canvas to locations in our internal unmagnified
function unmap(pos) {
  return pos.add(new Vector(X_TRANS, Y_TRANS).mult(-1)).mult(1/TOTAL_ZOOM); 
}

// Convert hex color to RGBA
function hexToRgba(hex, alpha) {
  let r = parseInt(hex.slice(1, 3), 16);
  let g = parseInt(hex.slice(3, 5), 16);
  let b = parseInt(hex.slice(5, 7), 16);

  return `rgba(${r},${g},${b},${alpha})`;
}

// Changes colors
function applyColors() {
  WALL_COLOR = document.getElementById("wallColorInput").value;
  PHOTON_HEAD_COLOR = document.getElementById("photonHeadColorInput").value;
  let tailColor = document.getElementById("photonTailColorInput").value;
  PHOTON_TAIL_COLOR = hexToRgba(tailColor, ((0.075*2000)/NUMBER_LIGHT_RAYS));
  LIGHT_SOURCE_COLOR = document.getElementById("lightSourceColorInput").value;
  let triangleColor = document.getElementById("triangleColorInput").value;
  TRIANGLE_COLOR = hexToRgba(triangleColor, 0.5);
  DRAG_LINE_COLOR = document.getElementById("dragLineColorInput").value;
  updateScreen(); // Update canvas with new colors
}

// Changes the number of Triangles in the grid (essentially the size of the grid)
function changeNumberTriangles(){
  TRIANGLE_SIDE = parseInt(document.getElementById("triangleSideInput").value);
  TRIANGLES = [];
  SELECTED_TRIANGLES = [];
  initialize();
}

function changeNumLightRays(){
  NUMBER_LIGHT_RAYS = parseInt(document.getElementById("numLightRaysInput").value);
  let tailColor = document.getElementById("photonTailColorInput").value;
  PHOTON_TAIL_COLOR = hexToRgba(tailColor, ((0.075*2000)/NUMBER_LIGHT_RAYS));
}

function changeEps(){
  EPSILION = parseInt(document.getElementById("epsInput").value);
}

// Turns the mouse coordinates on and off
function changeMouseCoordsVisibility() {
  const mouseVisibilityCheckBox = document.getElementById("mouseVisibilityCheckBox");
  const mouse_coords = document.getElementById("mouse_coords");
  if(mouseVisibilityCheckBox.checked) {
    mouse_coords.style.display = "inline";
  } else {
    mouse_coords.style.display = "none";
  }
}

function changeEndAngle() {
  END_ANGLE = parseFloat(document.getElementById("endAngleInput").value);
}

// Changes the coordinates of the light source
function changeLightSourceCoordinates() {
  lightSource["x"] = parseInt(document.getElementById("lightSourceXInput").value);
  lightSource["y"] = parseInt(document.getElementById("lightSourceYInput").value);
  const setCOORDS = new Set(COORDS.map(JSON.stringify));
  COORDS = Array.from(setCOORDS).map(JSON.parse);
  PHOTONS = [];
  updateScreen(); // Update canvas with new coordinates
  resetZoomDrag();
  //console.log(lightSource["x"]);
  //console.log(lightSource["y"]);
}

// Function to change rendering speed
function changeSpeed() {
  SPEED_TIMES_TEN = parseInt(document.getElementById("speedInput").value);
  //console.log(SPEED_TIMES_TEN)
}

// Add an event listener to the slider
document.getElementById("speedInput").addEventListener('input', function() {
  document.getElementById("speedValue").textContent = this.value; // Update the displayed value
});

// Function to let photons select triangles when entering them
function photonSelectTriangles() {
  PHOTONS.forEach(photon => {
    if(photon.real) {
      TRIANGLES.forEach(triangle => {
        if (isPointInTriangle(photon.x, photon.y, triangle.point1, triangle.point2, triangle.point3)) {
          if (!triangle.selected) {
            triangle.selected = true;
            SELECTED_TRIANGLES.push(triangle);
          }
        }
      });
    }
    
  });
}

// Helper function to check if a point is inside a triangle
function isPointInTriangle(px, py, p1, p2, p3) {
  const areaOrig = Math.abs((p2.x - p1.x) * (p3.y - p1.y) - (p3.x - p1.x) * (p2.y - p1.y));
  const area1 = Math.abs((p1.x - px) * (p2.y - py) - (p2.x - px) * (p1.y - py));
  const area2 = Math.abs((p2.x - px) * (p3.y - py) - (p3.x - px) * (p2.y - py));
  const area3 = Math.abs((p3.x - px) * (p1.y - py) - (p1.x - px) * (p3.y - py));
  return (area1 + area2 + area3) === areaOrig;
}

// Helper function to check if a point is inside a square
function isPointInSquare(px, py, p1, p2, p3, p4) {
  // Check if the point is in either of the two triangles formed by the square
  const inTriangle1 = isPointInTriangle(px, py, p1, p2, p3);
  const inTriangle2 = isPointInTriangle(px, py, p1, p3, p4);

  return inTriangle1 || inTriangle2;
}

// Function to make the grid of triangles
function createTriangleGrid() {
  const triangleSize = TRIANGLE_SIDE;
  // Split canvas into square cells
  for (let y = 0; y < CANVAS.height; y += triangleSize) {
    for (let x = 0; x < CANVAS.width; x += triangleSize) {
      let isEvenRow = (y / triangleSize) % 2 === 0;
      let isEvenCol = (x / triangleSize) % 2 === 0;

      // We split the cell into two (45,45) triangles, which are oriented differently depending on the parity of the row and column
      if ((isEvenRow && isEvenCol) || (!isEvenRow && !isEvenCol)) {
        let triangle1 = new Path2D();
        triangle1.moveTo(x, y);
        triangle1.lineTo(x + triangleSize, y);
        triangle1.lineTo(x, y + triangleSize);
        triangle1.closePath();
        let triangleObj1 = { path: triangle1, selected: false, point1: { x: x, y: y }, point2: { x: x + triangleSize, y: y }, point3: { x: x, y: y + triangleSize } };
        TRIANGLES.push(triangleObj1);

        let triangle2 = new Path2D();
        triangle2.moveTo(x + triangleSize, y);
        triangle2.lineTo(x + triangleSize, y + triangleSize);
        triangle2.lineTo(x, y + triangleSize);
        triangle2.closePath();
        let triangleObj2 = { path: triangle2, selected: false, point1: { x: x + triangleSize, y: y }, point2: { x: x + triangleSize, y: y + triangleSize }, point3: { x: x, y: y + triangleSize } };
        TRIANGLES.push(triangleObj2);
      } else {
        let triangle1 = new Path2D();
        triangle1.moveTo(x, y);
        triangle1.lineTo(x + triangleSize, y);
        triangle1.lineTo(x + triangleSize, y + triangleSize);
        triangle1.closePath();
        let triangleObj1 = { path: triangle1, selected: false, point1: { x: x, y: y }, point2: { x: x + triangleSize, y: y }, point3: { x: x + triangleSize, y: y + triangleSize } };
        TRIANGLES.push(triangleObj1);

        let triangle2 = new Path2D();
        triangle2.moveTo(x, y);
        triangle2.lineTo(x, y + triangleSize);
        triangle2.lineTo(x + triangleSize, y + triangleSize);
        triangle2.closePath();
        let triangleObj2 = { path: triangle2, selected: false, point1: { x: x, y: y }, point2: { x: x, y: y + triangleSize }, point3: { x: x + triangleSize, y: y + triangleSize } };
        TRIANGLES.push(triangleObj2);
      }
    }
  }
  
  //for (i=0; i<(1600000/(TRIANGLE_SIDE*TRIANGLE_SIDE)); i++) {
  for (i=0; i< TRIANGLES.length; i++) {
    X_COORDS.push(TRIANGLES[i].point1.x);
    X_COORDS.push(TRIANGLES[i].point2.x);
    X_COORDS.push(TRIANGLES[i].point3.x);
    Y_COORDS.push(TRIANGLES[i].point1.y);
    Y_COORDS.push(TRIANGLES[i].point2.y);
    Y_COORDS.push(TRIANGLES[i].point3.y);
  }
  
  drawTriangles();
}

function getRandomColor() {
  var letters = '0123456789ABCDEF';
  var color = '#';
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

// Function to draw the triangles and also several other fixed canvas elements
function drawTriangles() {
  CTX.lineWidth = 1.0;
  // Clear the canvas
  CTX.clearRect(0, 0, canvas.width, canvas.height);
  CTX.fillStyle = BACKGROUND_COLOR;
  CTX.fillRect(0, 0, canvas.width, canvas.height);
  CTX.strokeStyle = 'white';

  TRIANGLES.forEach(triangle => {
    // Mat the coordinates of the vertices in the original grid to the magnifier
    const p1 = map(new Vector(triangle.point1.x, triangle.point1.y));
    const p2 = map(new Vector(triangle.point2.x, triangle.point2.y));
    const p3 = map(new Vector(triangle.point3.x, triangle.point3.y));
    let path = new Path2D();
    path.moveTo(p1.x, p1.y);
    path.lineTo(p2.x, p2.y);
    path.lineTo(p3.x, p3.y);
    if(square.checked) {
      const p4 = map(new Vector(triangle.point4.x, triangle.point4.y));
      path.lineTo(p4.x, p4.y);
    }
    path.closePath();
    if (triangle.selected) {
      CTX.fillStyle = 'white';
      CTX.strokeStyle = WALL_COLOR;
      CTX.fill(path);
    }
    if(BACKGROUND_COLOR == "#000000") CTX.globalAlpha = 0.0; // To remove the grid lines while recording
    CTX.stroke(path);
    CTX.strokeStyle = 'white';
    CTX.globalAlpha = 1; // Change it to default after done
  });
  drawNew();
  drawLightSource();
}

// Function to make the grid of squares
function createSquareGrid() {
  const squareSize = TRIANGLE_SIDE;
  // Split canvas into square cells
  for (let y = 0; y < CANVAS.height; y += squareSize) {
    for (let x = 0; x < CANVAS.width; x += squareSize) {
      let square = new Path2D();
      square.moveTo(x, y);
      square.lineTo(x + squareSize, y);
      square.lineTo(x + squareSize, y + squareSize);
      square.lineTo(x, y + squareSize);
      square.closePath();
      let squareObj = {
        path: square,
        selected: false,
        point1: { x: x, y: y },
        point2: { x: x + squareSize, y: y },
        point3: { x: x + squareSize, y: y + squareSize },
        point4: { x: x, y: y + squareSize }
      };
      TRIANGLES.push(squareObj);
    }
  }
  for (i=0; i< TRIANGLES.length; i++) {
    X_COORDS.push(TRIANGLES[i].point1.x);
    X_COORDS.push(TRIANGLES[i].point2.x);
    X_COORDS.push(TRIANGLES[i].point3.x);
    X_COORDS.push(TRIANGLES[i].point4.x);
    Y_COORDS.push(TRIANGLES[i].point1.y);
    Y_COORDS.push(TRIANGLES[i].point2.y);
    Y_COORDS.push(TRIANGLES[i].point3.y);
    Y_COORDS.push(TRIANGLES[i].point4.y);
  }
  drawTriangles();
}

function drawNew() {
  if (triangle.checked) {
    let topRightTriangle = null;

    TRIANGLES.forEach(triangle => {
      const mappedLightSource = new Vector(lightSource.x, lightSource.y);
      if (isPointInTriangle(mappedLightSource.x, mappedLightSource.y, triangle.point1, triangle.point2, triangle.point3)) {
        if (!topRightTriangle || 
            (getMaxX(triangle) > getMaxX(topRightTriangle)) || 
            (getMaxX(triangle) === getMaxX(topRightTriangle) && getMinY(triangle) < getMinY(topRightTriangle))) {
          topRightTriangle = triangle;
        }
      }
    });

    if (topRightTriangle) {
      const p1 = map(new Vector(topRightTriangle.point1.x, topRightTriangle.point1.y));
      const p2 = map(new Vector(topRightTriangle.point2.x, topRightTriangle.point2.y));
      const p3 = map(new Vector(topRightTriangle.point3.x, topRightTriangle.point3.y));
      
      let path = new Path2D();
      path.moveTo(p1.x, p1.y);
      path.lineTo(p2.x, p2.y);
      path.lineTo(p3.x, p3.y);
      path.closePath();

      CTX.lineWidth = 0.5;
      CTX.fillStyle = TRIANGLE_COLOR;
      CTX.strokeStyle = WALL_COLOR;
      CTX.fill(path);
      CTX.stroke(path);
    }

  } else {
    let topRightSquare = null;

    TRIANGLES.forEach(square => {
      if (isPointInSquare(lightSource.x, lightSource.y, square.point1, square.point2, square.point3, square.point4)) {
        // Determine if this square is the top-right one
        if (!topRightSquare || 
            (getMaxX(square) > getMaxX(topRightSquare)) || 
            (getMaxX(square) === getMaxX(topRightSquare) && getMinY(square) < getMinY(topRightSquare))) {
          topRightSquare = square;
        }
      }
    });

    if (topRightSquare) {
      const p1 = map(new Vector(topRightSquare.point1.x, topRightSquare.point1.y));
      const p2 = map(new Vector(topRightSquare.point2.x, topRightSquare.point2.y));
      const p3 = map(new Vector(topRightSquare.point3.x, topRightSquare.point3.y));
      const p4 = map(new Vector(topRightSquare.point4.x, topRightSquare.point4.y));
      
      let path = new Path2D();
      path.moveTo(p1.x, p1.y);
      path.lineTo(p2.x, p2.y);
      path.lineTo(p3.x, p3.y);
      path.lineTo(p4.x, p4.y);
      path.closePath();

      CTX.lineWidth = 0.5;
      CTX.fillStyle = TRIANGLE_COLOR;
      CTX.strokeStyle = WALL_COLOR;
      CTX.fill(path);
      CTX.stroke(path);
    }
  }
}

// Helper functions to get the max X and min Y coordinates of a shape
function getMaxX(shape) {
  return Math.max(shape.point1.x, shape.point2.x, shape.point3.x, shape.point4?.x || -Infinity);
}

function getMinY(shape) {
  return Math.min(shape.point1.y, shape.point2.y, shape.point3.y, shape.point4?.y || Infinity);
}

// Draws the light source point
function drawLightSource() {
  drawCircle(lightSource.x, lightSource.y, 2, LIGHT_SOURCE_COLOR);
}

// Sets the light source *needs more comments
function setLightSource(event) {
  event.preventDefault();
  const x = event.offsetX;
  const y = event.offsetY;
  const magXY = unmap(new Vector(x, y));
  lightSource = { x: magXY.x, y: magXY.y };
  createPhotons();
  drawTriangles();
}

function startAnimation() {
  clearInterval(RENDER_INTERVAL);
  createPhotons();
  RENDER_INTERVAL = setInterval(updateScreen, RENDER_INTERVAL_TIME);
  SELECTED_TRIANGLES.forEach(triangle => (triangle.selected = false));
  SELECTED_TRIANGLES = [];
}

function stopAnimation() {
  clearInterval(RENDER_INTERVAL);
}

// Creates phtons according to the number of light rays and the position of the light source
function createPhotons() {
  PHOTONS = [];
  for (let i = 0; i < ((END_ANGLE/360)*NUMBER_LIGHT_RAYS); i++) {
    const angle = (i / ((END_ANGLE/360)*NUMBER_LIGHT_RAYS)) * -(END_ANGLE/360) * 2 * Math.PI;
    PHOTONS.push(new Photon(
      lightSource.x + PHOTON_RADIUS * Math.cos(angle),
      lightSource.y + PHOTON_RADIUS * Math.sin(angle),
      angle,
      (SPEED_TIMES_TEN/10),
      PHOTON_HEAD_COLOR,
      PHOTON_TAIL_COLOR,
      true
    ));
  }
    for (let i = 0; i < ((360-END_ANGLE)*10); i++) {
      const angle = (i / ((360-END_ANGLE)*10)) * ((360-END_ANGLE)/360) * 2 * Math.PI;
      PHOTONS.push(new Photon(
        lightSource.x + PHOTON_RADIUS * Math.cos(angle),
        lightSource.y + PHOTON_RADIUS * Math.sin(angle),
        angle,
        (SPEED_TIMES_TEN),
        "white",
        "white",
        false
      ));
  }
}

// Updates the screen
function updateScreen() {
  rayTracedUpdatePositions();
  photonSelectTriangles();
  drawTriangles();
  drawPhotons();
  drawNew();
  drawLightSource();
  if (CURRENTLY_RECORDING) {
    VIDEO.add(CTX);
  }
  NUM_CAPTURED_FRAMES++;
  if (NUM_CAPTURED_FRAMES % 33 === 0) {
    const secs = NUM_CAPTURED_FRAMES / 33;
    displayStatus(`Recording: captured ${secs} second(s) of film so far...`);
  }
}

function reDraw() {
  drawTriangles();
  drawPhotons();
  drawNew();
  drawLightSource();
}

// For a given photon, we want the first boundary it collides with this frame
function getClosestCollision(photon) {
    let closestCollision = null;
    for(let edge = 0; edge < BOUNDARIES.length; ++edge) { // Go through all boundaries
      const result = photon.checkCollision(BOUNDARIES[edge]);
      if(result == null) {
        continue;
      }
      // photonScalar tells us how "far" a collision is
      if(closestCollision == null || result.photonScalar < closestCollision.photonScalar) {
        closestCollision = result;
      }
    }
    return closestCollision;
}

// We calculate the path of each photon for this frame
function rayTracedUpdatePositions() {
  for (const point of SPECIAL_POINTS) {
    let closestPhoton = null;
    let minDistance = Infinity;
    
    // Find the closest photon to the current point
    for (let i = 0; i < PHOTONS.length; ++i) {
      if (PHOTONS[i].real) {
        let distance = Math.hypot(PHOTONS[i].x - point.x, PHOTONS[i].y - point.y);
        if (distance < (TAIL_SIZE + EPSILION) && distance < minDistance) {
          closestPhoton = PHOTONS[i];
          minDistance = distance;
        }
      }
    }
    
    // If a closest photon is found, apply the changes
    if (closestPhoton) {
      if (closestPhoton.tailColor != "red") {
        closestPhoton.contactPoints[0] = [point.x, point.y];
        // closestPhoton.vecDir = closestPhoton.vecDir.mult(10);
      }
      closestPhoton.tailColor = "red";
    }
  }

  // Update positions of all photons
  for (let i = 0; i < PHOTONS.length; ++i) {
    PHOTONS[i].updatePosition();
  }
}

// Draws the Photons
function drawPhotons() {
  PHOTONS.forEach(photon => {
    const len = photon.contactPoints.length;
    for (let i = 0; i < len - 1; i++) {
      drawLine(
        photon.contactPoints[i][0],
        photon.contactPoints[i][1],
        photon.contactPoints[i + 1][0],
        photon.contactPoints[i + 1][1],
        photon.tailColor
      );
    }
    drawLine(
      photon.contactPoints[len - 1][0],
      photon.contactPoints[len - 1][1],
      photon.x,
      photon.y,
      photon.tailColor
    );
  });
  PHOTONS.forEach(photon => {
    drawCircle(photon.x, photon.y, HEAD_SIZE, photon.headColor);
  });
}

function drawCircle(x, y, radius, color) {
  const pos = map(new Vector(x, y));
  CTX.beginPath();
  CTX.fillStyle = color; 
  CTX.arc(pos.x, pos.y, radius, 0, 2 * Math.PI);
  CTX.fill();
}

function drawLine(x1, y1, x2, y2, color, width = TAIL_SIZE) {
  const pos1 = map(new Vector(x1, y1));
  const pos2 = map(new Vector(x2, y2));
  CTX.beginPath();
  CTX.strokeStyle = color;
  CTX.lineWidth = width;
  CTX.moveTo(pos1.x, pos1.y);
  CTX.lineTo(pos2.x, pos2.y);
  CTX.stroke();
  CTX.lineWidth = 0.5;
}

// Recording:
function startRecording() {
  VIDEO = new Whammy.Video(33);
  NUM_CAPTURED_FRAMES = 0;
  if (CURRENTLY_RECORDING) {
    return;
  }
  if (!confirm('This feature only works on Firefox right now. Proceed?')) {
    return;
  }
  CURRENTLY_RECORDING = true;
}

function stopRecording() {
  if (!CURRENTLY_RECORDING) {
    return;
  }
  CURRENTLY_RECORDING = false;
  VIDEO.compile(false, function (output) {
    RECORDING.src = URL.createObjectURL(output);
    DOWNLOAD_BUTTON.href = RECORDING.src;
    displayStatus('Recording complete.');
  });
}

// Recording Status
function displayStatus(text) {
  STATUS_ELEMENT.innerText = `Status: ${text}`;
}

function startAnimationAndRecording() {
  startAnimation();
  startRecording();
}