// Get user agent ---------------------------------------------------------------------------------------------------------------------
function getUserAgent() {
	var userAgent = navigator.userAgent || navigator.vendor || window.opera;
	console.log (userAgent)

	if (/windows phone/i.test(userAgent)) {
		return "WindowsPhone";
	} else if (/android/i.test(userAgent)) {
		return "Android";
	} else if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) {
		return "iOS";
	} else if (/Chrome/.test(userAgent)) {
		return "Chrome";
	} else if (/Safari/.test(userAgent)) {
		return "Safari";
	} else if (/Firefox/.test(userAgent)) {
		return "Firefox"
	};

	console.log('OTHER userAgent: ' + userAgent)
	return "unknown";
};

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
/*function MakeAlignmentClasses() {
	$('.top_left_align').css({'position': 'absolute'});
	$('.bottom_left_align').css({'position': 'absolute','bottom': '0'});
	$('.bottom_right_align').css({'position': 'absolute','bottom': '0','right': '0'});
	$('.top_right_align').css({'position': 'absolute','right': '0'});
};*/

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
function Responsive() { // this should only work with min_window_size.. make seperate for content containt window width!!!!!!!!!!!!!!!!!!!!!!!
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

	if (window_width < screen_large_size & window_width >= screen_medium_size) {
		width_large = true;
		width_medium = false;
		width_small = false;
	} else if (window_width < screen_medium_size & window_width >= screen_small_size) {
		width_large = false;
		width_medium = true;
		width_small = false;
	} else if (window_width < screen_small_size) {
		width_large = false;
		width_medium = false;
		width_small = true;
	} else {
		width_large = false;
		width_medium = false;
		width_small = false;
	};

	if (width_large == false && width_medium == false && width_small == false){
		width_big = true
	} else {
		width_big = false
	};

};

// Calculate sizes by ref_box_size (3/2 minimum window size)---------------------------------------------------------------------------
function CalculateSizes() {
	//reference box size and styling
	if (screen_medium == true) {
		ref_box_size = Math.round(min_window_size / (2 + Math.pow(min_window_size / screen_medium_size, 3)) * 2);
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

// Art box ----------------------------------------------------------------------------------------------------------------------------
function MakeArtBox() {
	if (screen_small == true) {
		$('#art_box').css({
			'display': 'none'
		})
	} else {
		$('#art_box').css({
			'display' : 'block',
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
		$('#art_box img').css({
			'width': '100%',
			'margin': 'auto',
			'position': 'absolute',
			'top': 0,
			'left': 0,
			'bottom': 0,
			'right': 0,
		})
	};
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
		'background-color': eval('color_' + MS_ref) + '80',
		'transition': MS_animation_speed,
	});
	if (screen_small == true) {
		$(MS_id).css({
			'background-color': eval('color_' + MS_ref) + '80',
		});
	};

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
				'background-color': eval('color_' + MS_ref) + "B0",
			}) //actions on end of transisition:
			.off('transitionend').one('transitionend', function() {
				$(this).css({
					'cursor': 'pointer'
				}).off('click').on('click', function() {
					ClickFunction(MS_id, MS_href) //-------------------------------------- |F| main_child.js
				})
			})
			//$(MS_id + ' h2').css('color',color_back)
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
				'background-color': eval('color_' + MS_ref) + '80',
			}).off('transitionend')
			// logo animation
			$('#logo').css({
				'fill': '#3E3E3E',
				'transition': MS_animation_speed
			});
			//$(MS_id + ' h2').css('color',color_1)
		});
	};
};

// Shadow -----------------------------------------------------------------------------------------------------------------------------
function Shadow() {
	if (screen_small == true) {
		$('.shadow').css('box-shadow', '0px 0px 0px rgba(0,0,0,0)')
	} else {
		$('.shadow').css('box-shadow', '0px 0px 12px rgba(0,0,0,.35)')
	}
}

// Make logo --------------------------------------------------------------------------------------------------------------------------
function MakeLogo(color) {
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
		'fill': color
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
setInterval(function(){mousemove_enable = true},32); //mousemove rate
//setInterval(function(){console.log('---')},1000); DEBUG LOG

function MouseMove() {
	$(window).off('mousemove').on('mousemove', function(event) {
		if (mousemove_enable == true) {
			if (screen_small == false && touch == false) {
				mouse_left = event.clientX;
				mouse_top = event.clientY;
				//filter double mouse event
				if (mouse_left != mouse_left_old || mouse_top != mouse_top_old) {
					var mouse_left_old = mouse_left;
					varmouse_top_old = mouse_top;
					// affect squares with proximity data
					Proximities(); //------------------------------------------------------- |F| main_child.js
					AffectSquares(); //----------------------------------------------------- |F| main_child.js
				};
			};
			//console.log('-') DEBUG LOG
			mousemove_enable = false;
		}
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

// link_logos -------------------------------------------------------------------------------------------------------------------------
function LinkLogos(LL_color){
	if (screen_small == true && width_big == false) {
		var LLS = {
			logo: {
				opacity: 0.25,
				opacity_click: 1,
				color: LL_color,
				width: logo_size/2,
				margin: 0,
				padding_bottom: 0,
				position: 'absolute'
			},
			margin_right: 0,
			padding_top: 0,
			width: logo_size*2,
			height: logo_size*2,
			right: function(){
				return (window_width - this.width)/2
			},
			top: function(){
				return (window_height - this.width)/2
			},
		};
	} else {
		var LLS = {
			logo: {
				opacity: 0.25,
				opacity_click: 1,
				color: LL_color,
				width: HL.width,
				margin: HL.margin(),
				padding_bottom: window_width*0.02,
				position: 'static'
			},
			margin_right: window_width*0.03,
			padding_top: '3%',
			width: 'auto',
			height: 'auto',
			right: function(){return 0},
			top: function(){return 0},
		};
	};
	if (page == true && (width_small == true || width_medium == true || width_large == true || (screen_small == true && width_big == true))) {
		$('#link_logos').css({
			'display': 'none'
		})
	} else {
		$('#link_logos').css({
			'position': 'fixed',
			'width': LLS.width,
			'height': LLS.height,
			'right': LLS.right() + 'px',
			'top': LLS.top() + 'px',
			'padding-top': LLS.padding_top,
			'margin-right': LLS.margin_right,
			'display': 'block'
		});

		$('.link_logo').css({
			'width': LLS.logo.width,
			'height': LLS.logo.width,
			'margin': LLS.logo.margin,
			'padding-bottom': LLS.logo.padding_bottom + 'px',
			'position': LLS.logo.position,
		});

		// LinkLogo() & Mailto () ---------------------------------------------------- |F| main_child.js
		LinkLogo('#facebook use', LLS.logo.color, LLS.logo.opacity, LLS.logo.opacity_click, './/links/facebook.html');
		LinkLogo('#soundcloud use', LLS.logo.color, LLS.logo.opacity, LLS.logo.opacity_click, './/links/soundcloud.html');
		LinkLogo('#instagram use', LLS.logo.color, LLS.logo.opacity, LLS.logo.opacity_click, './/links/instagram.html');
		LinkLogo('#mail use', LLS.logo.color, LLS.logo.opacity, LLS.logo.opacity_click, MailTo('hartedmusic@gmail.com','Contact:', '','',''));
	}
};




// GLOBAL FUNCTIONS -------------------------------------------------------------------------------------------------------------------
function valBetween(v, min, max) {
    return (Math.min(max, Math.max(min, v)));
}

var mem;
function Change(val){
	if (val == mem) {
		return false
	} else {
		mem = val
		return true
	}
}
