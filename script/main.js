// functions are ordered as to first usage in index.html

// determine if the user is working on a touch or desktop interface -------------------------------------------------------------------
DetermineTouch()
function DetermineTouch(){
	touch = false
	window.addEventListener('touchstart', function() {
	  touch = true
		Squares()
		console.log(touch)
		$(document).off("mousemove")
	});
};

// Make alignment classes for box content ---------------------------------------------------------------------------------------------
function MakeAlignmentClasses() {
	$('.top_left_align').css({'position': 'absolute'});
	$('.bottom_left_align').css({'position': 'absolute','bottom': '0'});
	$('.bottom_right_align').css({'position': 'absolute','bottom': '0','right': '0'});
	$('.top_right_align').css({'position': 'absolute','right': '0'});
};

// Get minimum window size ------------------------------------------------------------------------------------------------------------
function GetMinWindowSize() {
	window_width = $(window).innerWidth();
	window_height = $(window).innerHeight();
	if (window_width <= window_height) {
		min_window_size = window_width;
	} else {
		min_window_size = window_height;
	};
};

// Responsive -------------------------------------------------------------------------------------------------------------------------
function Responsive() {
	if (min_window_size < screen_large_size & min_window_size >= screen_medium_size) {
		screen_large = true;
		screen_medium = false;
		screen_small = false;
	} else if (min_window_size < screen_medium_size & min_window_size >= screen_small_size) {
		screen_large = false;
		screen_medium = true;
		screen_small = false;
	} else if (min_window_size < screen_small_size) {
		screen_large = false;
		screen_medium = false;
		screen_small = true;
	} else {
		screen_large = false;
		screen_medium = false;
		screen_small = false;
	};
};

// Calculate sizes by ref_box_size (3/2 minimum window size)---------------------------------------------------------------------------
function CalculateSizes() {
	//reference box size and styling
	if (screen_large == true || screen_medium == true) {
		ref_box_size = Math.round(min_window_size / (2 + Math.pow(min_window_size / screen_large_size, 3)) * 2);
		SizesByRefBox(); // main_child
	} else if (screen_small == true) {
		ref_box_size = '100%';
		SizesByRefBoxMobile(); //main_child
	} else {
		ref_box_size = Math.round(min_window_size / 3 * 2);
		SizesByRefBox(); //main_child
	}
};

// Reference box ----------------------------------------------------------------------------------------------------------------------
function MakeRefBox() {
	$("#reference_box").css({
		"width": ref_box_size,
		"height": ref_box_size,
		//place in absolute center
		"margin": "auto",
		"position": "absolute",
		"top": 0,
		"left": 0,
		"bottom": 0,
		"right": 0,
	})
};

// Make squares bundle ----------------------------------------------------------------------------------------------------------------
function Squares() {
	// (#id | number_counter_clockwise_starting_top_left(1-4) | size(width & height) | href_on click | mouse_enable)
	MakeSquare("#top_left", 1, box1_size, "about.html"); // main
	MakeSquare("#bottom_left", 2, box2_size, "music.html"); // main
	MakeSquare("#bottom_right", 3, box3_size, "video.html"); // main
	MakeSquare("#top_right", 4, box4_size, "shows.html"); // main
};

// Make squares -----------------------------------------------------------------------------------------------------------------------
function MakeSquare(MS_id, MS_ref, MS_size, MS_href) {

	var MS_margin = hover_size - MS_size;
	var MS_right, MS_bottom, MS_right_h, MS_bottom_h;
	var MS_leave_enable = true;
	var MS_animation_speed = (anim_speed_factor * (hover_size - MS_size) * (800 / ref_box_size)) + "ms";

	// set margins
	if (screen_small == true) {
		var margins_array = SetMargins(MS_ref, '50%', 0); // main_child
	} else {
		var margins_array = SetMargins(MS_ref, hover_size, MS_margin); // main_child
	};
	var MS_right = margins_array[0];
	var MS_bottom = margins_array[1];
	var MS_right_h = margins_array[2];
	var MS_bottom_h = margins_array[3];

	// set square starting size, position and color (animation based on size so acceleration of hover animation is equal)
	$(MS_id).css({
		'position': 'absolute',
		'width': MS_size,
		'height': MS_size,
		'right': MS_right,
		'bottom': MS_bottom,
		'background-color': eval("color_" + MS_ref),
		'transition': MS_animation_speed
	});

	// if small screen or iphone no hover animation and clicktrough
	if (screen_small == true || touch == true) {
		console.log('touchinterface')

		$(MS_id).off("mouseenter mouseleave click").click(function() {
			ClickFunction(MS_id, MS_href, eval("color_" + MS_ref))
			console.log("mobiletap")
		});
	} else {
		console.log('desktop')
		// MOUSE ENTER
		$(MS_id).off("click mouseenter mouseleave").on("mouseenter", function() {
			BoxProximityEnable(MS_ref, false)
			$(this).css({
				'width': hover_size,
				'height': hover_size,
				'right': MS_right_h,
				'bottom': MS_bottom_h,
			}) //actions on end of transisition:
			.off('transitionend').one("transitionend", function() {
				$(this).css({
					"cursor": "pointer"
				}).off("click").click(function() {
					console.log("mouseclick")
					ClickFunction(MS_id, MS_href)
					//window.location = MS_href
				})
			})
			// logo animation
			$("#logo").css({
				"fill": eval("color_" + MS_ref),
				'transition': MS_animation_speed
			})
		})
		// MOUSE LEAVE
		.mouseleave(function() {
			BoxProximityEnable(MS_ref, true)
			$(this).off("click").css({
				'width': MS_size,
				'height': MS_size,
				'right': MS_right,
				'bottom': MS_bottom,
				'transition': MS_animation_speed,
				"cursor": "initial",
			}).off('transitionend')
			// logo animation
			$("#logo").css({
				"fill": color_back,
				'transition': MS_animation_speed
			});
		});
	};
};
// Make logo --------------------------------------------------------------------------------------------------------------------------
function MakeLogo() { //hier moet not bottom right bij.. van small naar big transistion heeft ie die nodig
	if (screen_small != true) {
		$("#logo").css({
			"width": logo_size,
			"height": logo_size,
			"position": "absolute",
			"top": logo_ref_center,
			"left": logo_ref_center,
			"bottom": logo_ref_center,
			"right": logo_ref_center,
			"fill": color_back
		});
	} else {
		$("#logo").css({
			"width": logo_size,
			"height": logo_size,
			"position": "absolute",
			//place in absolute center
			"transition": "none",
			"margin": "auto",
			"position": "absolute",
			"top": 0,
			"left": 0,
			"bottom": 0,
			"right": 0,
			"fill": color_back
		});
	}
};
// Box content formatting -------------------------------------------------------------------------------------------------------------
function BoxContentFormat() {
	//margin class for box content
	$('.top_left_margin').css({
		'margin': box_title_margin + 'px 0px 0px ' + box_title_margin + 'px'
	});
	$('.bottom_left_margin').css({
		'margin': '0px 0px ' + box_title_margin + 'px ' + box_title_margin + 'px'
	});
	$('.bottom_right_margin').css({
		'margin': '0px ' + box_title_margin + 'px ' + box_title_margin + 'px 0px'
	});
	$('.top_right_margin').css({
		'margin': box_title_margin + 'px ' + box_title_margin + 'px 0px 0px'
	});
	//box title font size
	$('h2').css({
		'font-size': box_title_font_size + 'px'
	});
};
// Ofsets for mouse move interaction --------------------------------------------------------------------------------------------------
function MouseMoveOfsets() {
	ref_box_offset_left_center = ($("#reference_box").offset().left + ($("#reference_box").width() / 2));
	ref_box_offset_top_center = ($("#reference_box").offset().top + ($("#reference_box").height() / 2));
	box1_offset_left_center = ($("#top_left").offset().left + ($("#top_left").width() / 2));
	box1_offset_top_center = ($("#top_left").offset().top + ($("#top_left").height() / 2));
	box2_offset_left_center = ($("#bottom_left").offset().left + ($("#bottom_left").width() / 2));
	box2_offset_top_center = ($("#bottom_left").offset().top + ($("#bottom_left").height() / 2));
	box3_offset_left_center = ($("#bottom_right").offset().left + ($("#bottom_right").width() / 2));
	box3_offset_top_center = ($("#bottom_right").offset().top + ($("#bottom_right").height() / 2));
	box4_offset_left_center = ($("#top_right").offset().left + ($("#top_right").width() / 2));
	box4_offset_top_center = ($("#top_right").offset().top + ($("#top_right").height() / 2));
	//Action area (Calculate the area the mouse move has effect on the object)
	box_corner_offset = Math.round(hover_size * action_area_corner_offset_factor);
	proximity_margin = Math.round(hover_size * action_area_base_size_factor);
};

// Transition off ---------------------------------------------------------------------------------------------------------------------
function TransitionOff() {
	for (n = 0; n < arguments.length; n++) {
		$(arguments[n]).css("transition", "none");
	};
};

// Transition on ----------------------------------------------------------------------------------------------------------------------
function TransitionOn() {
	for (n = 0; n < arguments.length; n++) {
		$(arguments[n]).css("transition", '300ms');
	};
};

// Actions by mouse move --------------------------------------------------------------------------------------------------------------
function MouseMove() {
	$(document).off('mousemove').on('mousemove', function() {
		// Mouse move actions when cursor
		if (screen_small == false && touch == false) {
			GetMousePosition()
			//filter double mouse event
			if (mouse_left != mouse_left_old || mouse_top != mouse_top_old) {
				var mouse_left_old = mouse_left;
				varmouse_top_old = mouse_top;
				// affect squares whit proximity data
				Proximities()
				AffectSquares()
			};
		};
	});
};

// Affect squares bundle ----------------------------------------------------------------------------------------------------------------
function AffectSquares() {
	AffectSquare("#top_left", 1, box1_proximity_size);
	AffectSquare("#bottom_left", 2, box2_proximity_size);
	AffectSquare("#bottom_right", 3, box3_proximity_size);
	AffectSquare("#top_right", 4, box4_proximity_size);
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
	if (eval("BoxProximity_" + BP_ref + "_enable") == true) {
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
