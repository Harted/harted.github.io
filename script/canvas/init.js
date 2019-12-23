//Constants  ----------------------------------------------------------------------------------------------------------------------------------
const deg = Math.PI / 180;  //to give degrees and get radians
const rad = 180 / Math.PI;  //to give radians and get degrees
const cir = Math.PI * 2;    //full circle (360deg)
const loc_arr = [           //location array used in fillTree (starting right going down)
  [2,0],[2,1],[2,2],[1,2],[0,2],[-1,2],[-2,2],[-2,1],
  [-2,0],[-2,-1],[-2,-2],[-1,-2],[0,-2],[1,-2],[2,-2],[2,-1],
];

//canvas properties
const canvas_properties = [
  {
    html_id: '#background',
    context_id: 'b',
    width: win.iW,
    height: win.iH,
  },
  {
    html_id: '#center_logo',
    context_id: 'cl',
    width: (logo.size * 1.05),
    height: (logo.size * 1.05),
  },
  {
    html_id: '#art',
    context_id: 'art',
    width: refbox,
    height: refbox,
  },
  {
    html_id: '#tree_tl',
    context_id: 'tree_tl',
    width: refbox/3,
    height: refbox/3,
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
    canvas.width = obj.width * win.dPR;
    canvas.style.width = obj.width + 'px';
    canvas.height = obj.height * win.dPR;
    canvas.style.height = obj.height + 'px';
    //compensate devicePixelRatio
    window[obj.context_id].translate(b.width/2,b.height/2)
    window[obj.context_id].scale(win.dPR,win.dPR);
    window[obj.context_id].translate(-b.width/2,-b.height/2);
  }
  for (var i = 0; i < obj.length; i++) {this.setContext(obj[i])}                //generate canvasses
}
