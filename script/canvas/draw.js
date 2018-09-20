//draw static objects
var CL_fill = new DrawHex(CenterLogo_fill)
CL_fill.draw();
var CL_border = new DrawHex(CenterLogo_border)
CL_border.draw();

//push object array for animation
var LA_array = [];
for (var i = 0; i < 30; i++) {
  LA_array.push(new DrawHex(LogoAnim, LA_array, i))
}

// Animation ------------------------------------------------------------------------------------------------------------------------------------
animate();
function animate(){
  requestAnimationFrame(animate);
  frame = frame + 1
  b.clearRect(0,0,iW,iH);
  for (var i = 0; i < LA_array.length; i++) {
    LA_array[i].update(LA_array);
  }
}


// Temp mousemove center logo -> make function
function MouseMoveCanvas(){
  id = cl.getImageData(mouse.x - cl.canvas.offsetLeft ,mouse.y - cl.canvas.offsetTop,1,1).data
  if (id[3] > 0 && over.cl == false){
    over.cl = true
    $('#center_logo').css('pointer-events', 'auto');
  } else if (id[3] == 0 && over.cl == true){
    over.cl = false
    $('#center_logo').css('pointer-events', 'none');
  }
}

function ExtAnimTrigger(object_id, trigger){
  object_id.animation.trigger = trigger
  object_id.update()
}
