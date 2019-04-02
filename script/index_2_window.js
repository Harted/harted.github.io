// MOUSE -----------------------------------------------------------------------
$(window).on('mousemove', function(event) {

  mouse.x = event.pageX;
  mouse.y = event.pageY;

  if (mouse.x != mouse.x_old || mouse.y != mouse.y_old) {
    mouse.x_old = mouse.x;	mouse.y_old = mouse.y;

    $('#XY').html('X: ' + mouse.x + ' - Y: ' + mouse.y)


    //// NOTE: CENTER logo terug naar SVG!!

    // not clickable when over logo
    // if (ready) {
    //   overCanvas('cl', {'pointer-events': 'none',}, {'pointer-events': 'auto',})
    // }
  }
}).on('resize', function(){ onResize(); });

$(window).on('touchstart', function(){

  $(this).off('click');

  touchXY(event);

}).on('touchend', function(){


  if (event.touches.length == 0){
    mouse.x = mouse.y = undefined;
  };

}).on('touchmove', function(){

  touchXY(event)

})

function touchXY(event){
  mouse.x = event.touches[0].pageX
  mouse.y = event.touches[0].pageY - $(window).scrollTop()
}

function touchendOver(id){
  let o = $(id).offset()
  o.w = $(id).width()
  o.x = mouse.x - o.left
  o.y = mouse.y - o.top
  return (0 < o.x && o.x < o.w && 0 < o.y && o.y < o.w)
}

// everything to do on a resize ------------------------------------------------
var onResize = debounce(function(){

  getWindowData();
  globalSet();
  indexSet();


  // NOTE: temporary canvas resize stuff

  cl.clearRect(0,0,win.iW,win.iH);
  CL_fill.draw();
  CL_border.draw();


  art.canvas.width = refbox
  art.canvas.height = refbox

  $('#art').css({'width' : refbox, 'height': refbox })

  art.clearRect(0,0,win.iW,win.iH);
  art.drawImage(img,0,0, refbox, refbox);

}, 100, false)
