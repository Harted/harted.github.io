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

	var padding_right = 20;

	$('#header_menu').css({
		'text-decoration': 'none',
		'margin-top': 0,
		'padding-left': HL.center_right(),
	})
	$('#header_menu li').css({
		'font-weight': '200',
		'display': 'inline-block',
		'padding-right': '20px',
		'color': color_back,
	})

	var menu_size = Math.round((($('#header_menu li').width() + padding_right)*4) + HL.center_right());
	var menu_space = Math.round((window_width - (HL.center_right()*2)));
	var menu_overlap = menu_space - menu_size

	var padding_right_new = Math.round(padding_right + (menu_overlap/4))

	if (padding_right_new > 4) {
		$('#header_menu li').css({
			'display': 'inline-block',
		})
		if (menu_overlap > 0) {
			$('#header_menu li').css({
				'padding-right': padding_right + 'px',
			})
		} else {
			$('#header_menu li').css({
				'padding-right': padding_right_new + 'px',
			})
		};
	} else {
		$('#header_menu li').css({
			'display': 'none',
		})
	}


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
			'top': 0,
		});
};

// Make page header -------------------------------------------------------------------------------------------------------------------
function PageBanner(){

	// make sure the image fills the content container width
	console.log($('.content_container').width())
	$('#page_banner img').css({
		'width': $('.content_container').width() + 'px',
		'height': 'auto',
	})

	// run function on load and resize
	PageBannerPosition();

	// run function on scroll
	$(window).off('scroll').on('scroll', function(){
		PageBannerPosition();
	});
};

// Page header position ---------------------------------------------------------------------------------------------------------------
function PageBannerPosition(){

	var fixed_whitespace = window_height - $('#page_banner_scroll').height();
	var maximum_whitespace = $('#page_banner_scroll').height()/4;
	var viewport_height = window_height - header_height;

	// if the white_space is small enough then do the animation where the content meets the banner when scrolling
	if (fixed_whitespace < maximum_whitespace) {
		$('#page_banner').css({
			'position': 'relative',
			'height': viewport_height + 'px',
		});

		// actual height of the banner + the amount of space above the viewport when scrolling down.
		var scroll_whitespace = viewport_height - ($(window).scrollTop() + $('#page_banner_scroll').height());

		// if the space between the page banner and content > 0 then banner is fixed
		if (scroll_whitespace > 0) {
			$('#page_banner_scroll').css({
				'position': 'fixed',
				'width': $('.content_container').width(),
				'top': 0,
				'bottom': 'auto',
			});
		} else { // banner is fixed untill page banner and content = 0
			$('#page_banner_scroll').css({
				'position': 'absolute',
				'width': $('.content_container').width(),
				'top': 'auto',
				'bottom': 0,
			});
		};
	} else {
		$('#page_banner').css({
			'position': 'relative',
			'height': $('#page_banner_scroll').height(),
		});
		$('#page_banner_scroll').css({
			'position': 'absolute',
			'width': $('.content_container').width(),
			'top': 'auto',
			'bottom': 0,
		});
	}
}
