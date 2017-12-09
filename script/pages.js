// Make header ------------------------------------------------------------------------------------------------------------------------
function Header(color) {
	$('#header').css({
		'position': 'fixed',
		'width': '100%',
		'height': header_height,
		'line-height': header_height + 'px',
		'bottom': 0,
		'background-color': color,
	})
	$('#header_whitespace').css({
		'width': '100%',
		'height': header_height * 2,
	})
	$('#header_forcescrollspace').css({
		'position': 'fixed',
		'width': window_width*3,
		'left': -(window_width),
		'height': window_height,
		'bottom': -(window_height) + header_height,
		'background-color': color,
	})
};
// Make headerlogo --------------------------------------------------------------------------------------------------------------------
function HeaderLogo(color) {

	HL = {
		color: color_back,
		width: header_height/3*2,
		margin: header_height/6,
		right: window_width*0.03,
		bottom: 0,
		load: {
			width: 0,
			margin: header_height/2,
			transition: anim_speed_factor * 250,
		},
		click: {
			transition: anim_speed_factor * 100,
		},
		center_right: function(){
			return this.right + (this.width/2) + this.margin;
		},
	};

	$('#headerlogo').css({
		'position': 'absolute',
		'width': HL.load.width,
		'height': HL.load.width,
		'margin': HL.load.margin,
		'fill': HL.color,
		'right': HL.right,
		'bottom': HL.bottom,
	})
	$('#header_menu').css({
		'opacity': 0,
	})
	setTimeout(function(){
		$('#header_menu').css({
			'opacity': 1,
			'transition': HL.load.transition + 'ms',
		})
		$('#headerlogo').css({
			'height': HL.width,
			'width': HL.width,
			'margin': HL.margin,
			'transition': HL.load.transition + 'ms',
		}).off('mouseover').on('mouseover', function(){
			$(this).css('cursor', 'pointer')
			.off('click').on('click', function(){
				$('.fade, #header_menu').css({
					'opacity': 0,
					'transition': HL.click.transition + 'ms',
				});
				$('#headerlogo').css({
					'width': HL.load.width,
					'height': HL.load.width,
					'margin': HL.load.margin,
					'transition': HL.click.transition + 'ms',
				}).on('transitionend', function(){
					//future replace by fadebox and go to index
					$('#header, #header_forcescrollspace').css({
						'opacity': 0,
						'transition': HL.load.transition + 'ms',
					});
					setTimeout(function(){
						window.location = 'index.html';
					}, HL.load.transition)
				});
			});
		});
	},10)
};

// Make headermenu --------------------------------------------------------------------------------------------------------------------
function HeaderMenu() {
	$('#header_menu').css({
		'text-decoration': 'none',
		'margin-top': '1px',
		'padding-left': HL.center_right(),
	})
	$('#header_menu li').css({
		'font-weight': '200',
		'display': 'inline-block',
		'padding-right': '20px',
		'color': color_back,
	})

	MenuItem('#menu_about', 'about.html', color_1)
	MenuItem('#menu_music', 'music.html', color_2)
	MenuItem('#menu_video', 'video.html', color_3)
	MenuItem('#menu_shows', 'shows.html', color_4)

};

// Make menuitem ----------------------------------------------------------------------------------------------------------------------
function MenuItem(MI_id, MI_href, MI_color) {
	if (MI_href != document.location.href.match(/[^\/]+$/)[0]) {
		$(MI_id)
		.off('mouseover').on('mouseover', function(){
			$(this).css({
				'cursor': 'pointer',
				'opacity': 0.5,
			})
		})
		.on('mouseout').on('mouseout', function(){
			$(this).css({
				'cursor': 'initial',
				'opacity': 1,
			})
		})
		.off('click').on('click', function(){
			$('.fade, #header_menu').css({
				'opacity': 0,
				'transition': HL.click.transition + 'ms',
			});
			$('#header, #header_forcescrollspace').css({
				'background-color': MI_color,
				'transition': HL.click.transition + 'ms',
			})
			$('#headerlogo').css({
				'width': HL.load.width,
				'height': HL.load.width,
				'margin': HL.load.margin,
				'transition': HL.click.transition + 'ms',
			}).on('transitionend', function(){
				window.location = MI_href;
			});
		});
	};
};

// Make content container -------------------------------------------------------------------------------------------------------------
function ContentContainer(){
	if (width_medium == true || width_small == true) {
		$('.content_container').css({
				'margin': '0px',
		})
	} else if (width_large == true){
		$('.content_container').css({
				'margin': '0px ' + (HL.center_right()) + 'px',
		})
	} else {
		$('.content_container').css({
				'margin': '0px ' + (HL.center_right() * 2) + 'px',
		})
	}
}

// Make content container -------------------------------------------------------------------------------------------------------------
function TextContainer(){
		$('.text_container').css({
			'margin': '0px ' + (HL.center_right()) + 'px',
		});
};
