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
	setTimeout(function(){
		$('#headerlogo').css({
			'height': HL.width,
			'width': HL.width,
			'margin': HL.margin,
			'transition': HL.load.transition + 'ms',
		}).off('mouseover').on('mouseover', function(){
			$(this).css('cursor', 'pointer')
			.off('click').on('click', function(){
				$('#headerlogo').css({
					'width': HL.load.width,
					'height': HL.load.width,
					'margin': HL.load.margin,
					'transition': HL.click.transition + 'ms',
				}).on('transitionend', function(){
					//future replace by fadebox and go to index
					$('#header').css({
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

// Make content container -------------------------------------------------------------------------------------------------------------
function ContentContainer(){
	var headerlogo_center_right = HL.right + (HL.width/2) + HL.margin;
	console.log(headerlogo_center_right)
	if (width_medium == true || width_small == true) {
		$('.content_container').css({
				'margin': '0px ' + window_width * 0.01 + 'px',
				'height': window_height,
				'background-color': '#f9f9f9',
		})
	} else {
		$('.content_container').css({
				'margin': '0px ' + (headerlogo_center_right) + 'px',
				'height': window_height,
				'background-color': '#f9f9f9',
		})
	}
}
