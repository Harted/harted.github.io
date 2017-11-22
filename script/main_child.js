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
	for (n = 0; n < CF_array.length; n++) {
		if (CF_id != CF_array[n]) {
			$(CF_array[n]).css({
				'display': 'none',
			}).off("mouseenter mouseleave");
		} else {
			$(CF_array[n]).off("mouseenter mouseleave transitionend click")
			.css({ 'cursor': 'initial'});
		};
	};
	$("#logo").css({
		//place in absolute center
		"transition": "none",
    "margin": "auto",
    "position": "absolute",
    "top": 0, "left": 0, "bottom": 0, "right": 0
	});
	$("h2").css({
		'display': 'none',
	});
	$(document).off("mousemove");

	setTimeout(function() {
		$("#reference_box").css({
			'transition': "none",
			'width': window_width,
			'height' : window_height,
		});

		var margins_to_header = SetMarginsToHeader(CF_id)
		var top = margins_to_header[0]
		var right = margins_to_header[1]
		var bottom = margins_to_header[2]
		var left = margins_to_header[3]

		$(CF_id).css({
			'transition': (parseInt(CF_animation_speed) * 2) + "ms",
			'right': right,
			'bottom': bottom,
			'left': left,
			'top': top,
		})
		setTimeout(function(){
			$(CF_id).css({
				'width': '100%',
				'height': header_height,
				'top': 0,
				'right': 0,
				'bottom': 0,
				'left': 0
			});
			setTimeout(function(){
				$("#logo").css({
					//place in absolute center
					"transition": CF_animation_speed,
			    "width": 0,
					"height": 0,
				});
				setTimeout(function(){
					window.location = CF_href;
				},parseInt(CF_animation_speed))

			},(parseInt(CF_animation_speed) * 2))
		}, 25);

	});
};
// Set margins before transitioning to header -----------------------------------------------------------------------------------------
function SetMarginsToHeader(SMTH_id) {
	console.log(SMTH_id)
	if (SMTH_id == '#top_left'){
		var ref = 1;
	} else if (SMTH_id == '#bottom_left') {
		var ref = 2;
	} else if (SMTH_id == '#bottom_right') {
		var ref = 3;
	} else if (SMTH_id == '#top_right') {
		var ref = 4;
	};
	console.log(ref)
	if (ref == 1) {
		var top = (window_height / 2 - hover_size) + "px";
		var left = (window_width / 2 - hover_size) + "px";
		var bottom = "50%";
		var right = "50%";
	} else if (ref == 2) {
		var top = "50%";
		var left = (window_width / 2 - hover_size) + "px";
		var bottom = (window_height / 2 - hover_size) + "px";
		var right = "50%";
	} else if (ref == 3) {
		var top = "50%";
		var left = "50%";
		var bottom = (window_height / 2 - hover_size) + "px";
		var right = (window_width / 2 - hover_size) + "px";
	} else if (ref == 4) {
		var top = (window_height / 2 - hover_size) + "px";
		var left = "50%";
		var bottom = "50%";
		var right = (window_width / 2 - hover_size) + "px";
	};
	return [top, right, bottom, left]
};
