// CONSTANTS --------------------------------------------------------------------------------------------------------------------------

// VARIABLES --------------------------------------------------------------------------------------------------------------------------
var ref_box, box = {}, logo = {}

// Calculate sizes --------------------------------------------------------------------------------------------------------------------
function getSize() {

	//Functions
	this.getRefBoxSize = function(reference, settings){
		for(key in reference){
			if (reference[key] == true) {return settings[key]();}
		};
	};

	this.getBoxSize = function(reference, settings){
		var obj = {};
		for (var i = 0; i < settings.length; i++) {
			obj[i] = {}; obj[i].size = ref_box * settings[i] || settings[i];
		}; return obj;
	}

	//set reference box width
	ref_box = this.getRefBoxSize(win.min_size, ref_box_s);

	//determine platform for sizes
	if (win.min_size.S == true) {var platform = 'mobile'} else {var platform = 'desktop'}

	//populate box object
	box = this.getBoxSize(ref_box, box_s[platform].size)
	box.hover_size = box_s[platform].reference() / box_s[platform].hover_size
	box.title_margin = box_s[platform].reference() * box_s[platform].title_margin
	box.font_size = box_s[platform].reference() * box_s[platform].font_size
	logo.size = box_s[platform].reference() * logo_s[platform].size

}; getSize(); //trigger on launch
