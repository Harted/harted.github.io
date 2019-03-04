// MOUSE -----------------------------------------------------------------------
$(window).on('mousemove', function(event) {

  mouse.x = event.pageX;
  mouse.y = event.pageY;

  if (mouse.x != mouse.x_old || mouse.y != mouse.y_old) {
    mouse.x_old = mouse.x;	mouse.y_old = mouse.y;

    // not clickable when over logo
    if (ready) {
      overCanvas('cl', {'pointer-events': 'none',}, {'pointer-events': 'auto',})
    }
  }
}).on('resize', function(){ onResize(); });

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
