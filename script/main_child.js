// Sizes by reference box
function SizesByRefBox() {
	box1_size = Math.round(ref_box_size * 0.36); //220;
	box2_size = Math.round(ref_box_size * 0.3); //180;
	box3_size = Math.round(ref_box_size * 0.24); //140;
	box4_size = Math.round(ref_box_size * 0.18); //100;
	hover_size = Math.round(ref_box_size / 2); // Make hover_size an argument in MakeSquare.. only local variables in functions for easy editing!!!!
	box_title_margin = Math.round(ref_box_size * 0.041); //25;
	box_title_font_size = Math.round(ref_box_size * 0.033); //20;
	//logo sizes
	logo_size = Math.round(ref_box_size * 0.15); //80;
	logo_ref_center = Math.round(hover_size - (logo_size / 2));
};

// Sizes on mobile
function SizesByRefBoxMobile() {
	box1_size = "50%"; //220;
	box2_size = "50%"; //180;
	box3_size = "50%"; //140;
	box4_size = "50%"; //100;
	hover_size = Math.round(min_window_size / 2); // Make hover_size an argument in MakeSquare.. only local variables in functions for easy editing!!!!
	box_title_margin = Math.round(min_window_size * 0.08); //25;
	box_title_font_size = Math.round(min_window_size * 0.08); //20;
	//logo sizes
	logo_size = Math.round(min_window_size * 0.30); //80;
};

// Set margins of squars based on position --------------------------------------------------------------------------------------------
function SetMargins(ref, SM_common_margin, SM_margin) {
	if (ref == 1) {
		var right = SM_common_margin;
		var bottom = SM_common_margin;
		var right_h = SM_common_margin;
		var bottom_h = SM_common_margin;
	} else if (ref == 2) {
		var right = SM_common_margin
		var bottom = SM_margin
		var right_h = SM_common_margin;
		var bottom_h = 0;
	} else if (ref == 3) {
		var right = SM_margin
		var bottom = SM_margin
		var right_h = 0;
		var bottom_h = 0;
	} else if (ref == 4) {
		var right = SM_margin
		var bottom = SM_common_margin
		var right_h = 0;
		var bottom_h = SM_common_margin;
	};
	return [right, bottom, right_h, bottom_h];
};


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


//Function when a box is clicked after transition -------------------------------------------------------------------------------------
function ClickFunction(CF_id, CF_href, CF_logo_color) {
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
			$(CF_array[n]).off("mouseenter mouseleave transitionend click").css({
				'cursor': 'initial'
			});
		};
	};
	if (screen_small != true) {
		$("#logo").css({
			//place in absolute center
			"transition": "none",
			"margin": 'auto',
			"position": "absolute",
			"top": 0,
			"left": 0,
			"bottom": 0,
			"right": 0
		});
		$("#reference_box").css({
			'transition': "none",
			'width': window_width,
			'height': window_height,
			//'margin': "0px",
		});
		var margins_to_header = SetMarginsToHeader(CF_id)
		var top = margins_to_header[0]
		var right = margins_to_header[1]
		var bottom = margins_to_header[2]
		var left = margins_to_header[3]
		$(CF_id).css({
			'right': right,
			'bottom': bottom,
			'left': left,
			'top': top,
		})
		$(document).off("mousemove");
	} else {
		$("#logo").css({
			"transition": 400 * anim_speed_factor + "ms",
			"fill": CF_logo_color,
		});
	}
	$("h2").css({
		//'display': 'none',
		'opacity': 0,
		'transition': 200 * anim_speed_factor + "ms",
	});
	setTimeout(function() {
		$(CF_id).css({
			'transition': 400 * anim_speed_factor + "ms",
			'width': '100%',
			'height': header_height,
			'position':'fixed',
			'top': 'auto',
			'right': 0,
			'bottom': 0,
		});
if (screen_small != true){
		$(CF_id).css({
			'left': 0,
		});
}
		setTimeout(function() {
			$("#logo").css({
				"transition": 200 * anim_speed_factor + "ms",
				"width": 0,
				"height": 0,
			});
			setTimeout(function() {
				window.location = CF_href;
			}, 400 * anim_speed_factor)
		}, 400 * anim_speed_factor)
	}, 200);
};

// Get mouse position -----------------------------------------------------------------------------------------------------------------
function GetMousePosition() {
	mouse_left = event.pageX;
	mouse_top = event.pageY;
};

// Set margins before transitioning to header -----------------------------------------------------------------------------------------
function SetMarginsToHeader(SMTH_id) {
	if (SMTH_id == '#top_left') {
		var top = (window_height / 2 - hover_size) + "px";
		var left = (window_width / 2 - hover_size) + "px";
		var bottom = "50%";
		var right = "50%";
	} else if (SMTH_id == '#bottom_left') {
		var top = "50%";
		var left = (window_width / 2 - hover_size) + "px";
		var bottom = (window_height / 2 - hover_size) + "px";
		var right = "50%";
	} else if (SMTH_id == '#bottom_right') {
		var top = "50%";
		var left = "50%";
		var bottom = (window_height / 2 - hover_size) + "px";
		var right = (window_width / 2 - hover_size) + "px";
	} else if (SMTH_id == '#top_right') {
		var top = (window_height / 2 - hover_size) + "px";
		var left = "50%";
		var bottom = "50%";
		var right = (window_width / 2 - hover_size) + "px";
	};
	return [top, right, bottom, left]
};
