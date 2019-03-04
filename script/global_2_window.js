// CONSTANTS -------------------------------------------------------------------
const userAgent = getUserAgent();

// VARIABLES -------------------------------------------------------------------
var touch = false
var win = {};
var mouse = {}
var mouse_update = false
var platform

// Determine user agent --------------------------------------------------------
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

// Determine touch -------------------------------------------------------------
$(window).on('touchstart', function() {
  touch = true; $(this).off('touchstart');
})

// Get window data -------------------------------------------------------------
function getWindowData(){

  //set window size and device pixel ratio
  win.iW = window.innerWidth; win.iH = window.innerHeight;
  win.dPR = window.devicePixelRatio;

  //set minimum window size in portrait or landscape rotation
  let minMaxSizeArray = (win.iW <= win.iH) ? [win.iW,win.iH]:[win.iH,win.iW];

  win.iMin = minMaxSizeArray[0];
  win.iMax = minMaxSizeArray[1];

  //set screen size booleans
  let scrSizeBool = function(s, str){
    win[str] = {S:false, M:false, L:false, XL:false};
    for (key in win[str]) { win[str][key] = false } //reset to false
    if (s < win_s.S) { win[str].S = true }
    else if (s < win_s.M) { win[str].M = true }
    else if (s < win_s.L) { win[str].L = true }
    else { win[str].XL = true };
  };

  scrSizeBool(win.iMin, 'min_b');
  scrSizeBool(win.iMax, 'max_b');
  scrSizeBool(win.iW, 'width_b');
  scrSizeBool(win.iH, 'height_b');

  platform = (win.min_b.S == true) ? 'mobile' : 'desktop';

}; getWindowData()

// Fade when ready--------------------------------------------------------------
$(document).ready(function() {
  $('.fade').css({'opacity': 1, 'transition': '500ms',})
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

// Deep link --------------------------------------------------------------------------------------------------------------------------
function DeepLink(web_link, ios_link, android_link) {
	var UA_local = getUserAgent();
	console.log(UA_local);

	this.AppSiteFallback = function(sitelink, applink){
		setTimeout(function() {
			window.location = sitelink;
		}, 10);
		//app?
		window.location = applink;
	}

	if (UA_local == 'iOS') {
		this.AppSiteFallback(web_link, ios_link);
	} else if (UA_local == 'Android'){
		this.AppSiteFallback(web_link, android_link);
	} else {
		window.location = web_link;
	};

};

// shift array left retain size -------------------------------------------------------------------------------------------------------
//(not used yet)
function shiftLeftRetain(array, times){
	for (var i = 0; i < times; i++) {
		var e = array.shift();
		array.push(e);
	}; return array;
}

// value between min max --------------------------------------------------------------------------------------------------------------
function valBetween(v, min, max) {
	return (Math.min(max, Math.max(min, v)));
}
