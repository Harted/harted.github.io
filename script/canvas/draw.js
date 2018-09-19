dPR = window.devicePixelRatio
iW = window.innerWidth
iH = window.innerHeight
iWdPR = window.innerWidth*dPR
iHdPR = window.innerHeight*dPR
console.log('devicePixelRatio: ' + dPR);

background.width = iWdPR
background.style.width = iW + 'px'
background.height = iHdPR
background.style.height = iH + 'px'

c_logo.width = logo_size * 2 * dPR
c_logo.style.width = logo_size * 2 + 'px'
c_logo.height = logo_size * 2 * dPR
c_logo.style.height = logo_size * 2 + 'px'


//pixelRatio compensation
cl.translate(cl.width/2,cl.height/2)
cl.scale(dPR,dPR)
cl.translate(-cl.width/2,-cl.height/2)

b.translate(b.width/2,b.height/2)
b.scale(dPR,dPR)
b.translate(-b.width/2,-b.height/2)

//cl.globalCompositeOperation = 'lighter'

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

var CL_fill = new DrawHex(CenterLogo_fill)
var CL_border = new DrawHex(CenterLogo_border)
CL_fill.draw();
CL_border.draw();




function MouseMoveCanvas(){
  id = cl.getImageData(mouse_left - cl.canvas.offsetLeft ,mouse_top - cl.canvas.offsetTop,1,1).data
  if (id[3] > 0 && over.cl == false){
    over.cl = true
    $('#center_logo').css('pointer-events', 'auto');
  } else if (id[3] == 0 && over.cl == true){
    over.cl = false
    $('#center_logo').css('pointer-events', 'none');
  }
}

function AnimationTrigger(object_id, trigger){
  object_id.animation.trigger = trigger
  object_id.update()
}
