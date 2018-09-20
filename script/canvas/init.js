const deg = Math.PI / 180
const cir = Math.PI * 2

//global window variables
var dPR = window.devicePixelRatio
var iW = window.innerWidth
var iH = window.innerHeight

//animation startframe init
var frame = 0

//generate canvas
Canvas('#background', 'b', iW, iH)
Canvas('#center_logo', 'cl', logo_size * 2, logo_size * 2)
Canvas('#art', 'art', ref_box_size, ref_box_size)

var img = new Image();
img.onload = function() {
  art.drawImage(img,0,0, ref_box_size, ref_box_size)
}
img.src = 'image/vlek.png'
console.log(img);


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
