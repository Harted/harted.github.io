function Canvas(){
  var c_logo = $('#c_logo')[0];
  //logo_size = 500
  c_logo.width = window.innerWidth
  c_logo.height = window.innerHeight

  var cl = c_logo.getContext('2d');
  var deg = Math.PI / 180


  cl.translate(c_logo.width/2,c_logo.height/2)
  cl.scale(1.05,1)
  cl.rotate(30 * deg);
  cl.translate(-c_logo.width/2,-c_logo.height/2)


  // hexagon
  var numberOfSides = 6,
  size = logo_size*4,
  Xcenter = c_logo.width/2,
  Ycenter = c_logo.height/2;

  cl.beginPath();
  x = Xcenter +  size * Math.cos(0)
  y = Ycenter +  size * Math.sin(0)
  cl.moveTo (x , y);

  for (var i = 1; i <= numberOfSides + 1; i++) {
    x = Xcenter + size * Math.cos((i-1) * 2 * Math.PI / numberOfSides)
    y = Ycenter + size * Math.sin((i-1) * 2 * Math.PI / numberOfSides)
    x2 = Xcenter + size * Math.cos((i) * 2 * Math.PI / numberOfSides)
    y2 = Ycenter + size * Math.sin((i) * 2 * Math.PI / numberOfSides)
    cl.arcTo (x, y, x2, y2, 30);
  }
  cl.closePath()

  cl.strokeStyle = "red"
  cl.stroke()
};
