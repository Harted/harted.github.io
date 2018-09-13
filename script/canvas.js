function Canvas(){
  var c_logo = $('#c_logo')[0];
  //logo_size = 500
  c_logo.width = window.innerWidth
  c_logo.height = window.innerHeight

  var cl = c_logo.getContext('2d');
  var deg = Math.PI / 180
  var circle = Math.PI * 2


  //
  //
  // // hexagon
  // var sides = 6,
  // size = logo_size*2,
  // xc = c_logo.width/2,
  // yc = c_logo.height/2;
  // x1 = xc +  (size * Math.cos((180/sides)*deg)) * Math.cos(circle/(sides*2))
  // y1 = yc +  (size * Math.cos((180/sides)*deg)) * Math.sin(circle/(sides*2))
  //
  // cl.save()
  // cl.translate(c_logo.width/2,c_logo.height/2)
  // cl.scale(1.05,1)
  // cl.rotate(180/sides*deg)
  // cl.translate(-c_logo.width/2,-c_logo.height/2)
  //
  // cl.beginPath();
  // cl.moveTo (x1 , y1);





  //DrawHex(cl, 6, logo_size/2, c_logo.width/2, c_logo.height/2)

  for (var i = 2; i <= 1000 ; i++) {
    DrawHex(cl, 6, logo_size/10 * Math.random(), (c_logo.width * Math.random()), (c_logo.height * Math.random()))
  }

  function DrawHex(context_id, sides, size, xcenter, ycenter){
    //variables
    this.sides = sides
    this.size = size
    this.xc = xcenter
    this.xy = ycenter
    this.x1 = this.xc +  (this.size * Math.cos((180/this.sides)*deg)) * Math.cos(circle/(this.sides*2))
    this.y1 = this.xy +  (this.size * Math.cos((180/this.sides)*deg)) * Math.sin(circle/(this.sides*2))

    //transform
    context_id.save()
    context_id.translate(this.xc,this.xy)
    context_id.scale(1.05,1)
    context_id.rotate(180/sides*deg)
    context_id.translate(-this.xc,-this.xy)

    context_id.beginPath();
    context_id.moveTo (this.x1 , this.y1);

    for (var i = 2; i <= (this.sides) + 1; i++) {
        this.x1 = this.xc + this.size * Math.cos((i-1) * circle / (this.sides))
        this.y1 = this.xy + this.size * Math.sin((i-1) * circle / (this.sides))
        this.x2 = this.xc + this.size * Math.cos((i) * circle / (this.sides))
        this.y2 = this.xy + this.size * Math.sin((i) * circle / (this.sides))
        context_id.arcTo (this.x1, this.y1, this.x2, this.y2, this.size/6);
    }
    context_id.closePath()
    context_id.strokeStyle = "#999"
    context_id.fillStyle = "#999"
    context_id.lineWidth = size/30;
    context_id.stroke()
    context_id.fill()
    context_id.restore()

  }



};
