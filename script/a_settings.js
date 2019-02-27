// CONSTANTS --------------------------------------------------------------------------------------------------------------------------
// window settings -------------------------------------------------------------
const win_s  = {
  L: 1026, M: 770, S: 416, // < SETTING based on common screensizes
};

// reference box settings ------------------------------------------------------
const ref_box_s = {
	S: 	function(){return Math.round(win.iMin * 0.92);},
	M:  function(){return Math.round(win.iMin * 2 / (2 + Math.pow(win.iMin / win_s.M, 3)));},
	L: 	function(){return Math.round(win.iMin * 2 / 3);},
	XL:	function(){return Math.round(win.iMin * 2 / 3);},
};

// logo settings ---------------------------------------------------------------
const logo_s = {
	desktop: {size: 0.15,},
	mobile: {size: 0.30,}
}

// box settings ----------------------------------------------------------------
const box_s = {
  group: 'squares',
	html_id: ['#top_left', '#bottom_left', '#bottom_right', '#top_right'],
	link: ['about.html', 'music.html', 'video.html', 'shows.html'],
	actdist: 50,
	desktop: {
		size: [0.36, 0.30, 0.24, 0.18],
		hover_size: 2,
		title_margin: 0.041,
		font_size: 0.033,
		reference: function(){return ref_box;},
    css: {
      'box-shadow': '0px 0px 12px rgba(0,0,0,0.35)',
    },
	},
	mobile: {
		size: ['50%', '50%', '50%', '50%'],
		hover_size: 2,
		title_margin: 0.08,
		font_size: 0.06,
		reference: function(){return ref_box;},
    css: {
      'box-shadow': '0px 0px 0px rgba(0,0,0,0)',
    },
	},
  css: {
    click : {
      ref_box: {'width': '100%', 'height': '100%', /*'top': 'auto'*/},
      div: {
        'width': '100%', 'height': '100%',
        'right': 0, 'left': 0, 'top': 0, 'bottom': 0,
        'box-shadow': '0px 0px 0px rgba(0,0,0,0)',
        'background-color': '#FFFFFF00',
      },
      h2: {'transition':'none', 'color' : '#FFFFFF00'},
      not: {
        div: {
          'transition': 'none',
          'background-color': '#FFFFFF00',
          'box-shadow': '0px 0px 0px rgba(0,0,0,0)',
        },
        h2: {'color' : '#FFFFFF00',},
      },
    },
  },
}

// link logo settings
const linklogo_s = {
  group: 'linklogos',
  mobile: {
    portrait: {

    },
    landscape: {

    },
  },
  desktop: {
    logo: {
      size: '50px', // width: 2/3, margin: 1/3
			// width: '33px',
			// margin: '17px',
			padding_bottom: 0.02, //*winIW
			position: 'static'
		},
		margin_right: 0.03, //*win.IW
		padding_top: '3%',
		width: 'auto',
		height: 'auto',
		right: function(){return 0},
		top: function(){return 0},
  }
}
