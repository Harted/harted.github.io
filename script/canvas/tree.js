//global pixel variables
var imagedata = []
var pixel_end_array = [];
var pixel_array = [];
var pixel = {}

//random rectangles to make tree organic
var ran_rect_arr = []
for (var i = 0; i < 1000; i++) {
  ran_rect_arr.push((100*i/1500*(Math.random()/4+0.75)/win.dPR)+0.5)
}

$('#tree_tl').css('transform', 'translate(' + (-ref_box/4-logo.size/4) + 'px,' + (-ref_box/4-logo.size/4) + 'px)')

//Tree
function DrawTree(id){

  this.c = id.context
  this.c.fillStyle = "#3E3E3E"
  this.c.lineWidth = 1/win.dPR
  this.ba = this.branch_angle
  this.bpm = id.branch_parts_max
  this.bs = id.branches
  this.s = {
    x: id.start.x,
    y: id.start.y,
  }
  this.sd = id.slowdown

  var angle_index
  this.newTree = function(){
    this.grow = id.grow
    this.bpbl = id.branch_part_base_lenght
    angle_index = 0
    this.angle_arr = []
    for (var i = 0; i < this.bpm*(this.bpm+1)/2 + 1; i++) {
      this.angle_arr.push(
        id.branch_part_max_angle * 2 * (Math.random()-0.5) * deg
      )
    }
  }
  this.newTree()

  this.line = function(x,y,i,t){

    if (t > 0 && i == 0) {
      var angle = Math.abs(this.angle_arr[angle_index]) * (-1) * (Math.abs(this.tree[0][t].angle)/this.tree[0][t].angle)
    } else if (t == 0 && i == 0) {
      var angle = this.angle_arr[angle_index]/4
    } else {
      var angle = this.angle_arr[angle_index]
    }
    angle_index++

    if (t > 0) {
      angle += 30*deg * (-1)*(Math.abs(this.tree[0][t].angle)/this.tree[0][t].angle)
    }

    var l = {
      lenght: (1/Math.pow(i+1,1/2) * 1/Math.pow(t+1,1/2) * this.bpbl),
      start: {
        x: x,
        y: y,
      },
      angle: angle,
      end: {
        x: undefined,
        y: undefined,
      },
    }

    l.end.y = l.start.y - l.lenght
    l.end.x = l.start.x + l.lenght * Math.atan(l.angle)
    return l
  }

  this.init = function(){
    this.tree = []
    angle_index = 0
    for (var t = 0; t < this.bs; t++) {
      var branch = []
      if (t == 0) {
        var i = 0; l = branch.push(this.line(this.s.x, this.s.y, i,t)); i++
      } else {
        var i = 0; l = branch.push(this.line(this.tree[0][t].start.x, this.tree[0][t].start.y, i,t)); i++
      }

      for (i ; i < (this.bpm-t); i++) {
        branch.push(this.line(branch[i-1].end.x, branch[i-1].end.y, i, t))
      }
      this.tree.push(branch)
    }
  }
  this.init()


  this.draw = function(){
    this.c.save();
    this.c.translate(this.s.x,this.s.y);
    this.c.rotate(-45*deg)
    this.c.translate(-this.s.x,-this.s.y);


    for (var t = 0; t < this.bs; t++) {
      if (t > 0 && t % 2 == 0) {} else {
        this.c.beginPath()
        this.c.moveTo(this.tree[t][0].start.x,this.tree[t][0].start.y)
        this.c.lineTo(this.tree[t][0].end.x,this.tree[t][0].end.y)
        for (let i = 1; i < this.tree[t].length; i++) {
          this.c.lineTo(this.tree[t][i].end.x,this.tree[t][i].end.y)
        }
        this.c.stroke()
      }
    }

    this.c.restore();


  }

  this.update = function(){
    this.bpbl += this.grow
    this.grow -= this.grow/this.sd
    this.init()
    this.draw()
    FillTree(id)
  }

}

//FILL TREE ------------------------------------------------------------------------------------------------------------------------------
function FillTree(id){
  //get image data from complete canvas and extract alpha to array

  imagedata = []

  imagedata = id.context.getImageData(0,0,id.context.canvas.width,id.context.canvas.width).data

  //init pixel_end_array and pixel object
  pixel_end_array = []; pixel_array = []; pixel = {}


  for (var i = 0; i < imagedata.length/4 ; i++) {
    if (imagedata[(i*4)-1] > 0) {
      initPixel(id, i)
      if (findPathEndPixel(id, i)) {   //pixelpath_end true or false
        pixel_end_array.push(pixel)    //pixel object
        if (pixel_end_array.length == (id.branches+2)/2){break;}  //branches mod %2 in object for less branches
      }
    }
  }



  for (var i = 0; i < pixel_end_array.length; i++) {
    pixel_array.push(pixel_end_array[i])
    findPixelPath(id, pixel_end_array[i])
  }



  var arc = 0

  for (var i = 0; i < pixel_array.length; i++) {
    for (var j = 0; j < pixel_end_array.length; j++) {
      if (pixel_array[i].y == pixel_end_array[j].y && pixel_array[i].x == pixel_end_array[j].x) {
        arc = 0
      }
    }
    x = pixel_array[i].x/win.dPR
    y = pixel_array[i].y/win.dPR
    w = ran_rect_arr[arc]
    h = ran_rect_arr[arc]
    id.context.fillRect(x-w/2,y-h/2,w,h)
    arc++
  }

}

function findPixelPath(id,end_pixel){
  var temp_pixel = end_pixel
  var collision = false
  this.searching = function() {
    if (loc_arr[temp_pixel.direction] == undefined){}//debugger;}
    x = temp_pixel.x + loc_arr[temp_pixel.direction][0]
    y = temp_pixel.y + loc_arr[temp_pixel.direction][1]
    initPixel(id, y * id.context.canvas.width + x)
    pixel.x = x
    pixel.y = y
    findSurroundingPixels(id)
    if (pixel.sur_count > 12) {
      collision = true
    }
    if (pixel.direction == -1){
      //debugger
      return false
    }
    pixel_array.push(pixel)
    temp_pixel = pixel

    if (y < id.context.canvas.height - 4 && collision == false){
      this.searching()
    }
  }

  this.searching()
}

function initPixel(id, i){
  pixel = {
    x: i % id.context.canvas.height,
    y: (i - i % id.context.canvas.height) / id.context.canvas.width,
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
  if (userAgent == 'Safari') {
    var sur_count_max = 4
  } else {
    var sur_count_max = 3
  }
  if (pixel.sur_count > sur_count_max) { path_end = false; if(pixel_end_array.lenght < 1){console.log(pixel); debugger} } //if more than 2 surrounding pixels
  else if (pixel.sur_count_groups > 1) { path_end = false; if(pixel_end_array.lenght < 1){console.log(pixel); debugger} } //if more than 1 group of next to eachother lying pixels
  else if (pixel.y > id.context.canvas.height - 10) { path_end = false; if(pixel_end_array.lenght < 1){console.log(pixel); debugger} }  //if 10 px from bottom..
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
      ((pixel.x + loc_arr[i][0]) + (pixel.y + loc_arr[i][1]) * id.context.canvas.width)*4-1
    ])
    //check alpha max
    if (pixel.surrounding[i] > pixel.alpha_max) {
      var alreadyfound = false;
      var angle_ok = i < 7 || i > 13 // DEBUG: this has to be conditional
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
