// Harted Hex ------------------------------------------------------------------------------------------------------------------------------------
function DrawHex(id, array, i){

  //variables
  this.c = id.context
  this.sides = id.sides
  this.size = id.getSize().s
  this.roundiv = id.roundiv
  this.mass = 1
  this.linedist = id.linedist
  //console.log('size: ' + this.size, 'mass: ' + this.mass)
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
    if (i !== 0 && array !== undefined) {
      this.respawn = 0
      for (let j = 0; j < array.length; j++) {
        if (twoPointDist(this.startcenter.x, array[j].center.x, this.startcenter.y, array[j].center.y) - (this.size + array[j].size) < 0 && j !== i) {
          this.respawn = this.respawn + 1
          if (this.respawn == 100) {
            console.log('nohex')
            return false
          }
          this.init()
          j = -1;
        }
      }
    }
  }
  this.init();
  this.anti_overlap();
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
    trigger: false,
  }

  this.c.strokeStyle = this.border.color
  this.c.lineWidth = this.size/this.border.linediv
  this.c.fillStyle = this.fill.color

  this.draw = function() {

    if (frame > this.animation.startframe) {

      this.disttomouse = twoPointDist(this.center.x,mouse_left,this.center.y,mouse_top)
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

      if (this.border.on == true) { this.c.stroke() }
      if (this.fill.on == true) { this.c.fill() }

      //RESTORE the canvas state
      this.c.restore()
      if (this.c == b && this.disttomouse < this.linedist && this.distobjtocenter > id.getCenter().spawnradius){
        this.c.beginPath()
        this.c.moveTo(this.center.x, this.center.y)
        this.c.lineTo(mouse_left, mouse_top)
        this.c.closePath()
        this.lineOpacity = "rgba(50,50,50," + (-Math.pow(this.disttomouse/this.linedist,2)+1) + ")"
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





  /**
 * Rotates coordinate system for velocities
 *
 * Takes velocities and alters them as if the coordinate system they're on was rotated
 *
 * @param  Object | velocity | The velocity of an individual particle
 * @param  Float  | angle    | The angle of collision between two objects in radians
 * @return Object | The altered x and y velocities after the coordinate system has been rotated
 */

function rotate(velocity, angle) {
    const rotatedVelocities = {
        x: velocity.x * Math.cos(angle) - velocity.y * Math.sin(angle),
        y: velocity.x * Math.sin(angle) + velocity.y * Math.cos(angle)
    };

    return rotatedVelocities;
}

/**
 * Swaps out two colliding particles' x and y velocities after running through
 * an elastic collision reaction equation
 *
 * @param  Object | particle      | A particle object with x and y coordinates, plus velocity
 * @param  Object | otherParticle | A particle object with x and y coordinates, plus velocity
 * @return Null | Does not return a value
 */

function resolveCollision(particle, otherParticle) {
    const xVelocityDiff = particle.velocity.x - otherParticle.velocity.x;
    const yVelocityDiff = particle.velocity.y - otherParticle.velocity.y;

    const xDist = otherParticle.center.x - particle.center.x;
    const yDist = otherParticle.center.y - particle.center.y;

    // Prevent accidental overlap of particles
    if (xVelocityDiff * xDist + yVelocityDiff * yDist >= 0) {

        // Grab angle between the two colliding particles
        const angle = -Math.atan2(otherParticle.center.y - particle.center.y, otherParticle.center.x - particle.center.x);

        // Store mass in var for better readability in collision equation
        const m1 = particle.mass;
        const m2 = otherParticle.mass;

        // Velocity before equation
        const u1 = rotate(particle.velocity, angle);
        const u2 = rotate(otherParticle.velocity, angle);

        // Velocity after 1d collision equation
        const v1 = { x: u1.x * (m1 - m2) / (m1 + m2) + u2.x * 2 * m2 / (m1 + m2), y: u1.y };
        const v2 = { x: u2.x * (m1 - m2) / (m1 + m2) + u1.x * 2 * m2 / (m1 + m2), y: u2.y };

        // Final velocity after rotating axis back to original location
        const vFinal1 = rotate(v1, -angle);
        const vFinal2 = rotate(v2, -angle);

        // Swap particle velocities for realistic bounce effect
        particle.velocity.x = vFinal1.x;
        particle.velocity.y = vFinal1.y;

        otherParticle.velocity.x = vFinal2.x;
        otherParticle.velocity.y = vFinal2.y;
    }
}
