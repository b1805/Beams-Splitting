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

const CANVAS = document.getElementById('canvas'); // The main canvas
const CTX = CANVAS.getContext('2d', { willReadFrequently: true }); // Canvas contexts are used to draw on and read from

// Style values
let BACKGROUND_COLOR = '#FFFFFF';
let WALL_COLOR = '#0000FF';
let PHOTON_TAIL_COLOR = '#FFFF0013';
let PHOTON_HEAD_COLOR = '#FF0000';
let LIGHT_SOURCE_COLOR = '#FF0000';
let TRIANGLE_COLOR = "#C9F29B80";
let DRAG_LINE_COLOR = "#FF0000";

let PHOTON_RADIUS = 0; // Distance away from source
let NUMBER_LIGHT_RAYS = 2000;
let EPSILION = 0.1;
let END_ANGLE = 120;
const RENDER_INTERVAL_TIME = 33;
let SPEED_TIMES_TEN = 10;
let HEAD_SIZE = 1.00;
let TAIL_SIZE = 1.00;
let TRIANGLE_SIDE = 100;

//For magnification and dragging
var ZOOM_INPUT = document.getElementById('zoomInput');
var SELECT_BUTTON = document.getElementById('selectButton');
var MAGNIFY_BUTTON = document.getElementById('magnifyButton');
var DEMAGNIFY_BUTTON = document.getElementById('demagnifyButton');
var CENTER_BUTTON = document.getElementById('centerButton');
let TOTAL_ZOOM = 1;
let X_TRANS = 0;
let Y_TRANS = 0;
let X_START = 0;
let Y_START = 0;
let X_END = 0;
let Y_END = 0;
let DRAGGING = false;
let MOUSE_DOWN = false;

let TRIANGLES = [];
let SELECTED_TRIANGLES = [];
let BOUNDARIES = [];
let COORDS = [];
let X_COORDS = [];
let Y_COORDS = [];
SPECIAL_POINTS = [];
var PHOTONS = [];
var RENDER_INTERVAL;

let VIDEO = new Whammy.Video(33);
var CURRENTLY_RECORDING = false;
var RECORDING = document.getElementById('recording');
var DOWNLOAD_BUTTON = document.getElementById('downloadButton');
var STATUS_ELEMENT = document.getElementById('status');
var NUM_CAPTURED_FRAMES = 0;

let SCREEN_ZOOM = 0.97 * (window.innerWidth / 1850);

let lightSource = { x: 440, y: 370 };