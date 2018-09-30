//Constants  ----------------------------------------------------------------------------------------------------------------------------------
const deg = Math.PI / 180;  //to give degrees and get radians
const rad = 180 / Math.PI;  //to give radians and get degrees
const cir = Math.PI * 2;    //full circle (360deg)
const loc_arr = [           //location array used in fillTree (starting right going down)
  [2,0],[2,1],[2,2],[1,2],[0,2],[-1,2],[-2,2],[-2,1],
  [-2,0],[-2,-1],[-2,-2],[-1,-2],[0,-2],[1,-2],[2,-2],[2,-1],
];

//canvas properties
var canvas_properties = [
  {
    html_id: '#background',
    context_id: 'b',
    width: iW,
    height: iH,
  },
  {
    html_id: '#center_logo',
    context_id: 'cl',
    width: logo_size * 2,
    height: logo_size * 2,
  },
  {
    html_id: '#art',
    context_id: 'art',
    width: ref_box_size,
    height: ref_box_size,
  },
  {
    html_id: '#tree_tl',
    context_id: 'tree_tl',
    width: ref_box_size/2,
    height: ref_box_size/2,
  },
];

//Generate canvasses  --------------------------------------------------------------------------------------------------------------------------
GenerateCanvas(canvas_properties)                                               //NOTE: to implement in window resize later
function GenerateCanvas(obj){
  this.setContext = function(obj){
    //set canvas and context
    let canvas = $(obj.html_id)[0];
    window[obj.context_id] = canvas.getContext('2d');
    //set width & height with devicePixelRatio
    canvas.width = obj.width * dPR;
    canvas.style.width = obj.width + 'px';
    canvas.height = obj.height * dPR;
    canvas.style.height = obj.height + 'px';
    //compensate devicePixelRatio
    window[obj.context_id].translate(b.width/2,b.height/2)
    window[obj.context_id].scale(dPR,dPR);
    window[obj.context_id].translate(-b.width/2,-b.height/2);
  }
  for (var i = 0; i < obj.length; i++) {this.setContext(obj[i])}                //generate canvasses
}
