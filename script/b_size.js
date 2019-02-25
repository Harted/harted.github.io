// CONSTANTS --------------------------------------------------------------------------------------------------------------------------
const ref_box_p = {
	S: 	function(){return '100%';},
	M:  function(){return Math.round(win.iMin * 2 / (2 + Math.pow(win.iMin / win_p.M, 3)));},
	L: 	function(){return Math.round(win.iMin * 2 / 3);},
	XL:	function(){return Math.round(win.iMin * 2 / 3);},
};
const box_p = {
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
}
const logo_p = {
	desktop: {size: 0.15,},
	mobile: {size: 0.30,}
}
// VARIABLES --------------------------------------------------------------------------------------------------------------------------
var ref_box, box = {}, logo = {}

// Calculate sizes --------------------------------------------------------------------------------------------------------------------
function getSize() {
	//Functions
	this.getRefBoxSize = function(reference, properties){
		for(key in reference){
			if (reference[key] == true) {return properties[key]();}
		};
	};
	this.getBoxSize = function(reference, properties){
		var obj = {};
		for (var i = 0; i < properties.length; i++) {
			obj[i+1] = {}; obj[i+1].size = ref_box * properties[i] || properties[i];
		}; return obj;
	}
	//set reference box width
	ref_box = this.getRefBoxSize(win.min_size, ref_box_p);
	//determine platform for sizes
	if (win.min_size.S == true) {var platform = 'mobile'} else {var platform = 'desktop'}
	//populate box object
	box = this.getBoxSize(ref_box, box_p[platform].size)
	box.hover_size = box_p[platform].reference() / box_p[platform].hover_size
	box.title_margin = box_p[platform].reference() * box_p[platform].title_margin
	box.font_size = box_p[platform].reference() * box_p[platform].font_size
	logo.size = box_p[platform].reference() * logo_p[platform].size
}; getSize(); //trigger on launch
