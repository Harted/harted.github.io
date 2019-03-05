// COLOR -----------------------------------------------------------------------
// OPTIMIZE: make color object later
var color_1 = "#FFFFFF";
var color_2 = "#FFFFFF";
var color_3 = "#FFFFFF";
var color_4 = "#FFFFFF";
var color_back = "#FFFFFF";

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
    class: "top_right_align",
    margin: "3%",
    display: function display() {
      return page == true &&
        (win.width_b.XL == false ||
          (win.min_b.S == true && win.width_b.XL == true))
        ? "none"
        : "block";
    }
  },
  mobile: {
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
    class: "top_right_align",
    margin: "3%",
    display: function display() {
      return page == true &&
        (win.width_b.XL == false ||
          (win.min_b.S == true && win.width_b.XL == true))
        ? "none"
        : "block";
    }
  }
};
