dPR = window.devicePixelRatio
iW = window.innerWidth
iH = window.innerHeight
iWdPR = window.innerWidth*dPR
iHdPR = window.innerHeight*dPR

background.width = iWdPR
background.style.width = iW + 'px'
background.height = iHdPR
background.style.height = iH + 'px'

c_logo.width = iWdPR
c_logo.style.width = iW + 'px'
c_logo.height = iHdPR
c_logo.style.height = iH + 'px'


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
  LA_array.push(new DrawHex(LogoAnim))
}


// Animation ------------------------------------------------------------------------------------------------------------------------------------
animate();
function animate(){
  requestAnimationFrame(animate);
  frame = frame + 1
  b.clearRect(0,0,iW,iH);
  for (var i = 0; i < LA_array.length; i++) {
    LA_array[i].update();
  }
}

var CL_fill = new DrawHex(CenterLogo_fill)
var CL_border = new DrawHex(CenterLogo_border)
CL_fill.draw();
CL_border.draw();




function MouseMoveCanvas(){
  id = cl.getImageData(mouse_left || 0 ,mouse_top || 0,1,1).data
  if (id[3] > 0 && over.cl == false){
    over.cl = true
  } else if (id[3] == 0 && over.cl == true){
    over.cl = false
  }
}

function AnimationTrigger(object_id, trigger){
  object_id.animation.trigger = trigger
  object_id.update()
}
