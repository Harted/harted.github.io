var LogoAnim = {
  context: b,
  sides: 6,
  roundiv: 8,
  velocity_factor: 2,
  chance: true,
  getSize: function(){
    if (chance(100)){
      return (logo_size/12)*0.97 * (Math.random()/2+0.50)
    } else {
      return logo_size/4
    }
  },
  getCenter: function(){
    return {
      x: win.iW/2,
      y: win.iH/2,
      spawnradius: win.iMin/6,
    };
  },
  getVelocity: function(){
    return {
      x: 1/win.dPR * (Math.random() - 0.5) * this.velocity_factor,
      y: 1/win.dPR * (Math.random() - 0.5) * this.velocity_factor,
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
      linediv: 30,
      ifnofill: true,
    };
  },
  getMouseLine: function() {
    return{
      dist: 200,
      linewidth: 0.2,
    }
  },
  animation: function() {
    return {
      func: 'bounce',//'bounce',
      startframe: Math.floor(Math.random() * 1000),
      circleradius: win.iMin/2*0.9, //circlereset
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
    return logo_size / 2 * 0.97
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
    return logo_size / 2 * 1.02
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
