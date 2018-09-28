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
tree1.draw()

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









const loc_arr = [
  [2,0],[2,1],[2,2],[1,2],[0,2],[-1,2],[-2,2],[-2,1],
  [-2,0],[-2,-1],[-2,-2],[-1,-2],[0,-2],[1,-2],[2,-2],[2,-1],
]

//get image data from complete canvas and extract alpha to array
var imagedata = tree.getImageData(0,0,tree.canvas.width,tree.canvas.width).data
var alphadata = []
for (var y = 0; y < imagedata.length; y+=4) { alphadata.push(imagedata[y+3]) }

//init pixel_end_array and pixel object
var pixel_end_array = []; var pixel_array = []; var pixel = {}


for (var i = 0; i < alphadata.length; i++) {
  if (alphadata[i] > 0) {
    initPixel(tree, i)
    if (findPathEndPixel(tree,i)) {   //pixelpath_end true or false
      pixel_end_array.push(pixel)    //pixel object
    }
  }
}

console.log(pixel_end_array);

for (var i = 0; i < pixel_end_array.length; i++) {
  pixel_array.push(pixel_end_array[i])
  findPixelPath(pixel_end_array[i])
}

function findPixelPath(end_pixel){
  var temp_pixel = end_pixel
  this.searching = function() {
    if (temp_pixel.direction == undefined){
      console.log(pixel_array)
      tree.beginPath()
      tree.arc(pixel.x/dPR,pixel.y/dPR,10/dPR,0,Math.PI*2)
      tree.closePath()
      tree.stroke()
    }
    x = temp_pixel.x + loc_arr[temp_pixel.direction][0]
    y = temp_pixel.y + loc_arr[temp_pixel.direction][1]
    initPixel(tree, y * tree.canvas.width + x)
    pixel.x = x
    pixel.y = y
    findSurroundingPixels(tree)
    pixel_array.push(pixel)
    temp_pixel = pixel

    if (y < tree.canvas.height - 2){
      this.searching()
    }
  }

  this.searching()

}

function initPixel(id, i){
  pixel = {
    x: i % id.canvas.height,
    y: (i - i % id.canvas.height) / id.canvas.width,
    alpha: alphadata[i],
    alpha_max: 0,
    direction: undefined,
    directions: [],
    sur_count: 0,
    sur_count_groups: 0,
    surrounding: [],
    arr_loc: i,
  }
}

function findPathEndPixel(id, i){
  findSurroundingPixels(id)
  //check if pixel is path end
  var path_end = true
  if (getUserAgent() == 'Safari') {
    var sur_count_max = 4
  } else {
    var sur_count_max = 2
  }
  if (pixel.sur_count > sur_count_max) { path_end = false; console.log('sur_count: ', pixel.sur_count, pixel)} //if more than 2 surrounding pixels
  else if (pixel.sur_count_groups > 1) { path_end = false; console.log('sur_count_groups: ', pixel.sur_count_groups, pixel) } //if more than 1 group of next to eachother lying pixels
  else if (pixel.y > id.canvas.height - 10) { path_end = false; console.log('id.canvas.height: ', id.canvas.height, pixel) }  //if 10 px from bottom..
  else { //check if pixel is not a neighbor of previously path_end pixels
    for (let i = 0; i < pixel_end_array.length; i++) {
      cond_y = pixel.y < pixel_end_array[i].y + 2 && pixel.y > pixel_end_array[i].y - 2
      cond_x = pixel.x < pixel_end_array[i].x + 2 && pixel.x > pixel_end_array[i].x - 2
      if (cond_y && cond_x) { path_end = false; console.log('path_end: ', path_end, pixel)}
    }
  };
  return path_end;
}

function findSurroundingPixels(id){
  for (let i = 0; i < loc_arr.length; i++) {
    //push surrounding pixel data in object
    pixel.surrounding.push( alphadata[
      (pixel.x + loc_arr[i][0]) + (pixel.y + loc_arr[i][1]) * id.canvas.width
    ])
    //check alpha max
    if (pixel.surrounding[i] > pixel.alpha_max) {
      var alreadyfound = angle_ok = false
      var angle
      pixel.alpha_max = pixel.surrounding[i]
      if (pixel_array.length < 1){
        pixel.direction = i
      } else {
        for (let j = 0; j < pixel_array.length; j++) {
          if (
            pixel_array[j].x < pixel.x + loc_arr[i][0] + 2 &&
            pixel_array[j].x > pixel.x + loc_arr[i][0] - 2 &&
            pixel_array[j].y < pixel.y + loc_arr[i][1] + 2 &&
            pixel_array[j].y > pixel.y + loc_arr[i][1] - 2
          ) {
            alreadyfound = true
          }
        }
        if (alreadyfound) {
          pixel.alpha_max = 0
        } else {
          angle = Math.abs(i - pixel_array[pixel_array.length-1].direction)
          angle_ok = angle < 6
          if (angle_ok) {
            pixel.direction = i
          }
        }
      }
      pixel.directions.push([i, 'already:', alreadyfound, 'angle:', angle, 'ok:', angle_ok])
    }
    //count pixels and pixel groups
    if (pixel.surrounding[i] > 0) {
      pixel.sur_count++
      if (pixel.surrounding[i-1] == 0 || pixel.surrounding[i-1] == undefined){
        pixel.sur_count_groups++
      }
    }
  }
}

console.log(pixel_array)


//temp red circle to point pixel
for (var i = 0; i < pixel_array.length; i++) {
  tree.beginPath()
  tree.arc(
    pixel_array[i].x/dPR,
    pixel_array[i].y/dPR,
    (100*i/2000*(Math.random()/4+0.75)/dPR)+0.5,
    0,Math.PI*2
  )
  tree.closePath()
  tree.fill()
}
