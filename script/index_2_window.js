// MOUSE -----------------------------------------------------------------------
$(window).on('mousemove', function(event) {

  mouse.x = event.pageX;
  mouse.y = event.pageY;

  if (mouse.x != mouse.x_old || mouse.y != mouse.y_old) {
    mouse.x_old = mouse.x;	mouse.y_old = mouse.y;

    // not clickable when over logo
    overCanvas('cl', {'pointer-events': 'none',}, {'pointer-events': 'auto',})
  }
});
