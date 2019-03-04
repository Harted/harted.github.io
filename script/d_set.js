// CONSTANTS --------------------------------------------------------------------------------------------------------------------------

// VARIABLES --------------------------------------------------------------------------------------------------------------------------
var squares = []
var over = {}

// Set sizes and properties -----------------------------------------------------------------------------------------------------------
function setSize(){
	//reference box
	$('#reference_box').css({'width': refbox,'height': refbox,})

	//squares
	this.square = function(i) {
		var div = $(box_s.html_id[i])
		var h2 = $(box_s.html_id[i] + ' h2')
		var s1 = box[i].size
		var s2 = box.hover_size

		// box title
		h2.css({
			'margin': box.title_margin + 'px',
			'font-size': box.font_size + 'px',
		})

		let click = function(){
			$(window).off('resize mousemove touchstart');
			for (var j = 0; j < box_s.html_id.length; j++) {
				if(j != i){
					$(box_s.html_id[j]).css(box_s.click.css.not.div)
					$(box_s.html_id[j] + ' h2').css(box_s.click.css.not.h2)
				};
			};
			$('#reference_box').css(box_s.click.css.refbox)
			div.off('mouseenter mouseleave transitionend click')
			.css(box_s.click.css.div).one('transitionend', function(){
				window.location = box_s.link[i];
			});
			h2.css(box_s.click.css.h2)
		}

		this.init = function(){
			over['box'+ i] = false
			div.css({'width': s1, 'height':s1 })
			.css(box.css)

			if (win.min_b.S == true || touch == true) {
				div.off('click').on('click', function(){
					click()
				})
			} else {
				//desktop animation and clicktrough --------------------------------------
				div.on('mouseenter', function(){
					over['box'+ i] = true
					$(this).css({'width': s2, 'height':s2 })
					.off('click transitionend').on('transitionend', function(){
						$(this).css('cursor','pointer')
						.on('click', function(){
							click()
						})
					});
					//C_AnimTrigger(cl, [CL_fill, CL_border], true)
				}).on('mouseleave', function(){
					over['box'+ i] = false
					$(this).css({'width': s1, 'height':s1 , 'cursor': 'initial'})
					.off('click transitionend');
					//C_AnimTrigger(cl, [CL_fill, CL_border], false)
				})
			};

		};

	};

	window[box_s.group] = []
	for (var i = 0; i < box_s.html_id.length; i++) {
		window[box_s.group].push(new this.square(i))
		window[box_s.group][i].init()
	}

	//link logos
	$('#link_logos').css({
		'position': linklogo.position,
		'margin-top': linklogo.margin,
		'margin-right': linklogo.margin,
		'display': linklogo.display(),
	}).addClass(linklogo.class)

	$('.link_logo').css({
		'width': linklogo.logo.width(),
		'height': linklogo.logo.height(),
		'margin': linklogo.logo.margin(),
		'padding-bottom': linklogo.logo.padding_bottom(),
	})

	//harted on index
	$('#harted').css('margin', linklogo.margin)



}; setSize(); //trigger on launch
