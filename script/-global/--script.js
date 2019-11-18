loadScripts(
  // Directory
  'script/-global/',

  // Scripts array
  ['svg', 'objects', 'async', 'session', 'alarm/core'],

  // Function when ready (string)
  'globalReady'
)

function globalReady(){
  console.log('global functions loaded');
}


// loadScripts function --------------------------------------------------------// loadScripts
function loadScripts(dir, scrArr, fnStr) {
  for (var i = 0; i < scrArr.length; i++) {
    $.getScript( dir + scrArr[i] + '.js', scriptsReady.bind(null,i,scrArr))
  }
  function scriptsReady(){
    scrArr.splice(scrArr.indexOf(scrArr[i]),1)
    if(scrArr.length == 0 && fnStr != undefined){
      window[fnStr].call()
    }
  }
}


// Function: Convert ms to dhms string format ----------------------------------// dhms
function dhms(ms) {

  var day_c = (1000 * 60 * 60 * 24)
  var hrs_c = (1000 * 60 * 60)
  var min_c = (1000 * 60)
  var sec_c = 1000

  if (ms < 10000) {var fx = 1} else {var fx = 0}

  var days = Math.floor(ms / day_c);
  ms -= days * day_c
  var hrs = Math.floor(ms / hrs_c);
  ms -= hrs * hrs_c
  var min = Math.floor(ms / min_c);
  ms -= min * min_c
  var sec = (ms / sec_c).toFixed(fx);

  if (days > 0) {
    return days + 'd' + hrs + 'h' +  (min + Math.round(sec/60)) + 'm'
  } else if (hrs > 0) {
    return hrs + 'h' +  min + 'm' + sec + 's'
  } else if (min > 0) {
    return min + 'm' + sec + 's'
  } else {
    return sec + 's'
  };

};


// Function: round number with digits after period option ----------------------// roundP
function roundP(num, digits){
  digits = digits || 0
  var mul = Math.pow(10,digits)
  return Math.round(num * mul) / mul
}


// Local yyyy-mm-ddThh:mm:ss sring from date -----------------------------------// dateT
function dateT(d, sub){

  // now or defined by string
  if (d == undefined){

    d = new Date(Date.now()) // if ndefined set to now

  } else if (/[\d]{4}-[\d]{1,}-[\d]{1,}T[\d]{2}:[\d]{2}:[\d]{2}/.test(d)) {

      var p = d.match(/[\d]{1,}/g) // split by didget group

      // Create new date with parts (because GMT is not in T string)
      var d = new Date(p[0],p[1]-1,p[2],p[3],p[4],p[5])

  }

  var n = Date.parse(d) // parse date to enable calculations

  if (sub != undefined) { n = n - sub } // subtract if defined

  var o = new Date(n) // convert back to date string

  // Make T string
  var str = new Date(
    new Date(n).toString().split('GMT')[0]+' UTC'
  ).toISOString().split('.')[0];

  return str // return T string

}


// For safari ------------------------------------------------------------------// sDateParse
// Replace '-' by '/' & Remove 'ms' before new Date.. add 'ms' after again
function sDateParse(date){
  date = date.replace(/-/g,'/')
  date = date.split('.')

  var d = new Date(date[0]);
  return Date.parse(d)+parseInt(date[1]);
}


// Copy object function --------------------------------------------------------// copyObj
function copyObj(obj){
  return JSON.parse(JSON.stringify(obj))
}


// FADE in / FADE out on load --------------------------------------------------// loadFade
function loadFade(){ //fade interface on load
  $('.fade').css({'opacity': 1});
  $('.fade_reverse').css({'opacity': 0});
}


// Status fields ---------------------------------------------------------------// statusFields
function statusFields(str, cls, arr, i){

  // arr & i: only when cls (class) = progress

  if (TIME.rt){return} //Don't show status when realtime is active

  if (cls === "progress") {
    var progress =  Math.round( i / arr.length * 100 )
    str += ': ' + progress + '%'
  }

  var ids = ['#load_status','#ul_status']
  var cl = 'loadstatus ' + cls

  for (var i = 0; i < ids.length; i++) {
    $(ids[i] + ' span').attr('class', cl).text(str)
  }

}
