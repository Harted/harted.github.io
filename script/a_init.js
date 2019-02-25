// CONSTANTS --------------------------------------------------------------------------------------------------------------------------
const userAgent = getUserAgent();
const win_p  = {
  L: 1026, M: 770, S: 416, // < SETTING based on common screensizes
};
// VARIABLES --------------------------------------------------------------------------------------------------------------------------
var touch = false
var win = {};
var mouse = {}
// Get user agent function ------------------------------------------------------------------------------------------------------------
function getUserAgent(){
  var UA = navigator.userAgent || navigator.vendor || window.opera;
  if (/windows phone/i.test(UA)) {return 'WindowsPhone';}
  else if (/android/i.test(UA)) {return 'Android';}
  else if (/iPad|iPhone|iPod/.test(UA) && !window.MSStream) {return 'iOS';}
  else if (/Chrome/.test(UA)) {return 'Chrome';}
  else if (/Safari/.test(UA)) {return 'Safari';}
  else if (/Firefox/.test(UA)) {return 'Firefox';}
  else {console.log('unknown userAgent: '+ UA); return 'unknown';};
};
// Window data function ---------------------------------------------------------------------------------------------------------------
function getWindowData(){
  //set window size and device pixel ratio
  win.iW = window.innerWidth; win.iH = window.innerHeight;
  win.dPR = window.devicePixelRatio;
  //set minimum window size in portrait or landscape rotation
  this.MinMaxSize = function(){if (win.iW <= win.iH) {return [win.iW,win.iH];} else {return [win.iH,win.iW];};};
  win.iMin = this.MinMaxSize()[0]; win.iMax = this.MinMaxSize()[1];
  //set screen size booleans ---------------------------------------------------
  this.setScrSize = function(s, str){
    win[str] = {S:false, M:false, L:false, XL:false};
    for (key in win[str]) { win[str][key] = false } //reset to false
    if (s < win_p.S) { win[str].S = true }
    else if (s < win_p.M) { win[str].M = true }
    else if (s < win_p.L) { win[str].L = true }
    else { win[str].XL = true };
  };
  this.setScrSize(win.iMin, 'min_size'); //set minimum size booleans
  this.setScrSize(win.iMin, 'max_size'); //set minimum size booleans
  this.setScrSize(win.iW, 'width'); //set minimum width booleans
  this.setScrSize(win.iH, 'height'); //set minimum height booleans
}; getWindowData()

// eventlisteners ---------------------------------------------------------------------------------------------------------------------
$(window).on('touchstart', function() {
  touch = true; Squares(); //reset square interaction method on touch
  $(this).off('touchstart'); //remove the eventlistener
}).on('mousemove', function(event) {
  mouse.x = event.pageX; mouse.y = event.pageY;
  if (mouse.x != mouse.x_old || mouse.y != mouse.y_old) {
    mouse.x_old = mouse.x;	mouse.y_old = mouse.y;
    var obj = $('#reference_box')[0]
    mouse.ref_box = {
      x: mouse.x - obj.offsetLeft,
      y: mouse.y - obj.offsetTop,
    }
    // FUNCTIONS
    //Proximities(); //------------------------------------------------------- [F] main_child.js
    //AffectSquares(); //----------------------------------------------------- [F] main_child.js
    overCanvas('cl', {'pointer-events': 'none',}, {'pointer-events': 'auto',})
    // for (var i = 0; i < squares.length; i++) {squares[i].mousemove()}
  };
});


// UTILITIES --------------------------------------------------------------------------------------------------------------------------
// Debounce by David Walsh (https://davidwalsh.name/javascript-debounce-function)
function debounce(func, wait, immediate) {
  var timeout;
  return function executedFunction() {
    var context = this;
    var args = arguments;
    var later = function() {
      timeout = null;
      if (!immediate) func.apply(context, args);
    };
    var callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) func.apply(context, args);
  };
};
