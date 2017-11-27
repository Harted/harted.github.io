// Sizes by reference box
function SizesByRefBox() {
	box1_size = /*Math.round*/(ref_box_size * 0.36); //220;
	box2_size = /*Math.round*/(ref_box_size * 0.3); //180;
	box3_size = /*Math.round*/(ref_box_size * 0.24); //140;
	box4_size = /*Math.round*/(ref_box_size * 0.18); //100;
	hover_size = /*Math.round*/(ref_box_size / 2); // Make hover_size an argument in MakeSquare.. only local variables in functions for easy editing!!!!
	box_title_margin = /*Math.round*/(ref_box_size * 0.041); //25;
	box_title_font_size = /*Math.round*/(ref_box_size * 0.033); //20;
	//logo sizes
	logo_size = /*Math.round*/(ref_box_size * 0.15); //80;
	logo_ref_center = /*Math.round*/(hover_size - (logo_size / 2));
};

// Sizes on mobile
function SizesByRefBoxMobile() {
	box1_size = '50%'; //220;
	box2_size = '50%'; //180;
	box3_size = '50%'; //140;
	box4_size = '50%'; //100;
	hover_size = /*Math.round*/(min_window_size / 2); // Make hover_size an argument in MakeSquare.. only local variables in functions for easy editing!!!!
	box_title_margin = /*Math.round*/(min_window_size * 0.08); //25;
	box_title_font_size = /*Math.round*/(min_window_size * 0.08); //20;
	//logo sizes
	logo_size = /*Math.round*/(min_window_size * 0.30); //80;
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
	$(window).off('resize mousemove touchstart');
	var CF_array = [];
	$('#reference_box > div').each(function() {
		CF_array[CF_array.length] = '#' + $(this).attr('id');
	});
	for (n = 0; n < CF_array.length; n++) {
		if (CF_id != CF_array[n]) {
			$(CF_array[n]).css({
				'display': 'none',
			}).off('mouseenter mouseleave');
		} else {
			$(CF_array[n]).off('mouseenter mouseleave transitionend click').css({
				'cursor': 'initial'
			});
		};
	};

	$('#logo').css({
		//place in absolute center
		'transition': 'none',
		'margin': 'auto',
		'position': 'absolute',
		'top': 0,
		'left': 0,
		'bottom': 0,
		'right': 0
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
	$('#reference_box').css({
		'transition': 'none',
		'width': window_width,
		'height': window_height,
		'top': 0,
		'left': 0,
		'bottom': 0,
		'right': 0
		//'margin': '0px',
	});


	$('#logo').css({
		'transition': 300 * anim_speed_factor + 'ms',
		'fill': CF_logo_color,
	});


	$('h2').css({
		//'display': 'none',
		'opacity': 0,
		'transition': 300 * anim_speed_factor + 'ms',
	});
	setTimeout(function() {
		$(CF_id).css({
			'transition': 300 * anim_speed_factor + 'ms',
			'width': '100%',
			'height': header_height,
			'position':'fixed',
			'margin': 0,
			'top': 'auto',
			'right': 0,
			'bottom': 0,
			'left': 0,
		});
		setTimeout(function() {
			$('#logo').css({
				'transition': 200 * anim_speed_factor + 'ms',
				'width': 0,
				'height': 0,
			});
			setTimeout(function() {
				//window.location = CF_href;
			}, 300 * anim_speed_factor)
		}, 300 * anim_speed_factor)
	}, 000);
};

// Get mouse position -----------------------------------------------------------------------------------------------------------------
function GetMousePosition() {
	mouse_left = event.pageX;
	mouse_top = event.pageY;
};

// Set margins before transitioning to header -----------------------------------------------------------------------------------------
function SetMarginsToHeader(SMTH_id) {

	var offset_top = $(SMTH_id).offset().top;
	var offset_left = $(SMTH_id).offset().left;
	var height = parseFloat($(SMTH_id).css('height'));
	var width = parseFloat($(SMTH_id).css('width'));

	console.log(offset_top + ' - ' + offset_left + ' - ' +width + ' - ' +height)

		var top = offset_top + 'px';
		var left = offset_left + 'px';
		var bottom = (window_height - offset_top - height) + 'px';
		var right = (window_width - offset_left - width); + 'px'

	return [top, right, bottom, left]
};

// Affect squares bundle ----------------------------------------------------------------------------------------------------------------
function AffectSquares() {
	AffectSquare('#top_left', 1, box1_proximity_size);
	AffectSquare('#bottom_left', 2, box2_proximity_size);
	AffectSquare('#bottom_right', 3, box3_proximity_size);
	AffectSquare('#top_right', 4, box4_proximity_size);
}
// Affect squares -----------------------------------------------------------------------------------------------------------------------
function AffectSquare(AS_id, AS_ref, AS_size) {
	var AS_margin = hover_size - AS_size;
	var AS_right, AS_bottom;
	var margins_array = SetMargins(AS_ref, hover_size, AS_margin);
	AS_right = margins_array[0];
	AS_bottom = margins_array[1];
	$(AS_id).css({
		'width': AS_size,
		'height': AS_size,
		'right': AS_right,
		'bottom': AS_bottom,
	})
};
// Create offset to corner farthest from the center of the reference box ----------------------------------------------------------------
function Proximities() {
	box1_proximity = BoxProximity(1, box1_offset_top_center - box_corner_offset, box1_offset_left_center - box_corner_offset, proximity_margin);
	box2_proximity = BoxProximity(2, box2_offset_top_center + box_corner_offset, box2_offset_left_center - box_corner_offset, proximity_margin);
	box3_proximity = BoxProximity(3, box3_offset_top_center + box_corner_offset, box3_offset_left_center + box_corner_offset, proximity_margin);
	box4_proximity = BoxProximity(4, box4_offset_top_center - box_corner_offset, box4_offset_left_center + box_corner_offset, proximity_margin);
	box1_proximity_size = box1_size + (hover_size / 2 * box1_proximity)
	box2_proximity_size = box2_size + (hover_size / 2 * box2_proximity)
	box3_proximity_size = box3_size + (hover_size / 2 * box3_proximity)
	box4_proximity_size = box4_size + (hover_size / 2 * box4_proximity)
}
// Calculate proximities - when cursor is getting closer to the ofsettet point things get funny -----------------------------------------
function BoxProximity(BP_ref, BP_offset_top_center, BP_offset_left_center, BP_proximity_box_size) {
	if (eval('BoxProximity_' + BP_ref + '_enable') == true) {
		//value vert. & hor. from center of window (0: center / >0: out of center)
		var mouse_vertical_from_center = Math.abs(mouse_top - BP_offset_top_center);
		var mouse_horizontal_from_center = Math.abs(mouse_left - BP_offset_left_center);
		var pos_neg_vertical = parseFloat(-(mouse_top - BP_offset_top_center) / mouse_vertical_from_center) || 1;
		var pos_neg_horizontal = parseFloat(-(mouse_left - BP_offset_left_center) / mouse_horizontal_from_center) || 1;
		//value to center = half min_window_size, value at border of virtual minimum window size square = 0
		var to_center_vertical_raw = (mouse_vertical_from_center - (BP_proximity_box_size / 2));
		var to_center_vertical
		if (to_center_vertical_raw <= 0) {
			to_center_vertical = Math.abs(to_center_vertical_raw);
		} else {
			to_center_vertical = 0
		}
		var to_center_horizontal_raw = (mouse_horizontal_from_center - (BP_proximity_box_size / 2));
		var to_center_horizontal;
		if (to_center_horizontal_raw <= 0) {
			to_center_horizontal = Math.abs(to_center_horizontal_raw);
		} else {
			to_center_horizontal = 0;
		}
		var to_center_vertical_uni = pos_neg_vertical * Math.round(10000 * (to_center_vertical / (BP_proximity_box_size / 2))) / 10000;
		var to_center_horizontal_uni = pos_neg_horizontal * Math.round(10000 * (to_center_horizontal / (BP_proximity_box_size / 2))) / 10000;
		return Math.abs(to_center_vertical_uni * to_center_horizontal_uni)
	}
};
