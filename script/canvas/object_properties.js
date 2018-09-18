var LogoAnim = {
  context: b,
  sides: 6,
  roundiv: 8,
  size: function(){
    return (logo_size/12)*0.97 * (Math.random()/2+0.5);
  },
  getCenter: function(){
    return {
      x: iW/2, //Math.random() * (iW - this.size() * 2) + this.size(),
      y: iH/2, //Math.random() * (iH - this.size() * 2) + this.size(),
      spawnradius: 100,
    };
  },
  velocity_factor: 1,
  getVelocity: function(){
    return {
      x: 1/dPR * (Math.random() - 0.5) * this.velocity_factor,
      y: 1/dPR * (Math.random() - 0.5) * this.velocity_factor,
    };
  },
  getFill: function () {
    return {
      on: ranum(0,1),
      color: '#3E3E3E',
    };
  },
  getBorder: function() {
    return {
      on: 1,
      color: '#3E3E3E',
      linediv: 20,
    };
  },
  animation: function() {
    return {
      func: 'circlereset',//'bounce',
      startframe: Math.floor(Math.random() * 500/this.velocity_factor),
      circleradius: min_window_size/2*0.95,
    }
  },
}

var CenterLogo_fill = {
  context: cl,
  sides: 6,
  roundiv: 8,
  size: function(){
    return logo_size / 2 * 0.97;
  },
  getCenter: function(){
    return {
      x: logo_size,
      y: logo_size,
      spawnradius: 0,
    };
  },
  getVelocity: function(){
    return {
      x: undefined,
      y: undefined,
    };
  },
  getFill: function () {
    return {
      on: true,
      color: '#3E3E3E',
      secondary_color: '#FFFFFF',
    };
  },
  getBorder: function() {
    return {
      on: false,
      color: '#3E3E3E',
      secondary_color: '#FFFFFF',
      linediv: 60,
    };
  },
  animation: function() {
    return {
      func: undefined,
      startframe: 0,
    }
  },
}

var CenterLogo_border = {
  context: cl,
  sides: 6,
  roundiv: 8,
  size: function(){
    return logo_size / 2 * 1.02;
  },
  getCenter: function(){
    return {
      x: logo_size,
      y: logo_size,
      spawnradius: 0,
    };
  },
  getVelocity: function(){
    return {
      x: undefined,
      y: undefined,
    };
  },
  getFill: function () {
    return {
      on: false,
      color: '#3E3E3E',
      secondary_color: '#FFFFFF',
    };
  },
  getBorder: function() {
    return {
      on: true,
      color: '#3E3E3E',
      secondary_color: '#FFFFFF',
      linediv: 60,
    };
  },
  animation: function() {
    return {
      func: undefined,
      startframe: 0,
    }
  },
}


// Utilities ------------------------------------------------------------------------------------------------------------------------------------
function ranum (a,b) {
  let x = Math.floor(((Math.random() * (b - a)) + a + 0.5))
  return x
}
function twoPointDist(x1,x2,y1,y2) {
  return Math.pow((Math.pow(x2-x1,2) + Math.pow(y2-y1,2)),0.5)
}

function valBetween(v, min, max) {
    return (Math.min(max, Math.max(min, v)));
}
