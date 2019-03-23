// PAGE ------------------------------------------------------------------------
var page = false; // REFERENCE BOX ---------------------------------------------------------------

var refbox_s = {
  S: function S() {
    return Math.round(win.iMin * 0.92);
  },
  M: function M() {
    return Math.round(win.iMin * 2 / (2 + Math.pow(win.iMin / win_s.M, 3)));
  },
  L: function L() {
    return Math.round(win.iMin * 2 / 3);
  },
  XL: function XL() {
    return Math.round(win.iMin * 2 / 3);
  }
}; // BOX IN REFERENCE BOX --------------------------------------------------------

var box_s = {
  html_id: ['#top_left', '#bottom_left', '#bottom_right', '#top_right'],
  link: ['about.html', 'music.html', 'video.html', 'shows.html'],
  desktop: {
    size: [0.36, 0.30, 0.24, 0.18],
    hover_size: 2,
    title_margin: 0.041,
    font_size: 0.033,
    css: {
      'box-shadow': '0px 0px 12px rgba(0,0,0,0.35)'
    }
  },
  mobile: {
    size: ['50%', '50%', '50%', '50%'],
    hover_size: 2,
    title_margin: 0.08,
    font_size: 0.06,
    css: {
      'box-shadow': '0px 0px 12px rgba(0,0,0,0.25)'
    }
  },
  click: {
    css: {
      refbox: {
        'transition': '500ms',
        'width': '100%',
        'height': '100%'
      },
      div: {
        'width': '100%',
        'height': '100%',
        'right': 0,
        'left': 0,
        'top': 0,
        'bottom': 0,
        'box-shadow': '0px 0px 0px rgba(0,0,0,0)',
        'background-color': '#FFFFFF00'
      },
      h2: {
        'transition': 'none',
        'color': '#FFFFFF00'
      },
      not: {
        div: {
          'transition': 'none',
          'background-color': '#FFFFFF00',
          'box-shadow': '0px 0px 0px rgba(0,0,0,0)'
        },
        h2: {
          'color': '#FFFFFF00'
        }
      }
    }
  } // LOGO IN CENTER --------------------------------------------------------------

};
var logo_s = {
  desktop: {
    size: 0.15
  },
  mobile: {
    size: 0.30
  }
};
