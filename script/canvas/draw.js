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
var tree_tl = new DrawTree(tree_1)
//tree_tl.draw()

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
    console.log('AVG_framerate: ' +(frame - frame_old))
    frame_old = frame
    framerate();
  }, 1000);
}

animate();
function animate(){
  frame = requestAnimationFrame(animate)
  b.clearRect(0,0,iW,iH);
  for (var i = 0; i < LA_array.length; i++) {
    //LA_array[i].update(LA_array);
  }

  if (tree_tl.tree[0][tree_tl.tree[0].length-1].end.y > 20){
    tree.clearRect(0,0,tree.canvas.width, tree.canvas.height)
    treebug.clearRect(0,0,tree.canvas.width, tree.canvas.height)
    console.log('UPDATE------------------------------')
    console.time('UPDATE')
    tree_tl.update()
    console.timeEnd('UPDATE')
  } else {
    tree_tl.newTree()
    tree_tl.update()
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












function FillTree(){
  //get image data from complete canvas and extract alpha to array

  imagedata = []
  console.time('getImageData')
  imagedata = tree.getImageData(0,0,tree.canvas.width,tree.canvas.width).data
  console.timeEnd('getImageData')
  //init pixel_end_array and pixel object
  pixel_end_array = []; pixel_array = []; pixel = {}

  console.time('findEndPixel')
  for (var i = 0; i < imagedata.length/4 ; i++) {
    if (imagedata[(i*4)-1] > 0) {
      initPixel(tree, i)
      if (findPathEndPixel(tree,i)) {   //pixelpath_end true or false
        pixel_end_array.push(pixel)    //pixel object
        if (pixel_end_array.length == (tree_1.branches+2)/2){break;}
      }
    }
  }
  console.timeEnd('findEndPixel')

  //console.log(pixel_end_array);

  console.time('findPixelPath')
  for (var i = 0; i < pixel_end_array.length; i++) {
    pixel_array.push(pixel_end_array[i])
    findPixelPath(pixel_end_array[i])
  }
  console.timeEnd('findPixelPath')
  //temp red circle to point pixel
  console.time('Path complete')
  var arc = 0
  console.time('rect')
  for (var i = 0; i < pixel_array.length; i++) {
    for (var j = 0; j < pixel_end_array.length; j++) {
      if (pixel_array[i].y == pixel_end_array[j].y && pixel_array[i].x == pixel_end_array[j].x) {
        arc = 0
      }
    }
    x = pixel_array[i].x/dPR
    y = pixel_array[i].y/dPR
    w = ran_rect_arr[arc]
    h = ran_rect_arr[arc]
    tree.fillRect(x-w/2,y-h/2,w,h)
    arc++
  }
  console.timeEnd('rect')
  console.timeEnd('Path complete')
}

function findPixelPath(end_pixel){
  var temp_pixel = end_pixel
  var collision = false
  this.searching = function() {
    if (loc_arr[temp_pixel.direction] == undefined){debugger}
    x = temp_pixel.x + loc_arr[temp_pixel.direction][0]
    y = temp_pixel.y + loc_arr[temp_pixel.direction][1]
    initPixel(tree, y * tree.canvas.width + x)
    pixel.x = x
    pixel.y = y
    findSurroundingPixels(tree)
    if (pixel.sur_count > 12) {
      treebug.fillStyle = 'red'
      treebug.beginPath()
      treebug.arc(pixel.x/dPR,pixel.y/dPR,2,0,Math.PI*2)
      treebug.fill()
      collision = true
    }
    if (pixel.direction == -1){
      //debugger
      return false
    }
    pixel_array.push(pixel)
    temp_pixel = pixel

    if (y < tree.canvas.height - 4 && collision == false){
      this.searching()
    }
  }

  this.searching()
}

function initPixel(id, i){
  pixel = {
    x: i % id.canvas.height,
    y: (i - i % id.canvas.height) / id.canvas.width,
    alpha: imagedata[(i*4)-1], //alphadata[i],
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
    var sur_count_max = 3
  }
  if (pixel.sur_count > sur_count_max) { path_end = false; if(pixel_end_array.lenght < 1){console.log(pixel); debugger} } //if more than 2 surrounding pixels
  else if (pixel.sur_count_groups > 1) { path_end = false; if(pixel_end_array.lenght < 1){console.log(pixel); debugger} } //if more than 1 group of next to eachother lying pixels
  else if (pixel.y > id.canvas.height - 10) { path_end = false; if(pixel_end_array.lenght < 1){console.log(pixel); debugger} }  //if 10 px from bottom..
  else { //check if pixel is not a neighbor of previously path_end pixels
    for (let i = 0; i < pixel_end_array.length; i++) {
      cond_y = pixel.y < pixel_end_array[i].y + 2 && pixel.y > pixel_end_array[i].y - 2
      cond_x = pixel.x < pixel_end_array[i].x + 2 && pixel.x > pixel_end_array[i].x - 2
      if (cond_y && cond_x) { path_end = false }
    }
  };
  return path_end;
}

function findSurroundingPixels(id){
  for (let i = 0; i < loc_arr.length; i++) {
    //push surrounding pixel data in object
    pixel.surrounding.push( imagedata[
      ((pixel.x + loc_arr[i][0]) + (pixel.y + loc_arr[i][1]) * id.canvas.width)*4-1
    ])
    //check alpha max
    if (pixel.surrounding[i] > pixel.alpha_max) {
      var alreadyfound = false;
      var angle_ok = i < 9
      //var angle
      pixel.alpha_max = pixel.surrounding[i]
      if (pixel_array.length < 1){
        if (angle_ok){ pixel.direction = i }
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
        if (alreadyfound) { pixel.alpha_max = 0 }
        //check angle
        // angle = Math.abs(i - pixel_array[pixel_array.length-1].direction)
        // angle_ok = angle < 6
        if (alreadyfound == false && angle_ok) {
          pixel.direction = i
        }
      }
      pixel.directions.push([i, 'already:', alreadyfound, 'angle:', undefined, 'ok:', angle_ok, 'alpha: ', pixel.surrounding[i] ])
    }
    //count pixels and pixel groups
    if (pixel.surrounding[i] > 0) {
      pixel.sur_count++
      if (pixel.surrounding[i-1] == 0 || pixel.surrounding[i-1] == undefined){
        pixel.sur_count_groups++
      }
    }
  }
  if (pixel.direction == undefined){
    pixel.direction = -1
  }
}
