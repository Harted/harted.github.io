// CONSTANTS --------------------------------------------------------------------------------------------------------------------------

// VARIABLES --------------------------------------------------------------------------------------------------------------------------
var squares = []

// Set sizes and properties -----------------------------------------------------------------------------------------------------------
function setSize(){
	//reference box
	$('#reference_box').css({'width': ref_box,'height': ref_box,})

	//squares
	this.square = function(i) {
		var div = $(box_s.html_id[i])
		var h2 = $(box_s.html_id[i] + ' h2')
		var s1 = box[i+1].size
		var s2 = box.hover_size

		this.init = function(){
			over['box'+(i+1)] = false
			div.css({'width': s1, 'height':s1 })
			.on('mouseenter', function(){
				over['box'+(i+1)] = true
				$(this).css({'width': s2, 'height':s2 })
				.off('transitionend').on('transitionend', function(){
					$(this).css('cursor','pointer')
					.off('click').on('click', function(){
						$(window).off('resize mousemove touchstart');
						for (var j = 0; j < box_s.html_id.length; j++) {
							if(j != i){
								$(box_s.html_id[j]).css(box_s.css.click.not.div)
								$(box_s.html_id[j] + ' h2').css(box_s.css.click.not.h2)
							};
						};
						$('#reference_box').css(box_s.css.click.ref_box)
						$(this).off('mouseenter mouseleave transitionend click')
						.css(box_s.css.click.div).one('transitionend', function(){
							window.location = box_s.link[i];
						});
						h2.css(box_s.css.click.h2)
					})
				});
				//C_AnimTrigger(cl, [CL_fill, CL_border], true)
			}).on('mouseleave', function(){
				over['box'+(i+1)] = false
				$(this).css({'width': s1, 'height':s1 , 'cursor': 'initial'})
				.off('click transitionend');
				//C_AnimTrigger(cl, [CL_fill, CL_border], false)
			})
			// h2 - title
			h2.css({
				'margin': box.title_margin + 'px',
				'font-size': box.font_size + 'px',
			})
			var th2 = h2
			setTimeout(() => {th2.css({'transition': 'inherit'})}, 100);
		};

		var resized = false

		this.mousemove = function(){
			var ol = div[0].offsetLeft, ot = div[0].offsetTop
			var w = div.width(), h = div.height()
			var x = mouse.ref_box.x - ol, y = mouse.ref_box.y - ot
			var x_bor = Math.abs((w/2) - x)-(w/2), y_bor = Math.abs((h/2) - y)-(w/2)
			var distfrom, actdist = box_s.actdist
			// things happen...
			if (x_bor > 0) {distfrom = x_bor}
			if (y_bor > 0 && y_bor > x_bor) {distfrom = y_bor}
			var sizefctr = distfrom - actdist
			if (sizefctr < 0 && over['box'+(i+1)] == false && (over.cl == false || over.cl == undefined)){
				sizefctr = Math.abs(sizefctr/actdist);
				div.css({
					'width': s1 + actdist/2 * sizefctr,
					'height': s1 + actdist/2 * sizefctr
				}); resized = true;
			} else if (over['box'+(i+1)] == false && resized == true) {
				div.css({'width': s1, 'height': s1}); resized = false;
			};
		};
	};

	squares = []
	for (var i = 0; i < box_s.html_id.length; i++) {
		squares.push(new this.square(i))
		squares[i].init()
	}

}; setSize(); //trigger on launch
