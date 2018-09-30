//HEXAGONS ------------------------------------------------------------------------------------------------------------------------------
var CL_fill = new DrawHex(CenterLogo_fill);       CL_fill.draw();               //Center logo fill object
var CL_border = new DrawHex(CenterLogo_border);   CL_border.draw();             //Center logo border object

//IMG -----------------------------------------------------------------------------------------------------------------------------------------
var img = new Image();
img.onload = function() {
  art.drawImage(img,0,0, ref_box_size, ref_box_size);                           //background artwork
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
  b_animation();
  tree_tl_animation();
  frame = requestAnimationFrame(animate);
}

framerate()
function framerate(){
  setTimeout(function () {
    console.log('AVG_framerate: ' +(frame - frame_old)/10)
    frame_old = frame; framerate();
  }, 10000);
}

// Mouse animation function -------------------------------------------------------------------------------------------------------------------
// See MouseMove() ------------------------------------------------------------- [F] main.js
function MM_Canvas(id, id_str){
  over[id_str] = false //ADD id to over object
  this.x = id.canvas.offsetLeft ;  this.y = id.canvas.offsetTop  ;
  this.w = id.canvas.width/dPR  ;  this.h = id.canvas.height/dPR ;
  //only fire when over canvas
  if(mouse.x > this.x && mouse.y > this.y && mouse.x < this.x + this.w && mouse.y < this.y + this.w){
    id = id.getImageData((mouse.x - id.canvas.offsetLeft)*dPR ,(mouse.y - id.canvas.offsetTop)*dPR,1,1).data
    if (id[3] > 0 && over[id_str] == false){
      over[id_str]= true
      $('#center_logo').css('pointer-events', 'initial');
    } else if (id[3] == 0 && over[id_str] == true){
      over[id_str]= false
      $('#center_logo').css('pointer-events', 'none');
    }
  }
}

// External animation trigger function --------------------------------------------------------------------------------------------------
function ExtAnimTrigger(id, object_id_arr, trigger){
  id.clearRect(0,0,iW,iH);
  for (var i = 0; i < object_id_arr.length; i++) {
    object_id_arr[i].animation.trigger = trigger
    object_id_arr[i].update()
  }
}


//Animations ----------------------------------------------------------------------------------------------------------------------------
function b_animation(){
  b.clearRect(0,0,iW,iH);
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
