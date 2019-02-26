// CONSTANTS --------------------------------------------------------------------------------------------------------------------------
// window settings -------------------------------------------------------------
const win_s  = {
  L: 1026, M: 770, S: 416, // < SETTING based on common screensizes
};

// reference box settings ------------------------------------------------------
const ref_box_s = {
	S: 	function(){return '100%';},
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
   group_name: 'squares',
	html_id: ['#top_left', '#bottom_left', '#bottom_right', '#top_right'],
	link: ['about.html', 'music.html', 'video.html', 'shows.html'],
	actdist: 50,
	desktop: {
		size: [0.36, 0.30, 0.24, 0.18],
		hover_size: 2,
		title_margin: 0.041,
		font_size: 0.033,
		reference: function(){return ref_box;},
	},
	mobile: {
		size: ['50%', '50%', '50%', '50%'],
		hover_size: 2,
		title_margin: 0.08,
		font_size: 0.08,
		reference: function(){return win.iMin;},
	},
  css: {
    click : {
      ref_box: {'width': '100%', 'height': '100%'},
      div: {
        'width': '100%', 'height': '100%',
        'right': 0, 'left': 0, 'top': 0, 'bottom': 0,
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
