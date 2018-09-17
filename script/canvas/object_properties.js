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
    };
  },
  getVelocity: function(){
    return {
      x: 1/dPR * (Math.random() - 0.5) * 1,
      y: 1/dPR * (Math.random() - 0.5) * 1,
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
      func: 'borderreset',//'bounce',
      startframe: Math.floor(Math.random() * 1000)
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
      x: iW/2,
      y: iH/2,
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
      startframe: undefined,
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
      x: iW/2,
      y: iH/2,
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
      startframe: undefined,
    }
  },
  mouseover: false,
}


// Utilities ------------------------------------------------------------------------------------------------------------------------------------
function ranum (a,b) {
  let x = Math.floor(((Math.random() * (b - a)) + a + 0.5))
  return x
}
