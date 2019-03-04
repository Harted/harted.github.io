// VARIABLES -------------------------------------------------------------------
var refbox
var box = {}, logo = {}

// INDEX SET -------------------------------------------------------------------
function indexSet() {

  // FUNCTIONS -------------------------------------------------------------

	let getRefBoxSize = function(sizeBoolArr, settings){
		for(key in sizeBoolArr){
			if (sizeBoolArr[key] == true) {return settings[key]();}
		};
	};

	let getBoxSize = function(refSize, settings){
		var obj = {};
		for (var i = 0; i < settings.length; i++) {
			obj[i] = {}; obj[i].size = refSize * settings[i] || settings[i];
		}; return obj;
	}

  // CALCULATIONS ----------------------------------------------------------

	refbox = getRefBoxSize(win.min_b, refbox_s);

	box = getBoxSize(refbox, box_s[platform].size);
	box.hover_size = refbox / box_s[platform].hover_size
	box.title_margin = refbox * box_s[platform].title_margin
	box.font_size = refbox * box_s[platform].font_size
	box.css = box_s[platform].css

	logo.size = refbox * logo_s[platform].size

}; indexSet();
