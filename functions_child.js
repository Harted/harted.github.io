// Box proximity enable ---------------------------------------------------------------------------------------------------------------
function BoxProximityEnable(ref, Bool) {
	if (ref == 1) {
		BoxProximity_1_enable = Bool;
	} else if (ref == 2) {
		BoxProximity_2_enable = Bool;
	} else if (ref == 3) {
		BoxProximity_3_enable = Bool;
	} else if (ref == 4) {
		BoxProximity_4_enable = Bool;
	};
};
// Set margins of squars based on position --------------------------------------------------------------------------------------------
function SetMargins(ref, SM_hover_size, SM_margin) {
	if (ref == 1) {
		var right = SM_hover_size;
		var bottom = SM_hover_size;
		var right_h = SM_hover_size;
		var bottom_h = SM_hover_size;
	} else if (ref == 2) {
		var right = SM_hover_size
		var bottom = SM_margin
		var right_h = SM_hover_size;
		var bottom_h = 0;
	} else if (ref == 3) {
		var right = SM_margin
		var bottom = SM_margin
		var right_h = 0;
		var bottom_h = 0;
	} else if (ref == 4) {
		var right = SM_margin
		var bottom = SM_hover_size
		var right_h = 0;
		var bottom_h = SM_hover_size;
	}
	return [right, bottom, right_h, bottom_h]
}
//Function when a box is clicked after transition -------------------------------------------------------------------------------------
function ClickFunction(CF_id, CF_href, CF_animation_speed) {
	var CF_array = [];
	$("#reference_box > div").each(function() {
		CF_array[CF_array.length] = "#" + $(this).attr('id');
	});
	console.log(CF_array);
	for (n = 0; n < CF_array.length; n++) {
		if (CF_id != CF_array[n]) {
			console.log(CF_array[n]);
			$(CF_array[n]).css({
				'opacity': 0,
			});
		} else {
			console.log("deze geklikt: " + CF_array[n]);
		};
	};
	$("#logo").css({
		'opacity': 0,
	});
	$("h2").css({
		'opacity': 0,
		'transition': "1000ms",
	});	
	setInterval(function() {
		$("#reference_box").css({
			'transition': "1000ms",
			'width': '100%',
			'height' : '100%',
		});
		$(CF_id).css({
			'transition': "1000ms",
			'width': '100%',
			'height': '80px',
			'right': 0,
			'top': 0,
		})
	}, 100);
	return false
}