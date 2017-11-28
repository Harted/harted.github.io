// Determine if the user is working on a touch or desktop interface -------------------------------------------------------------------
function DetermineTouch(){
	touch = false;
	$(window).on('touchstart', function() {
	  touch = true;
		Squares(); //on first touch immediat clicktrough
		$(this).off('touchstart mousemove');
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
		SizesByRefBox(); //--------------------------------------------------------- |F| main_child.js
	} else if (screen_small == true) {
		ref_box_size = '100%';
		SizesByRefBoxMobile(); //--------------------------------------------------- |F| main_child.js
	} else {
		ref_box_size = Math.round(min_window_size / 3 * 2);
		SizesByRefBox(); //--------------------------------------------------------- |F| main_child.js
	}
};

// Reference box ----------------------------------------------------------------------------------------------------------------------
function MakeRefBox() {
	$('#reference_box').css({
		'width': ref_box_size,
		'height': ref_box_size,
		//place in absolute center
		'margin': 'auto',
		'position': 'absolute',
		'top': 0,
		'left': 0,
		'bottom': 0,
		'right': 0,
	})
};

// Make squares bundle ----------------------------------------------------------------------------------------------------------------
function Squares() {
	// (#id | number_counter_clockwise_starting_top_left(1-4) | size(width & height) | href_on click | mouse_enable)
	MakeSquare('#top_left', 1, box1_size, 'about.html'); //---------------------- |F| main
	MakeSquare('#bottom_left', 2, box2_size, 'music.html'); //------------------- |F| main
	MakeSquare('#bottom_right', 3, box3_size, 'video.html'); //------------------ |F| main
	MakeSquare('#top_right', 4, box4_size, 'shows.html'); //--------------------- |F| main
};

// Make squares -----------------------------------------------------------------------------------------------------------------------
function MakeSquare(MS_id, MS_ref, MS_size, MS_href) {
	var MS_margin = hover_size - MS_size;
	var MS_right, MS_bottom, MS_right_h, MS_bottom_h;;
	var MS_leave_enable = true;
	var MS_animation_speed = (anim_speed_factor * (hover_size - MS_size) * (800 / ref_box_size)) + 'ms';

	// set margins (artwork on desktop and ipad/ fullscreen squares on iphone)
	if (screen_small == true) {
		var margins_array = SetMargins(MS_ref, '50%', 0); //------------------------ |F| main_child.js
	} else {
		var margins_array = SetMargins(MS_ref, hover_size, MS_margin); //----------- |F| main_child.js
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
		'background-color': eval('color_' + MS_ref),
		'transition': MS_animation_speed
	});

	// if small screen or iphone no hover animation and clicktrough immediately
	if (screen_small == true || touch == true) {
		$(MS_id).off('mouseenter mouseleave click').on('click', function() {
			ClickFunction(MS_id, MS_href, eval('color_' + MS_ref)) //----------------- |F| main_child.js
		});
	} else {
		// MOUSE ENTER
		$(MS_id).off('click mouseenter mouseleave').on('mouseenter', function() {
			BoxProximityEnable(MS_ref, false) //-------------------------------------- |F| main_child.js
			$(this).css({
				'width': hover_size,
				'height': hover_size,
				'right': MS_right_h,
				'bottom': MS_bottom_h,
			}) //actions on end of transisition:
			.off('transitionend').one('transitionend', function() {
				$(this).css({
					'cursor': 'pointer'
				}).off('click').on('click', function() {
					console.log('mouseclick')
					ClickFunction(MS_id, MS_href) //-------------------------------------- |F| main_child.js
				})
			})
			// logo animation
			$('#logo').css({
				'fill': eval('color_' + MS_ref),
				'transition': MS_animation_speed
			})
		})
		// MOUSE LEAVE
		.mouseleave(function() {
			BoxProximityEnable(MS_ref, true) //--------------------------------------- |F| main_child.js
			$(this).off('click').css({
				'width': MS_size,
				'height': MS_size,
				'right': MS_right,
				'bottom': MS_bottom,
				'transition': MS_animation_speed,
				'cursor': 'initial',
			}).off('transitionend')
			// logo animation
			$('#logo').css({
				'fill': color_back,
				'transition': MS_animation_speed
			});
		});
	};
};

// Make logo --------------------------------------------------------------------------------------------------------------------------
function MakeLogo() {
	$('#logo').css({
		'position': 'absolute',
		'width': logo_size,
		'height': logo_size,
		//place in absolute center
		'transition': 'none',
		'margin': 'auto', // fix at work
		'position': 'absolute',
		'top': 0,
		'left': 0,
		'bottom': 0,
		'right': 0,
		//color
		'fill': color_back
	});
};

// Box content formatting -------------------------------------------------------------------------------------------------------------
function BoxContentFormat() {
	//margin class for box content
	$('.top_left_margin').css({'margin': box_title_margin + 'px 0px 0px ' + box_title_margin + 'px'});
	$('.bottom_left_margin').css({'margin': '0px 0px ' + box_title_margin + 'px ' + box_title_margin + 'px'});
	$('.bottom_right_margin').css({'margin': '0px ' + box_title_margin + 'px ' + box_title_margin + 'px 0px'});
	$('.top_right_margin').css({'margin': box_title_margin + 'px ' + box_title_margin + 'px 0px 0px'});
	//box title font size
	$('h2').css({'font-size': box_title_font_size + 'px'});
};

// Ofsets for mouse move interaction --------------------------------------------------------------------------------------------------
function MouseMoveOfsets() {
	ref_box_offset_left_center = ($('#reference_box').offset().left + ($('#reference_box').width() / 2));
	ref_box_offset_top_center = ($('#reference_box').offset().top + ($('#reference_box').height() / 2));
	box1_offset_left_center = ($('#top_left').offset().left + ($('#top_left').width() / 2));
	box1_offset_top_center = ($('#top_left').offset().top + ($('#top_left').height() / 2));
	box2_offset_left_center = ($('#bottom_left').offset().left + ($('#bottom_left').width() / 2));
	box2_offset_top_center = ($('#bottom_left').offset().top + ($('#bottom_left').height() / 2));
	box3_offset_left_center = ($('#bottom_right').offset().left + ($('#bottom_right').width() / 2));
	box3_offset_top_center = ($('#bottom_right').offset().top + ($('#bottom_right').height() / 2));
	box4_offset_left_center = ($('#top_right').offset().left + ($('#top_right').width() / 2));
	box4_offset_top_center = ($('#top_right').offset().top + ($('#top_right').height() / 2));
	//Action area (Calculate the area the mouse move has effect on the object)
	box_corner_offset = Math.round(hover_size * action_area_corner_offset_factor);
	proximity_margin = Math.round(hover_size * action_area_base_size_factor);
};

// Actions by mouse move --------------------------------------------------------------------------------------------------------------
function MouseMove() {
	$(window).off('mousemove').on('mousemove', function() {
		// Mouse move actions on desktop
		if (screen_small == false && touch == false) {
			GetMousePosition(); //---------------------------------------------------- |F| main_child.js
			//filter double mouse event
			if (mouse_left != mouse_left_old || mouse_top != mouse_top_old) {
				var mouse_left_old = mouse_left;
				varmouse_top_old = mouse_top;
				// affect squares with proximity data
				Proximities(); //------------------------------------------------------- |F| main_child.js
				AffectSquares(); //----------------------------------------------------- |F| main_child.js
			};
		};
	});
};

// Transition off ---------------------------------------------------------------------------------------------------------------------
function TransitionOff() {
	for (n = 0; n < arguments.length; n++) {
		$(arguments[n]).css('transition', 'none');
	};
};

// Transition on ----------------------------------------------------------------------------------------------------------------------
function TransitionOn() {
	for (n = 0; n < arguments.length; n++) {
		$(arguments[n]).css('transition', anim_speed_factor * 300 + 'ms');
	};
};
