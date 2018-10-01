// VARIABLES --------------------------------------------------------------------------------------------------------------------------
var userAgent = getUserAgent();
var touch = false
var win = {
  size_setting: { L: 1026, M: 770, S: 416 }, // < SETTING based on common screensizes
  min_size: { XL:false, L:false, M:false, S:false },
  width: { XL:false, L:false, M:false, S:false },
  height: { XL:false, L:false, M:false, S:false },
  iW:0, iH:0, iMin:0, iMax: 0, dPR:0
}

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

// Determine touch --------------------------------------------------------------------------------------------------------------------
$(window).on('touchstart', function() {
  touch = true; Squares(); //reset square interaction method on touch
  $(this).off('touchstart mousemove'); //remove the eventlisteners
});

// Window data function ---------------------------------------------------------------------------------------------------------------
function getWindowData(){
  //set window size and device pixel ratio
  win.dPR = window.devicePixelRatio;
  win.iW = window.innerWidth; win.iH = window.innerHeight;

  //set minimum window size in portrait or landscape rotation
  this.MinMaxSize = function(){if (win.iW <= win.iH) {return [win.iW,win.iH];} else {return [win.iH,win.iW];};};
  win.iMin = this.MinMaxSize()[0]; win.iMax = this.MinMaxSize()[1];

  //set screen size booleans ---------------------------------------------------
  this.setScrSize = function(s, str){
    for (key in win[str]) { win[str][key] = false } //reset to false
    if (s < win.size_setting.S) { win[str].S = true }
    else if (s < win.size_setting.M) { win[str].M = true }
    else if (s < win.size_setting.L) { win[str].L = true }
    else { win[str].XL = true };
  };
  this.setScrSize(win.iMin, 'min_size'); //set minimum size booleans
  this.setScrSize(win.iW, 'width'); //set minimum width booleans
  this.setScrSize(win.iH, 'height'); //set minimum height booleans
  console.log(win)
  console.log(ref_box_size)
}
