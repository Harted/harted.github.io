console.time('----Ready')
console.time('Document ready')
console.time('Less ready')

// USER AGENT ------------------------------------------------------------------
var userAgent = getUserAgent();

// Funtion
function getUserAgent() {

  var UA = navigator.userAgent || navigator.vendor || window.opera;



  if (/windows phone/i.test(UA)) {
    return 'WindowsPhone';
  } else if (/android/i.test(UA)) {
    return 'Android';
  } else if (/iPad|iPhone|iPod/.test(UA) && !window.MSStream) {
    return 'iOS';
  } else if (/Chrome/.test(UA)) {
    return 'Chrome';
  } else if (/Safari/.test(UA)) {
    return 'Safari';
  } else if (/Firefox/.test(UA)) {
    return 'Firefox';
  } else if (/Trident\/7/.test(UA)) {
    return 'IE11';
  } else {
    return 'unknown';
  };

};


// GET WINDOW DATA -------------------------------------------------------------

var win = getWindowData();                                      //on load

window.onresize = function(event){
  win = getWindowData();

  // user functions ---------------
  flex();
  headsize();
  // ------------------------------

};

function getWindowData() {                                      //Function

  var iW = window.innerWidth, iH = window.innerHeight;
  var dPR = window.devicePixelRatio;

  return {iW: iW, iH : iH, dPR : dPR};

};


// Reload page when pressing back in browser -----------------------------------
window.onpageshow = function(event) {
  if (event.persisted){
    location.reload()
  }
};



// REMOVE CONSOLE REGEX:      console\..{0,7}\(.{0,}\);?
