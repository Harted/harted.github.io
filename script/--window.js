// USER AGENT ------------------------------------------------------------------
var userAgent = getUserAgent();

if (userAgent != 'Chrome' && false) {

  var str = "This browser is not supported! \n\n"
  str += "Use Google Chrome for the best experience.\n"


  if (window.confirm(str)) {
    window.location.href = "https://www.google.com/chrome/"
  }

  // window.alert('This browser is not tested!: \n
  // Use Google Chrome for the best experience
  // \n\n https://www.google.com/chrome/')
}

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

var win = getWindowData();  //on load

window.onresize = function(event){
  win = getWindowData();

  if(tableready){responsive()};
};

function getWindowData() {                                      //Function

  var iW = window.innerWidth, iH = window.innerHeight;
  var dPR = window.devicePixelRatio;

  return {iW: iW, iH : iH, dPR : dPR};

};


// Responsive on resize --------------------------------------------------------
function responsive(){
  flex();
  table.headsize()
};



// REMOVE CONSOLE REGEX:      console\..{0,7}\(.{0,}\);?
