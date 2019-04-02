// PAGE ------------------------------------------------------------------------
var page = false;

// REFERENCE BOX ---------------------------------------------------------------

var refbox_s = {
  S: function S() {
    return Math.round(win.iMin * 0.82);
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
};

// BOX IN REFERENCE BOX --------------------------------------------------------

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
      'box-shadow': '0px 0px 24px rgba(0,0,0,0.25)'
    }
  },
  click_trans_time: 500,
  click: {
    css: {
      refbox: {
        'transition': function(){return box_s.click_trans_time + 'ms'},
        'width': '100%',
        'height': '100%'
      },
      div_trans: {
        'transition': function(){return box_s.click_trans_time + 'ms'},
      },
      div_align: {
        0: {
          'bottom': 0,
          'right': 0,
        },
        1: {
          'top': 0,
          'right': 0,
        },
        2: {
          'top': 0,
          'left': 0,
        } ,
        3: {
          'bottom': 0,
          'left': 0,
        },
      },
      div_endpos: {
        'width': '100%',
        'height': '100%',
        'box-shadow': '0px 0px 0px rgba(0,0,0,0)',
        'background-color': '#FFFFFF00'
      },
      h2: {
        'color': '#FFFFFF00'
      },
    }
  },
  noclick: {
    css: {
      div: {
        'transition': 'none',
        'background-color': '#FFFFFF00',
        'box-shadow': '0px 0px 0px rgba(0,0,0,0)'
      },
      h2: {
        'color': '#FFFFFF00'
      }
    },
  },
};

// LOGO IN CENTER --------------------------------------------------------------

var logo_s = {
  desktop: {
    size: 0.15
  },
  mobile: {
    size: 0.35
  },
  click: {
    css: {
      'transition':'250ms',
      'width':0 ,
      'height':0 ,
    },
  },
};

// ART IN CENTER ---------------------------------------------------------------

var art_s = {
  desktop: {
    css: {
      'visibility':'visible',
      'padding-left':'0',
    },
  },
  mobile: {
    css: {
      'visibility':'visible',
      'padding-left':'5%',
    },
  },
  click: {
    css: {
      'transition': '100ms',
      'opacity': 0,
    },
  },
}
