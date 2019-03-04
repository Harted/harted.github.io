// COLOR -----------------------------------------------------------------------
// OPTIMIZE: make color object later
const color_1 = '#FFFFFF';//'#3E3E3E'
const color_2 = '#FFFFFF';//'#238482';
const color_3 = '#FFFFFF';//'#3BDB83';
const color_4 = '#FFFFFF';//'#F4C700';
const color_back = '#FFFFFF';

// WINDOW ----------------------------------------------------------------------
const win_s  = {
  L: 1026, M: 770, S: 416, // < SETTING based on common screensizes
};

// LINK LOGOS ------------------------------------------------------------------
const linklogo_s = {
  desktop: {
    logo: {
      position: 'static',
      size: () => 50,
      size_factor: 2/3,
      width: function() {return this.size() * this.size_factor},
      height: function() {return this.width()},
      margin: function() {return this.size() * (1 - this.size_factor) / 2},
      padding_bottom: () => win.iW * 0.02,
    },
    position: 'fixed',
    class: 'top_right_align',
    margin: '3%',
    display: () => (page == true
      && (win.width_b.XL == false ||
      (win.min_b.S == true && win.width_b.XL == true))) ?
      'none':
      'block',
  },
  mobile: {
    logo: {
      position: 'static',
      size: () => 50,
      size_factor: 2/3,
      width: function() {return this.size() * this.size_factor},
      height: function() {return this.width()},
      margin: function() {return this.size() * (1 - this.size_factor) / 2},
      padding_bottom: () => win.iW * 0.02,
    },
    position: 'fixed',
    class: 'top_right_align',
    margin: '3%',
    display: () => (page == true
      && (win.width_b.XL == false ||
      (win.min_b.S == true && win.width_b.XL == true))) ?
      'none':
      'block',
  },
}
