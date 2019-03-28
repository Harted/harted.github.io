//CENTER LOGO ------------------------------------------------------------------------------------------------------------------------------
var CL_fill = new DrawHex(CenterLogo_fill);
var CL_border = new DrawHex(CenterLogo_border);

CL_fill.draw();
CL_border.draw();

//IMG -----------------------------------------------------------------------------------------------------------------------------------------
var img = new Image();
img.onload = function() {
  art.drawImage(img,0,0,refbox,refbox);                           //background artwork
};
img.src = 'image/vlek.png';



//TREE ----------------------------------------------------------------------------------------------------------------------------------------
var tree_top_left = new DrawTree(TreeTopLeft);    tree_top_left.draw();         //tree top left (About)

//HEXAGON array for animation -----------------------------------------------------------------------------------------------------------------
var LA_array = [], LA_overlapped = 0; LA_max_elements = ((25));//< SETTING      //maximum elements
for (var i = 0; i < LA_max_elements; i++) {                                     //put hexagons in an array
  LA_array.push(new DrawHex(LogoAnim, LA_array, i));
  if (LA_array[i].overlap) {                                                    //if an object overlaps while creating
    LA_array.pop(); i-- ; LA_overlapped++ ;                                     //delete the object from the array
    if (LA_overlapped > 1000) {break;};                                         //if there's no place left, stop putting hexagons in array
  };
};

// ANIMATION ----------------------------------------------------------------------------------------------------------------------------------
// Continuous ---------------------------------------------------------------------------------------------------------------------------------
var frame; var frame_old = 0;

animate();
function animate(){
  //console.time('animate')
  b_animation();
  //tree_tl_animation();
  frame = requestAnimationFrame(animate);
  //console.timeEnd('animate')
}

framerate()
function framerate(){
  setTimeout(function () {
    //console.log('AVG_framerate: ' +(frame - frame_old)/10)
    frame_old = frame; framerate();
  }, 10000);
}

// Mouse animation function -------------------------------------------------------------------------------------------------------------------
// See MouseMove() ------------------------------------------------------------- [F] main.js
function overCanvas(id_str, css_on, css_off){
  this.id = window[id_str];
  this.x = this.id.canvas.offsetLeft ;  this.y = this.id.canvas.offsetTop  ;
  this.w = this.id.canvas.width/win.dPR  ;  this.h = this.id.canvas.height/win.dPR ;
  //only fire when over canvas
  if(mouse.x > this.x && mouse.y > this.y && mouse.x < this.x + this.w && mouse.y < this.y + this.w){
    imd = id.getImageData((mouse.x - this.id.canvas.offsetLeft)*win.dPR ,(mouse.y - this.id.canvas.offsetTop)*win.dPR,1,1).data;
    if (imd[3] > 0 && (over[id_str] == false || over[id_str] == undefined)){
      over[id_str] = true;
      $('#' + this.id.canvas.id).css(css_off);
    } else if (imd[3] == 0 && over[id_str] == true){
      over[id_str] = false;
      $('#' + this.id.canvas.id).css(css_on);
    };
  };
};


// External animation trigger function --------------------------------------------------------------------------------------------------
function C_AnimTrigger(id, object_id_arr, trigger){
  id.clearRect(0,0,win.iW,win.iH);
  for (var i = 0; i < object_id_arr.length; i++) {
    object_id_arr[i].animation.trigger = trigger
    object_id_arr[i].update()
  }
}


//Animations ----------------------------------------------------------------------------------------------------------------------------
function b_animation(){
  b.clearRect(0,0,win.iW,win.iH);
  for (var i = 0; i < LA_array.length; i++) {
    LA_array[i].update(LA_array);
  }
}

function tree_tl_animation(){
  if (tree_top_left.tree[0][tree_top_left.tree[0].length-1].end.y > 100){  //max heigth
    tree_tl.clearRect(0,0,tree_tl.canvas.width, tree_tl.canvas.height)
    tree_top_left.update()
  } else {
    tree_top_left.newTree()
    tree_top_left.update()
  }
}
