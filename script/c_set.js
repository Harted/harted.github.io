// CONSTANTS --------------------------------------------------------------------------------------------------------------------------

// VARIABLES --------------------------------------------------------------------------------------------------------------------------
var squares = []

// Set sizes and properties -----------------------------------------------------------------------------------------------------------
function SetSize(){
  //reference box
	$('#reference_box').css({
		'width': ref_box,
		'height': ref_box,
	})
  //squares
  this.square = function(html_id) {
    this.html_id = html_id
  	this.obj = $(this.html_id)[0]
  	this.sizeAnim = function(s1, s2){
  		$(this.html_id).css({'width': s1, 'height':s1 })
  		.on('mouseenter', function(){
  			$(this).css({'width': s2, 'height':s2 });
        C_AnimTrigger(cl, [CL_fill, CL_border],true)
  		}).on('mouseleave', function(){
  			$(this).css({'width': s1, 'height':s1 });
        C_AnimTrigger(cl, [CL_fill, CL_border],false)
  		})
      this.update = function(){
        this.ol = this.obj.offsetLeft
        this.ot = this.obj.offsetTop
        this.w = $(this.html_id).width()
        this.h = $(this.html_id).height()
        this.x = mouse.ref_box.x - this.ol
        this.y = mouse.ref_box.y - this.ot
        if (true) {
         console.log(this.w,this.h) //NOTE NOTE hier was ik
        }
      }
  	};
  };

  squares = []
  for (var i = 0; i < box_p.html_ids.length; i++) {
    squares.push(new this.square(box_p.html_ids[i]))
    squares[i].sizeAnim(box[i+1].size, box.hover_size)
  }





}; SetSize(); //trigger on launch
