const deg = Math.PI / 180
const rad = 180 / Math.PI
const cir = Math.PI * 2
const loc_arr = [
  [2,0],[2,1],[2,2],[1,2],[0,2],[-1,2],[-2,2],[-2,1],
  [-2,0],[-2,-1],[-2,-2],[-1,-2],[0,-2],[1,-2],[2,-2],[2,-1],
]
//used in branches for calculation on small sizes
const cc = 30

//global window variables
var dPR = window.devicePixelRatio
//dPR = 1
console.log('devicePixelRatio: '+ dPR);
var iW = window.innerWidth
var iH = window.innerHeight

//animation startframe init
var frame

var alphadata = []
//init pixel_end_array and pixel object
var pixel_end_array = []; var pixel_array = []; var pixel = {}
var ran_circle_arr = []

for (var i = 0; i < 1000; i++) {
  ran_circle_arr.push((100*i/2000*(Math.random()/4+0.75)/dPR)+0.5)
}


//generate canvas
Canvas('#background', 'b', iW, iH)
Canvas('#center_logo', 'cl', logo_size * 2, logo_size * 2)
Canvas('#art', 'art', ref_box_size, ref_box_size)
Canvas('#tree', 'tree', ref_box_size/2, ref_box_size/2)
Canvas('#treebug', 'treebug', ref_box_size/2, ref_box_size/2)




// Global canvas generator with devicePixelRatio compensation
function Canvas(id, context_id, width, height) {
  //set canvas and context
  let canvas = $(id)[0];
  window[context_id] = canvas.getContext('2d')
  //set width & height with devicePixelRatio
  canvas.width = width * dPR
  canvas.style.width = width + 'px'
  canvas.height = height * dPR
  canvas.style.height = height + 'px'
  //compensate devicePixelRatio
  window[context_id].translate(b.width/2,b.height/2)
  window[context_id].scale(dPR,dPR)
  window[context_id].translate(-b.width/2,-b.height/2)
}
