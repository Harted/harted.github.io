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
var tree1 = new DrawTree(tree)
var tree2 = new DrawTree(tree)
tree1.draw()
tree2.draw()
// console.log(tree1.tree_arr);
// console.log(tree2.tree_arr);




// PIXEL finder
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
    x: i % tree.canvas.height,
    y: (i - i % tree.canvas.height) / tree.canvas.width,
    hue: treehuedata[i],
    direction: undefined,
    sur: [],
    surmax: 0,
    arr_loc: i,
  }

  var l = [
    [2,0],[2,1],[2,2],[1,2],[0,2],[-1,2],[-2,2],[-2,1],
    [-2,0],[-2,-1],[-2,-2],[-1,-2],[0,-2],[1,-2],[2,-2],[2,-1],

  ]

  for (let i = 0; i < l.length; i++) {
    pixel.sur.push(treehuedata[xy(pixel.x+l[i][0],pixel.y+l[i][1],tree.canvas.width)],)
  }

  pixel.surcount = 0
  pixel.surcountnextto = 0
  for (let i = 0; i < pixel.sur.length; i++) {
    if (pixel.sur[i] > pixel.surmax ) {
      pixel.surmax = pixel.sur[i]
      pixel.direction = i
    }
    if (pixel.sur[i] > 0) {
      pixel.surcount++
      if (pixel.sur[i-1] == 0 || pixel.sur[i-1] == undefined){
        pixel.surcountnextto++
      }
    }
  }

  var found = true

  if (pixel.surcount > 2) {
    found = false
  } else if (pixel.surcountnextto > 1) {
    found = false
  } else if (pixel.y > tree.canvas.height - 10){
    found = false
  } else {
    //check if not lying next to previously found
    for (let i = 0; i < pixelarray.length; i++) {
      cond1 = pixel.y == pixelarray[i].y + 1
      cond2 = pixel.x < pixelarray[i].x + 2 && pixel.x > pixelarray[i].x - 2
      if (cond1 && cond2){
        found = false
      }
    }
  }

return found
}

for (var i = 0; i < treehuedata.length; i++) {
  if (treehuedata[i] > 0 && pixelfound < 10) {
    if (findpixel(i)) {
      i++
      pixelfound++
      pixelarray.push(pixel)
    }
  }
}

console.log(pixelarray);

tree.strokeStyle = 'red'

for (var i = 0; i < pixelarray.length; i++) {
  tree.beginPath()
  tree.arc(pixelarray[i].x/dPR,pixelarray[i].y/dPR,10/dPR,0,Math.PI*2)
  tree.closePath()
  tree.stroke()
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
