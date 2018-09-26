//draw static objects
var CL_fill = new DrawHex(CenterLogo_fill)
//CL_fill.draw();
var CL_border = new DrawHex(CenterLogo_border)
//CL_border.draw();

//IMG -----------------------------------------------------------------------------------------------------------------------------------
var img = new Image();
img.onload = function() {
  //art.drawImage(img,0,0, ref_box_size, ref_box_size)
}
img.src = 'image/vlek.png'

//TREE -----------------------------------------------------------------------------------------------------------------------------------
var tree_start = {
  x: ref_box_size/2,
  y: ref_box_size,
}
var Tree = new MakeTree(tree)
Tree.draw()

function MakeTree(c){
  this.start = tree_start
  this.draw = function(){
    c.beginPath()
    c.moveTo(this.start.x,this.start.y)
    ypoint = ((Math.random()/4)+0.5)*tree.canvas.height/dPR
    xpoint = Math.random()*100

    c.lineTo(this.start.x-xpoint,ypoint)
    c.lineWidth = 1/dPR/5
    c.closePath()
    c.stroke()

    c.beginPath()
    c.moveTo(this.start.x-xpoint,ypoint)
    c.lineTo(this.start.x+100,ypoint-100)
    c.lineWidth = 1/dPR/5
    c.closePath()
    c.stroke()

    c.beginPath()
    c.moveTo(this.start.x-xpoint,ypoint)
    c.lineTo(this.start.x-100,ypoint-100)
    c.lineWidth = 1/dPR/5
    c.closePath()
    c.stroke()
  }
}

var treehuedata = []
for (var i = 0; i < tree.canvas.height; i++) {
  var treedatarow = tree.getImageData(0,i,tree.canvas.width,1).data
  for (var y = 0; y < treedatarow.length; y+=4) {
    treehuedata.push(treedatarow[y+3])
  }
}
var pixelfound = 0
var pixel = {}
var pixelarray = []
var pixelsur= []

function findpixel(i){
  pixel = {
    hue: treehuedata[i],
    x: i % tree.canvas.height,
    y: (i - i % tree.canvas.height) / tree.canvas.width,
    arr_loc: i,
    sur: [],
    surmax: 0,
    direction: undefined,
  }

  var l = [[1,0],[1,1],[0,1],[-1,1],[-1,0],[-1,-1],[0,-1],[1,-1]]

  for (let i = 0; i < l.length; i++) {
    pixel.sur.push(treehuedata[xy(pixel.x+l[i][0],pixel.y+l[i][1],tree.canvas.width)],)
  }



  for (let i = 0; i < pixel.sur.length; i++) {
    if (pixel.sur[i] > pixel.surmax ) {
      pixel.surmax = pixel.sur[i]
      pixel.direction = i + 1
    }
  }

  var found = false

  if (pixel.hue < treehuedata[i+1] && treehuedata[i+1] != 0) {
    //console.log('1')
    //console.log(pixel)
    i++
    //findpixel(i) DEBUG
  } else if (pixel.hue == 0) {
    //console.log('2')
    i++
    found = false
  } else {
    found = true
  }
  //console.log(pixel)
  return [i, found]
}

for (var i = 0; i < treehuedata.length; i+=dPR) {
  if (treehuedata[i] > 0 && pixelfound < 2000) {

    retval = findpixel(i)
    //console.log(retval)
    i = retval[0]
    if (retval[1]) {
      pixelfound++
      pixelarray.push(pixel)
    }
  }
}

console.log(pixelarray);

tree.fillStyle = '#3E3E3E'

for (var i = 0; i < pixelarray.length; i++) {
  tree.beginPath()
  tree.arc(pixelarray[i].x/dPR,pixelarray[i].y/dPR,(Math.random()/2*(i/50)+1),0,Math.PI*2)
  tree.closePath()
  tree.fill()
}

function xy(x,y,width){
  return width * y + x
}




//push object array for animation
var LA_array = [];
var LA_max_elements = 25;
var LA_overlapped = 0;
for (var i = 0; i < LA_max_elements; i++) {
  LA_array.push(new DrawHex(LogoAnim, LA_array, i))
  if (LA_array[i].overlap) {
    LA_array.pop()
    i--
    LA_overlapped++
    if (LA_overlapped > 1000) {
      break;
    }
  }
}
//console.log('LA_array.length: ' + LA_array.length);

// Animation ------------------------------------------------------------------------------------------------------------------------------------
var frame_old = 0
var FR = 60

framerate()
function framerate(){
  setTimeout(function () {
    //console.log('AVG_framerate(10s): ' +(frame - frame_old)/10)
    frame_old = frame
    framerate();
  }, 10000);
}

animate();
function animate(){
  frame = requestAnimationFrame(animate)
  b.clearRect(0,0,iW,iH);
  for (var i = 0; i < LA_array.length; i++) {
    //LA_array[i].update(LA_array);
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
