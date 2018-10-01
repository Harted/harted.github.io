// Browser and window data ------------------------------------------------------------------------------------------------------------
function getWindowData(){

	this.getUserAgent = function(){
		var userAgent = navigator.userAgent || navigator.vendor || window.opera;
		if (/windows phone/i.test(userAgent)) 																			{return "WindowsPhone";}
		else if (/android/i.test(userAgent)) 																				{return "Android"			;}
		else if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) 						{return "iOS"					;}
		else if (/Chrome/.test(userAgent)) 																					{return "Chrome"			;}
		else if (/Safari/.test(userAgent)) 																					{return "Safari"			;}
		else if (/Firefox/.test(userAgent)) 																				{return "Firefox"			;}
		else {console.log('unknown userAgent: ' + userAgent); return "unknown";};
	};

	this.determineTouch = function(){
		$(window).on('touchstart', function() {
			touch = true; Squares(); //reset square interaction method when feeling a touch :D
			$(this).off('touchstart mousemove');
		});
	};
	this.determineTouch(); //glabal var touch set inside

	dPR = window.devicePixelRatio;
	iW = window.innerWidth;
	iH = window.innerHeight;

	this.minWindowSize = function(){if (iW <= iH) {return iW;} else {return iH;};};

	userAgent = this.getUserAgent();
	iMin = this.minWindowSize();

	scr_size = {
		L: 1026, M: 770, S: 416,	//iPad pro = 1024	| iPad = 768 | iPhone plus = 414 	< SETTING
		wX: false, wL: false, wM: false, wS: false, //width sizer
		sX: false, sL: false, sM: false, sS: false,	//screen size 									NOTE maybe width is enough?
	}

	this.setScrSize = function(size, str){
		if (size < scr_size.S) { scr_size[str+'S'] = true }
		else if (size < scr_size.M) { scr_size[str+'M'] = true }
		else if (size < scr_size.L) { scr_size[str+'L'] = true }
		else { scr_size[str+'X'] = true }
	}

	this.setScrSize(iMin, 's')
	this.setScrSize(iW, 'w')

	console.log(scr_size)

}

// Calculate sizes by ref_box_size (3/2 minimum window size)---------------------------------------------------------------------------
function CalculateSizes() {
	//reference box size and styling
	if (scr_size.sM == true) {
		ref_box_size = Math.round(iMin / (2 + Math.pow(iMin / scr_size.M, 3)) * 2);
		SizesByRefBox(); //--------------------------------------------------------- [F] main_child.js
	} else if (scr_size.sS == true) {
		ref_box_size = '100%';
		SizesByRefBoxMobile(); //--------------------------------------------------- [F] main_child.js
	} else {
		ref_box_size = Math.round(iMin / 3 * 2);
		SizesByRefBox(); //--------------------------------------------------------- [F] main_child.js
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
	if (scr_size.sS == true) {
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
	MakeSquare('#top_left', 1, box1_size, 'about.html'); //---------------------- [F] main.js
	MakeSquare('#bottom_left', 2, box2_size, 'music.html'); //------------------- [F] main.js
	MakeSquare('#bottom_right', 3, box3_size, 'video.html'); //------------------ [F] main.js
	MakeSquare('#top_right', 4, box4_size, 'shows.html'); //--------------------- [F] main.js
};

// Make squares -----------------------------------------------------------------------------------------------------------------------
function MakeSquare(MS_id, MS_ref, MS_size, MS_href) {
	var MS_margin = hover_size - MS_size;
	var MS_right, MS_bottom, MS_right_h, MS_bottom_h;;
	var MS_leave_enable = true;
	var MS_animation_speed = (anim_speed_factor * (hover_size - MS_size) * (800 / ref_box_size)) + 'ms';

	// set margins (artwork on desktop and ipad/ fullscreen squares on iphone)
	if (scr_size.sS == true) {
		var margins_array = SetMargins(MS_ref, '50%', 0); //------------------------ [F] main_child.js
	} else {
		var margins_array = SetMargins(MS_ref, hover_size, MS_margin); //----------- [F] main_child.js
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
	if (scr_size.sS == true) {
		$(MS_id).css({
			'background-color': eval('color_' + MS_ref) + '80',
		});
	};
	// if small screen or iphone no hover animation and clicktrough immediately
	if (scr_size.sS == true || touch == true) {
		$(MS_id).off('mouseenter mouseleave click').on('click', function() {
			ClickFunction(MS_id, MS_href, eval('color_' + MS_ref)) //----------------- [F] main_child.js
		});
	} else {
		// MOUSE ENTER
		$(MS_id).off('click mouseenter mouseleave').on('mouseenter', function() {
			BoxProximityEnable(MS_ref, false) //-------------------------------------- [F] main_child.js
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
					ClickFunction(MS_id, MS_href) //-------------------------------------- [F] main_child.js
				})
			})
			//$(MS_id + ' h2').css('color',color_back)
			// logo animation
			// $('#logo').css({
			// 	'fill': eval('color_' + MS_ref),
			// 	'transition': MS_animation_speed
			// })
			if (MS_ref == 1) {
				ExtAnimTrigger(cl, [CL_fill, CL_border],true)
			}

		})
		// MOUSE LEAVE
		.mouseleave(function() {
			BoxProximityEnable(MS_ref, true) //--------------------------------------- [F] main_child.js
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
			// $('#logo').css({
			// 	'fill': '#3E3E3E',
			// 	'transition': MS_animation_speed
			// });
			if (MS_ref == 1) {
				ExtAnimTrigger(cl, [CL_fill, CL_border],false)
			}
			//$(MS_id + ' h2').css('color',color_1)
		});
	};
};

// Shadow -----------------------------------------------------------------------------------------------------------------------------
function Shadow() {
	if (scr_size.sS == true) {
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
			if (scr_size.sS == false && touch == false) {
				mouse.x = event.clientX; mouse.y = event.clientY;
				//filter double mouse event
				if (mouse.x != mouse.x_old || mouse.y != mouse.y_old) {
					mouse.x_old = mouse.x;	mouse.y_old = mouse.y;
					//MousemoveFunction triggered with
					Proximities(); //------------------------------------------------------- [F] main_child.js
					AffectSquares(); //----------------------------------------------------- [F] main_child.js
					MM_Canvas(cl, 'cl')
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
	if (scr_size.sS == true && scr_size.wX == false) {
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
				return (iW - this.width)/2
			},
			top: function(){
				return (iH - this.width)/2
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
				padding_bottom: iW*0.02,
				position: 'static'
			},
			margin_right: iW*0.03,
			padding_top: '3%',
			width: 'auto',
			height: 'auto',
			right: function(){return 0},
			top: function(){return 0},
		};
	};
	if (page == true && (scr_size.wS == true || scr_size.wM == true || scr_size.wL == true || (scr_size.sS == true && scr_size.wX == true))) {
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

		// LinkLogo() & Mailto () ---------------------------------------------------- [F] main_child.js
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
