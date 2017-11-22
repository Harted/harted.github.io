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
function HeaderLogo() {
	$('#headerlogo').css({
		'height' : header_height,
		'width' : header_height,
		'float': 'right'
	})

	$('#headerlogo svg').css({
		'width': '1px',
		'height': '1px',
		'margin': (header_height/2),
		'fill': color_back,
		
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