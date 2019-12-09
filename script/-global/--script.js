loadScripts(

  // Directory
  'script/-global/',

  // Scripts array - NOTE: order is important!!!
  ['functions', 'svg', 'objects', 'async', 'session', 'events/core'],

  // Function when ready (string)
  'globalReady' // index/live specific scripts are loaded after

)


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

// TOUCH -----------------------------------------------------------------------
window.ontouchstart = function(event){
  $('body').removeClass('no_touch') // remove notouch class 
}
