


// Make squares bundle ----------------------------------------------------------------------------------------------------------------
// function Squares() {
// 	// Make squares -----------------------------------------------------------------------------------------------------------------------
// 	this.MakeSquare = function(MS_id, MS_ref, MS_size, MS_href) {
// 		var MS_margin = box.hover_size - MS_size;
// 		var MS_right, MS_bottom, MS_right_h, MS_bottom_h;;
// 		var MS_leave_enable = true;
// 		var MS_animation_speed = (anim_speed_factor * (box.hover_size - MS_size) * (800 / ref_box)) + 'ms';
//
// 		// set margins (artwork on desktop and ipad/ fullscreen squares on iphone)
// 		if (win.min_size.S == true) {
// 			var margins_array = SetMargins(MS_ref, '50%', 0); //------------------------ [F] main_child.js
// 		} else {
// 			var margins_array = SetMargins(MS_ref, box.hover_size, MS_margin); //----------- [F] main_child.js
// 		};
// 		var MS_right = margins_array[0];
// 		var MS_bottom = margins_array[1];
// 		var MS_right_h = margins_array[2];
// 		var MS_bottom_h = margins_array[3];
//
// 		// set square starting size, position and color (animation based on size so acceleration of hover animation is equal)
// 		$(MS_id).css({
// 			'position': 'absolute',
// 			'width': MS_size,
// 			'height': MS_size,
// 			'right': MS_right,
// 			'bottom': MS_bottom,
// 			'background-color': eval('color_' + MS_ref) + '80',
// 			'transition': MS_animation_speed,
// 		});
// 		if (win.min_size.S == true) {
// 			$(MS_id).css({
// 				'background-color': eval('color_' + MS_ref) + '80',
// 			});
// 		};
// 		// if small screen or iphone no hover animation and clicktrough immediately
// 		if (win.min_size.S == true || touch == true) {
// 			$(MS_id).off('mouseenter mouseleave click').on('click', function() {
// 				ClickFunction(MS_id, MS_href, eval('color_' + MS_ref)) //----------------- [F] main_child.js
// 			});
// 		} else {
// 			// MOUSE ENTER
// 			$(MS_id).off('click mouseenter mouseleave').on('mouseenter', function() {
// 				BoxProximityEnable(MS_ref, false) //-------------------------------------- [F] main_child.js
// 				$(this).css({
// 					'width': box.hover_size,
// 					'height': box.hover_size,
// 					'right': MS_right_h,
// 					'bottom': MS_bottom_h,
// 					'background-color': eval('color_' + MS_ref) + 'B0',
// 				}) //actions on end of transisition:
// 				.off('transitionend').one('transitionend', function() {
// 					$(this).css({
// 						'cursor': 'pointer'
// 					}).off('click').on('click', function() {
// 						ClickFunction(MS_id, MS_href) //-------------------------------------- [F] main_child.js
// 					})
// 				})
// 				//$(MS_id + ' h2').css('color',color_back)
// 				// logo animation
// 				// $('#logo').css({
// 				// 	'fill': eval('color_' + MS_ref),
// 				// 	'transition': MS_animation_speed
// 				// })
// 				if (MS_ref == 1) {
// 					C_AnimTrigger(cl, [CL_fill, CL_border],true)
// 				}
//
// 			})
// 			// MOUSE LEAVE
// 			.mouseleave(function() {
// 				BoxProximityEnable(MS_ref, true) //--------------------------------------- [F] main_child.js
// 				$(this).off('click').css({
// 					'width': MS_size,
// 					'height': MS_size,
// 					'right': MS_right,
// 					'bottom': MS_bottom,
// 					'transition': MS_animation_speed,
// 					'cursor': 'initial',
// 					'background-color': eval('color_' + MS_ref) + '80',
// 				}).off('transitionend')
// 				// logo animation
// 				// $('#logo').css({
// 				// 	'fill': '#3E3E3E',
// 				// 	'transition': MS_animation_speed
// 				// });
// 				if (MS_ref == 1) {
// 					C_AnimTrigger(cl, [CL_fill, CL_border],false)
// 				}
// 				//$(MS_id + ' h2').css('color',color_1)
// 			});
// 		};
// 	};
// 	// (#id | number_counter_clockwise_starting_top_left(1-4) | size(width & height) | href_on click | mouse_enable)
// 	this.MakeSquare('#top_left', 1, box[1].size, 'about.html'); //---------------------- [F] main.js
// 	this.MakeSquare('#bottom_left', 2, box[2].size, 'music.html'); //------------------- [F] main.js
// 	this.MakeSquare('#bottom_right', 3, box[3].size, 'video.html'); //------------------ [F] main.js
// 	this.MakeSquare('#top_right', 4, box[4].size, 'shows.html'); //--------------------- [F] main.js
//
// };
//


// Shadow -----------------------------------------------------------------------------------------------------------------------------
// function Shadow() {
// 	if (win.min_size.S == true) {
// 		$('.box').css('box-shadow', '0px 0px 0px rgba(0,0,0,0)')
// 	} else {
// 		$('.box').css('box-shadow', '0px 0px 12px rgba(0,0,0,.35)')
// 	}
// }

// // Make logo --------------------------------------------------------------------------------------------------------------------------
// function MakeLogo(color) {
// 	$('#logo').css({
// 		'position': 'absolute',
// 		'width': logo.size,
// 		'height': logo.size,
// 		//place in absolute center
// 		'transition': 'none',
// 		'margin': 'auto', // fix at work
// 		'position': 'absolute',
// 		'top': 0,
// 		'left': 0,
// 		'bottom': 0,
// 		'right': 0,
// 		//color
// 		'fill': color
// 	});
// };

// Box content formatting -------------------------------------------------------------------------------------------------------------
// function BoxContentFormat() {
// 	//margin class for box content
// 	// $('.top_left_margin').css({'margin': box.title_margin + 'px 0px 0px ' + box.title_margin + 'px'});
// 	// $('.bottom_left_margin').css({'margin': '0px 0px ' + box.title_margin + 'px ' + box.title_margin + 'px'});
// 	// $('.bottom_right_margin').css({'margin': '0px ' + box.title_margin + 'px ' + box.title_margin + 'px 0px'});
// 	// $('.top_right_margin').css({'margin': box.title_margin + 'px ' + box.title_margin + 'px 0px 0px'});
// 	//box title font size
// 	$('h2').css({'font-size': box.font_size + 'px'});
// };

// Ofsets for mouse move interaction --------------------------------------------------------------------------------------------------
// function MouseMoveOfsets() {
// 	ref_box_offset_left_center = ($('#reference_box').offset().left + ($('#reference_box').width() / 2));
// 	ref_box_offset_top_center = ($('#reference_box').offset().top + ($('#reference_box').height() / 2));
// 	box1_offset_left_center = ($('#top_left').offset().left + ($('#top_left').width() / 2));
// 	box1_offset_top_center = ($('#top_left').offset().top + ($('#top_left').height() / 2));
// 	box2_offset_left_center = ($('#bottom_left').offset().left + ($('#bottom_left').width() / 2));
// 	box2_offset_top_center = ($('#bottom_left').offset().top + ($('#bottom_left').height() / 2));
// 	box3_offset_left_center = ($('#bottom_right').offset().left + ($('#bottom_right').width() / 2));
// 	box3_offset_top_center = ($('#bottom_right').offset().top + ($('#bottom_right').height() / 2));
// 	box4_offset_left_center = ($('#top_right').offset().left + ($('#top_right').width() / 2));
// 	box4_offset_top_center = ($('#top_right').offset().top + ($('#top_right').height() / 2));
// 	//Action area (Calculate the area the mouse move has effect on the object)
// 	box_corner_offset = Math.round(box.hover_size * action_area_corner_offset_factor);
// 	proximity_margin = Math.round(box.hover_size * action_area_base_size_factor);
// };

// Actions by mouse move --------------------------------------------------------------------------------------------------------------




// Transition off ---------------------------------------------------------------------------------------------------------------------
// function TransitionOff() {
// 	for (n = 0; n < arguments.length; n++) {
// 		$(arguments[n]).css('transition', 'none');
// 	};
// };
//
// // Transition on ----------------------------------------------------------------------------------------------------------------------
// function TransitionOn() {
// 	for (n = 0; n < arguments.length; n++) {
// 		$(arguments[n]).css('transition', anim_speed_factor * 300 + 'ms');
// 	};
// };

// link_logos -------------------------------------------------------------------------------------------------------------------------
function LinkLogos(LL_color){

	var LLS = {
		logo: {
			width: '33px',
			margin: HL.margin(),
			padding_bottom: win.iW*0.02,
			position: 'static'
		},
		margin_right: win.iW*0.03,
		padding_top: '3%',
		width: 'auto',
		height: 'auto',
		right: function(){return 0},
		top: function(){return 0},
	};

	if (page == true && (win.width.S == true || win.width.M == true || win.width.L == true || (win.min_size.S == true && win.width.XL == true))) {
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
		// LinkLogo('#facebook use', LLS.logo.color, LLS.logo.opacity, LLS.logo.opacity_click, './/links/facebook.html');
		// LinkLogo('#soundcloud use', LLS.logo.color, LLS.logo.opacity, LLS.logo.opacity_click, './/links/soundcloud.html');
		// LinkLogo('#instagram use', LLS.logo.color, LLS.logo.opacity, LLS.logo.opacity_click, './/links/instagram.html');
		// LinkLogo('#mail use', LLS.logo.color, LLS.logo.opacity, LLS.logo.opacity_click, MailTo('hartedmusic@gmail.com','Contact:', '','',''));
	}
};
