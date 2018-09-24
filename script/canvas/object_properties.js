var LogoAnim = {
  context: b,
  sides: 6,
  roundiv: 8,
  velocity_factor: 10,
  chance: true,
  getSize: function(){
    return {
      s: (logo_size/6)*0.97 * (Math.random()/2+0.5),
    }
  },
  getCenter: function(){
    return {
      x: iW/2,
      y: iH/2,
      spawnradius: min_window_size/6,
    };
  },
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
      secondary_color: undefined,
    };
  },
  getBorder: function() {
    return {
      on: undefined,
      color: '#3E3E3E',
      secondary_color: undefined,
      linediv: 20,
      ifnofill: true,
    };
  },
  getMouseLine: function() {
    return{
      dist: 150,
    }
  },
  animation: function() {
    return {
      func: 'bounce',//'bounce',
      startframe: Math.floor(Math.random() * 1000),
      circleradius: min_window_size/2*0.9, //circlereset
    }
  },
}

var CenterLogo_fill = {
  context: cl,
  sides: 6,
  roundiv: 8,
  velocity_factor: undefined,
  chance: false,
  getSize: function(){
    return {
      s: logo_size / 2 * 0.97,
    }
  },
  getCenter: function(){
    return {
      x: logo_size,
      y: logo_size,
      spawnradius: undefined,
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
  getMouseLine: function() {
    return{
      dist: undefined,
    }
  },
  animation: function() {
    return {
      func: undefined,
      startframe: undefined,
      circleradius: undefined, //circlereset
    }
  },
}

var CenterLogo_border = {
  context: cl,
  sides: 6,
  roundiv: 8,
  velocity_factor: undefined,
  chance: false,
  getSize: function(){
    return {
      s: logo_size / 2 * 1.02,
      max: undefined,
    }
  },
  getCenter: function(){
    return {
      x: logo_size,
      y: logo_size,
      spawnradius: undefined,
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
      ifnofill: undefined,
    };
  },
  getMouseLine: function() {
    return{
      dist: undefined,
    }
  },
  animation: function() {
    return {
      func: undefined,
      startframe: undefined,
      circleradius: undefined, //circlereset
    }
  },
}

var DrawHex_Dummy = {
  context: undefined,
  sides: undefined,
  roundiv: undefined,
  velocity_factor: undefined,
  chance: true,
  getSize: function(){
    return {
      s: undefined,
    }
  },
  getCenter: function(){
    return {
      x: undefined,
      y: undefined,
      spawnradius: undefined,
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
      on: undefined,
      color: undefined,
      secondary_color: undefined,
    };
  },
  getBorder: function() {
    return {
      on: undefined,
      color: undefined,
      secondary_color: undefined,
      linediv: undefined,
      ifnofill: undefined,
    };
  },
  getMouseLine: function() {
    return{
      dist: undefined,
    }
  },
  animation: function() {
    return {
      func: undefined,
      startframe: undefined,
      circleradius: undefined, //for circlereset
    }
  },
}
