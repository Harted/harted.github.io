//draw hexagons
var CL_fill = new DrawHex(CenterLogo_fill); CL_fill.draw();
var CL_border = new DrawHex(CenterLogo_border); CL_border.draw();

//IMG -----------------------------------------------------------------------------------------------------------------------------------
var img = new Image();
img.onload = function() {
  art.drawImage(img,0,0, ref_box_size, ref_box_size);
};
img.src = 'image/vlek.png';

//TREE -----------------------------------------------------------------------------------------------------------------------------------
var tree_top_left = new DrawTree(TreeTopLeft); tree_top_left.draw();

//push object array for animation
var LA_array = [];
var LA_max_elements = 25;
var LA_overlapped = 0;
for (var i = 0; i < LA_max_elements; i++) {
  LA_array.push(new DrawHex(LogoAnim, LA_array, i));
  if (LA_array[i].overlap) {
    LA_array.pop(); i-- ; LA_overlapped++ ;
    if (LA_overlapped > 1000) {break;};
  };
};
//console.log('LA_array.length: ' + LA_array.length);

// Animation ------------------------------------------------------------------------------------------------------------------------------------
var frame_old = 0
var FR = 60

framerate()
function framerate(){
  setTimeout(function () {
    console.log('AVG_framerate: ' +(frame - frame_old)/10)
    frame_old = frame
    framerate();
  }, 10000);
}

animate();
function animate(){
  frame = requestAnimationFrame(animate)
  b.clearRect(0,0,iW,iH);
  for (var i = 0; i < LA_array.length; i++) {
    LA_array[i].update(LA_array);
  }

  if (tree_top_left.tree[0][tree_top_left.tree[0].length-1].end.y > 100){  //max heigth
    tree_tl.clearRect(0,0,tree_tl.canvas.width, tree_tl.canvas.height)
    tree_top_left.update()
  } else {
    tree_top_left.newTree()
    tree_top_left.update()
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
