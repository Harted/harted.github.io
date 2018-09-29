//Constants
const deg = Math.PI / 180;  //to give degrees and get radians
const rad = 180 / Math.PI;  //to give radians and get degrees
const cir = Math.PI * 2;    //full circle (360deg)
const loc_arr = [           //location array used in fillTree (starting right going down)
  [2,0],[2,1],[2,2],[1,2],[0,2],[-1,2],[-2,2],[-2,1],
  [-2,0],[-2,-1],[-2,-2],[-1,-2],[0,-2],[1,-2],[2,-2],[2,-1],
];

//Global window variables // DEBUG: set in window function
var dPR = window.devicePixelRatio;
var iW = window.innerWidth;
var iH = window.innerHeight;

//animation startframe init
var frame;

//generate canvases
Canvas('#background', 'b', iW, iH);
Canvas('#center_logo', 'cl', logo_size * 2, logo_size * 2);
Canvas('#art', 'art', ref_box_size, ref_box_size);
Canvas('#tree_tl', 'tree_tl', ref_box_size/2, ref_box_size/2);

// Global canvas generator with devicePixelRatio
function Canvas(id, context_id, width, height) {
  //set canvas and context
  let canvas = $(id)[0];
  window[context_id] = canvas.getContext('2d');
  //set width & height with devicePixelRatio
  canvas.width = width * dPR;
  canvas.style.width = width + 'px';
  canvas.height = height * dPR;
  canvas.style.height = height + 'px';
  //compensate devicePixelRatio
  window[context_id].translate(b.width/2,b.height/2);
  window[context_id].scale(dPR,dPR);
  window[context_id].translate(-b.width/2,-b.height/2);
};
