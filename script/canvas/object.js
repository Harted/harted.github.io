// Harted Hex ------------------------------------------------------------------------------------------------------------------------------------
function DrawHex(id){

  //variables
  this.c = id.context
  this.sides = id.sides
  this.size = id.size()
  this.roundiv = id.roundiv
  this.center = {
    x: id.getCenter().x,
    y: id.getCenter().y,
  }
  this.velocity = {
    x: id.getVelocity().x,
    y: id.getVelocity().y,
  }
  this.fill = {
    on: id.getFill().on,
    color: id.getFill().color,
    secondary_color: id.getFill().secondary_color,
  }
  this.border = {
    on: id.getBorder().on,
    color: id.getBorder().color,
    secondary_color: id.getBorder().secondary_color,
    linediv: id.getBorder().linediv,
  }
  this.animation = {
    func: id.animation().func,
    startframe: id.animation().startframe,
    circleradius: id.animation().circleradius,
  }
  this.animamtion = {
    trigger: false,
  }
  this.linecount = 0

  this.c.strokeStyle = this.border.color
  this.c.lineWidth = this.size/this.border.linediv
  this.c.fillStyle = this.fill.color

  this.draw = function() {

    //SAVE the canvas state
    this.c.save()

    this.c.translate(this.center.x,this.center.y)
    this.c.scale(1.05,1)
    this.c.rotate(180/this.sides*deg)
    this.c.translate(-this.center.x,-this.center.y)

    var x1 = this.center.x +  (this.size * Math.cos((180/this.sides)*deg)) * Math.cos(cir/(this.sides*2))
    var y1 = this.center.y +  (this.size * Math.cos((180/this.sides)*deg)) * Math.sin(cir/(this.sides*2))

    this.c.beginPath();
    this.c.moveTo (x1 , y1);

    for (var i = 2; i <= (this.sides) + 1; i++) {
      x1 = this.center.x + this.size * Math.cos((i-1) * cir / (this.sides))
      y1 = this.center.y + this.size * Math.sin((i-1) * cir / (this.sides))
      x2 = this.center.x + this.size * Math.cos((i) * cir / (this.sides))
      y2 = this.center.y + this.size * Math.sin((i) * cir / (this.sides))
      this.c.arcTo (x1, y1, x2, y2, this.size/this.roundiv);
    }
    this.c.closePath()

    if (this.border.on == true) { this.c.stroke() }
    if (this.fill.on == true) { this.c.fill() }

    //RESTORE the canvas state
    this.c.restore()

    this.disttomouse = twoPointDist(this.center.x,mouse_left,this.center.y,mouse_top)
    this.distobjtocenter = twoPointDist(id.getCenter().x,this.center.x,id.getCenter().y,this.center.y)

    if (this.c == b && this.disttomouse < 180 && this.distobjtocenter > 180){
      this.c.beginPath()
      this.c.moveTo(this.center.x, this.center.y)
      this.c.lineTo(mouse_left, mouse_top)
      console.log(mouse_left,mouse_top)
      this.c.closePath()
      this.c.strokeStyle = '#999999'
      this.c.stroke()
    }

}
  this.update = function() {
    if (frame > this.animation.startframe){
      if (this.animation.func == 'bounce'){

        if (this.center.x + this.size > iW || this.center.x - this.size < 0) {
          this.velocity.x = -this.velocity.x;
        };

        if (this.center.y + this.size > iH || this.center.y - this.size < 0) {
          this.velocity.y = -this.velocity.y;
        };

        this.center.x += this.velocity.x;
        this.center.y += this.velocity.y;
      }

      if (this.animation.func == 'borderreset'){

        if (this.center.x - this.size > iW || this.center.x + this.size < 0 || this.center.y - this.size > iH || this.center.y + this.size < 0) {
          this.center.x = id.getCenter().x
          this.center.y = id.getCenter().y
        };

        this.center.x += this.velocity.x;
        this.center.y += this.velocity.y;
      }

      if (this.animation.func == 'circlereset'){

        let dist = Math.pow((Math.pow(this.center.x - id.getCenter().x,2) + Math.pow(this.center.y - id.getCenter().y,2)),0.5)

        if (dist > this.animation.circleradius) {
          this.center.x = id.getCenter().x
          this.center.y = id.getCenter().y
        };

        this.center.x += this.velocity.x;
        this.center.y += this.velocity.y;
      }

      this.draw()
    }

    if (this.animation.trigger == true) {
      FillAnimOn(this)
    } else {
      FillAnimOff(this)
    }

    function FillAnimOn(th){
      th.c.fillStyle = th.fill.secondary_color
      th.c.strokeStyle = th.border.secondary_color
      th.draw()
    }
    function FillAnimOff(th){
      th.c.fillStyle = th.fill.color
      th.c.strokeStyle = th.border.color
      th.draw()    }
  }
}
