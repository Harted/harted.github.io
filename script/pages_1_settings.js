// PAGE ------------------------------------------------------------------------
const page = true

// soundcloud ------------------------------------------------------------------
var playing_global = false;

// HEADER LOGO -----------------------------------------------------------------
var headerlogo_s = {
  color: color_back,
  size_factor: 2 / 3,
  size: function size() {
    return 50; //NOTE: same for linklogo (make global var?)
  },
  width: function width() {
    return this.size() * this.size_factor;
  },
  margin: function margin() {
    return (this.size() * (1 - this.size_factor)) / 2;
  },
  right: '3%',
  bottom: 0,
  load: {
    width: 0,
    margin: () => headerlogo_s.size()/2,
    transition: 1 * 250,
  },
  click: {
    transition: 1 * 100,
  },
  center_right: function(){
    return (win.iW * 0.03) + (this.width()/2) + this.margin();
  }, // // NOTE: change how it works... 3% 0.03
};
