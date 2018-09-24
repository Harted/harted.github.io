// Harted Hex ------------------------------------------------------------------------------------------------------------------------------------
function DrawHex(id, array, i){

  //variables
  this.c = id.context
  this.sides = id.sides
  this.size = id.getSize().s
  this.roundiv = id.roundiv
  this.chance = id.chance
  this.init = function(){
    this.velocity = {
      x: id.getVelocity().x,
      y: id.getVelocity().y,
    }
    this.startcenter = {
      x: id.getCenter().x + (Math.abs(this.velocity.x)/this.velocity.x) * (Math.cos(Math.atan(this.velocity.y/this.velocity.x))*id.getCenter().spawnradius) || id.getCenter().x,
      y: id.getCenter().y + (Math.abs(this.velocity.x)/this.velocity.x) * (Math.sin(Math.atan(this.velocity.y/this.velocity.x))*id.getCenter().spawnradius) || id.getCenter().y,
    }
    this.center = {
      x: this.startcenter.x,
      y: this.startcenter.y,
    }
  }
  this.anti_overlap = function(){
    if (i > 0 && array !== undefined) {
      this.respawn = 0
      for (let j = 0; j < array.length; j++) {
        if (twoPointDist(this.startcenter.x, array[j].center.x, this.startcenter.y, array[j].center.y) - (this.size + array[j].size) < 0 && j !== i) {
          this.respawn = this.respawn + 1
          if (this.respawn == 10000) {
            return false
          }
          this.init()
          j = -1;
        }
      }
    }
  }
  this.init();
  if (this.anti_overlap() == false) {
    console.log("nohex", i)
    this.update = function(){
    }
    return false
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
    ifnofill:id.getBorder().ifnofill,
  }
  this.mouseline = {
    dist: id.getMouseLine().dist,
  }
  this.animation = {
    func: id.animation().func,
    startframe: id.animation().startframe || 0,
    circleradius: id.animation().circleradius,
    trigger: false,
  }

  //chance
  if (chance(10) && this.chance == true) {
    this.size = this.size * 4
  }


  this.c.strokeStyle = this.border.color
  this.c.lineWidth = this.size/this.border.linediv
  this.c.fillStyle = this.fill.color

  this.draw = function() {

    if (frame >= this.animation.startframe) {

      this.disttomouse = twoPointDist(this.center.x,mouse.x,this.center.y,mouse.y)
      this.distobjtocenter = twoPointDist(id.getCenter().x,this.center.x,id.getCenter().y,this.center.y)

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

      if (this.border.ifnofill){
        if (this.fill.on == false) {this.c.stroke()}
      } else if (this.border.on == true){
        this.c.stroke()
      }
      if (this.fill.on == true) { this.c.fill() }

      //RESTORE the canvas state
      this.c.restore()
      if (this.c == b && this.disttomouse < this.mouseline.dist && this.distobjtocenter > id.getCenter().spawnradius){
        this.c.beginPath()
        this.c.moveTo(this.center.x, this.center.y)
        this.c.lineTo(mouse.x, mouse.y)
        this.c.closePath()
        this.lineOpacity = "rgba(50,50,50," + (-Math.pow(this.disttomouse/this.mouseline.dist,2)+1) + ")"
        this.c.strokeStyle = this.lineOpacity
        this.c.stroke()
      }
    }
  }
  this.update = function(array) {


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
          this.init()
          this.anti_overlap()
        };

        this.center.x += this.velocity.x;
        this.center.y += this.velocity.y;
      }

      if (this.animation.func == 'circlereset'){

        let dist = Math.pow((Math.pow(this.center.x - id.getCenter().x,2) + Math.pow(this.center.y - id.getCenter().y,2)),0.5)

        if (dist > this.animation.circleradius) {
          this.init()
          this.anti_overlap()
        };

        this.center.x += this.velocity.x;
        this.center.y += this.velocity.y;

      }

      //slowdown
      // this.velocity.x = (Math.abs(this.velocity.x)-0.001)*(this.velocity.x/Math.abs(this.velocity.x))
      // this.velocity.y = (Math.abs(this.velocity.y)-0.001)*(this.velocity.y/Math.abs(this.velocity.y))

      if (i !== 0 && array !== undefined) {
        for (let j = 0; j < array.length; j++) {
          if (twoPointDist(this.center.x, array[j].center.x, this.center.y, array[j].center.y) - (this.size + array[j].size) < 0 && j !== i) {
            resolveCollision(this, array[j])
          }
        }
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

function resolveCollision(obj1, obj2){

  const xVelocityDiff = obj1.velocity.x - obj2.velocity.x;
  const yVelocityDiff = obj1.velocity.y - obj2.velocity.y;

  const xDist = obj2.center.x - obj1.center.x;
  const yDist = obj2.center.y - obj1.center.y;

  // Prevent accidental overlap of particles
  if (xVelocityDiff * xDist + yVelocityDiff * yDist >= 0) {

    //calculate mass
    const m1 = Math.pow(obj1.size,2) * Math.PI
    const m2 = Math.pow(obj2.size,2) * Math.PI

    //calculate speed vector
    const v1 = Math.pow(Math.pow(obj1.velocity.x,2)+Math.pow(obj1.velocity.y,2),1/2)
    const v2 = Math.pow(Math.pow(obj2.velocity.x,2)+Math.pow(obj2.velocity.y,2),1/2)

    //calculate movement angles
    const A1 = Math.atan(obj1.velocity.y/obj1.velocity.x)+(1-(Math.abs(obj1.velocity.x)/obj1.velocity.x))*90*deg || 90*deg*(Math.abs(obj1.velocity.y)/obj1.velocity.y)
    const A2 = Math.atan(obj2.velocity.y/obj2.velocity.x)+(1-(Math.abs(obj2.velocity.x)/obj2.velocity.x))*90*deg || 90*deg*(Math.abs(obj2.velocity.y)/obj2.velocity.y)

    //calculate collision angle
    const B = Math.atan((obj1.center.y - obj2.center.y)/(obj1.center.x - obj2.center.x))

    //cos and sin
    const cA1B = Math.cos(A1-B)
    const cA2B = Math.cos(A2-B)
    const sA1B = Math.sin(A1-B)
    const sA2B = Math.sin(A2-B)
    const cB = Math.cos(B)
    const sB = Math.sin(B)

    //velocities
    const obj1VelPart = (v1 * cA1B * (m1 - m2) + 2 * m2 * v2 * cA2B) / (m1 + m2)
    obj1.velocity.x = obj1VelPart * cB - v1 * sA1B * sB
    obj1.velocity.y = obj1VelPart * sB + v1 * sA1B * cB

    const obj2VelPart = (v2 * cA2B * (m2 - m1) + 2 * m1 * v1 * cA1B) / (m2 + m1)
    obj2.velocity.x = obj2VelPart * cB - v2 * sA2B * sB
    obj2.velocity.y = obj2VelPart * sB + v2 * sA2B * cB

  }

}
