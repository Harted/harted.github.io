// COLOR -----------------------------------------------------------------------
// OPTIMIZE: make color object later
var color_1 = "#FFFFFF";
var color_2 = "#FFFFFF";
var color_3 = "#FFFFFF";
var color_4 = "#FFFFFF";
var color_back = "#FFFFFF";

// (#[0-F]{8})|(#[0-F]{6})   // NOTE: regex to find colors

// WINDOW ----------------------------------------------------------------------
var win_s = {
  L: 1026,
  M: 770,
  S: 416 // < SETTING based on common screensizes
};

// LINK LOGOS ------------------------------------------------------------------
var linklogo_s = {
  desktop: {
    logo: {
      position: "static",
      size_factor: 2 / 3,
      size: function size() {
        return 50;
      },
      width: function width() {
        return this.size() * this.size_factor;
      },
      height: function height() {
        return this.width();
      },
      margin: function margin() {
        return (this.size() * (1 - this.size_factor)) / 2;
      },
      padding_bottom: function padding_bottom() {
        return win.iW * 0.02;
      }
    },
    position: "fixed",
    alignArray: function alignArray() {
      return [0,"auto","auto",0]
    },
    margin: function margin() {
      return "3%"
    },
    display: function display() {
      return page == true && (win.width_b.XL == false || (win.min_b.S == true && win.width_b.XL == true))
      ? "none"
      : "block";
    },
    width: function width() {
      return 'auto'
    },
  },
  mobile: {
    logo: {
      position: "static",
      size_factor: 5 / 8,
      size: function size() {
        return win.iMin/5;
      },
      width: function width() {
        return this.size() * this.size_factor;
      },
      height: function height() {
        return this.width();
      },
      margin: function margin() {
        return (this.size() * (1 - this.size_factor)) / 2;
      },
      padding_bottom: function padding_bottom() {
        return (win.iMin == win.iH) //check landscape
        ? win.iW * 0.02
        : ((win.iH - win.iW)/2) - this.size();
      }
    },
    position: "fixed",
    alignArray: function alignArray() {
      return (win.iMin == win.iH) //check landscape
      ? [0,"auto","auto",0] // [t,l,b,r]
      : ["auto",0,0,0];
    },
    margin: function margin() {
      return (win.iMin == win.iH) //check landscape
      ? "3%"
      : "auto" //(win.iMin - (linklogo_s.mobile.logo.size() * 4)) / 2;
    },
    display: function display() {
      return (win.iMin == win.iH) //check landscape
      ? "block"
      : "inline-flex";
    },
    width: function width() {
      return (win.iMin == win.iH) //check landscape
      ? "auto"
      : (linklogo_s.mobile.logo.size())*4;
    }
  }
};
