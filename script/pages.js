// Make header ------------------------------------------------------------------------------------------------------------------------
function Header(color) {
	$('#header').css({
		'position': 'fixed',
		'width': '100%',
		'height': header_height,
		'line-height': header_height + "px",
		'bottom': 0,
		'background-color': color,
	})
};
// Make headerlogo --------------------------------------------------------------------------------------------------------------------
function HeaderLogo(color) {
	$('#headerlogo').css({
		'height' : header_height,
		'width' : header_height,
		'float': 'right'
	}).on("mouseenter", function(){
		$(this).css('cursor', 'pointer')
		.on('click', function(){
			$('#headerlogo svg').css({
				'width': '0px',
				'height': '0px',
				'margin': (header_height/2),
				'transition': anim_speed_factor * 100 + "ms",
			}).on("transitionend", function(){
				$('#header').css({
					'opacity': 0,
					'transition': anim_speed_factor * 250 + "ms",
				})
				setTimeout(function(){
					window.location = "index.html";
				}, anim_speed_factor * 250);
			});
		});

	});

	$('#headerlogo svg').css({
		'width': '0px',
		'height': '0px',
		'margin': (header_height/2),
		'fill': color,

	})

	setTimeout(function() {
		$('#headerlogo svg').css({
			'width': (header_height/3*2),
			'height': (header_height/3*2),
			'margin': (header_height/6),
			'transition': anim_speed_factor * 250 + "ms",
		}).on("transitionend", function(){
			$(this).css("transition", "none")
			.off("transitionend");
		});
	}, 25);
};

// Make content container -------------------------------------------------------------------------------------------------------------
function ContentContainer(){
	var headerlogo_center_right = window_width - ($('#headerlogo').offset().left + (header_height/2));
	$('.content_container').css({
			'margin': '0px ' + (headerlogo_center_right * 2) + "px",
	})
	console.log($('.content_container').css("width"))
}
