// VARIABLES -------------------------------------------------------------------
var refbox
var box = {}, logo = {}
var boxes = []
var over = {}
var box_trans_mem
var artpic = {}

// INDEX SET -------------------------------------------------------------------
function indexSet() {

  // FUNCTIONS -------------------------------------------------------------

  let getRefBoxSize = function(sizeBoolArr, settings){
    for(key in sizeBoolArr){
      if (sizeBoolArr[key] == true) {return settings[key]();}
    };
  };

  let getBoxSize = function(refSize, settings){
    var obj = {};
    for (var i = 0; i < settings.length; i++) {
      obj[i] = {}; obj[i].size = refSize * settings[i] || settings[i];
    }; return obj;
  };

  // CALCULATIONS ----------------------------------------------------------

  refbox = getRefBoxSize(win.min_b, refbox_s);

  box = getBoxSize(refbox, box_s[platform].size);
  box.hover_size = refbox / box_s[platform].hover_size
  box.title_margin = refbox * box_s[platform].title_margin
  box.font_size = refbox * box_s[platform].font_size
  box.css = box_s[platform].css

  logo.size = refbox * logo_s[platform].size

  // STYLE APPLICATION -----------------------------------------------------
  //no transition on resize
  box_trans_mem = $('.box').css('transition')
  $('.box').css('transition','none')

  //reference box
  $('#reference_box').css({'width': refbox,'height': refbox,})

  //boxes
  let box_obj = function(i) {

    let div = $(box_s.html_id[i])
    let h2 = $(box_s.html_id[i] + ' h2')
    let s1 = box[i].size
    let s2 = box.hover_size

    let click = function(){

      $(window).off('resize mousemove touchstart');

      for (var j = 0; j < box_s.html_id.length; j++) {
        if(j != i){
          $(box_s.html_id[j]).css(box_s.noclick.css.div)
          $(box_s.html_id[j] + ' h2').css(box_s.noclick.css.h2)
        };
      };

      h2.css(box_s.click.css.h2)

      $('#reference_box').css(box_s.click.css.refbox)

      // NOTE: temp fade away for all objects
      $('#art, #background, #harted, #link_logos').css(art_s.click.css)

      // TODO: : All moving hexes should go to center (#background)

      let c = box_s.click.css

      div.off('mouseenter mouseleave transitionend click')

      .css(c.div_trans)
      .css(c.div_align[i])
      .css(c.div_endpos).one('transitionend', function(){
        $('#center_logo').css(logo_s.click.css)
        .one('transitionend', function(){
          location.reload()
          //window.location = box_s.link[i];
        });
      });


    };

    this.init = function(){
      over['box'+ i] = false
      div.css({'width': s1, 'height':s1 })
      .css(box.css)





      //desktop animation and clicktrough --------------------------------------
      div.on('mouseenter touchstart', function(){
        over['box'+ i] = true

        if (win.min_b.S == true) {
          click()
        } else {
          $(this).css({'width': s2, 'height':s2 })
          .off('click transitionend')
          .on('touchend', function(){
            if (touchendOver(box_s.html_id[i])) {
              click()
            } else {
              $(this).css({'width': s1, 'height':s1})
            }
          })
          .on('transitionend', function(){
            $(this).css('cursor','pointer')
            .on('click', function(){
              click()
            })
          });
        };
        //C_AnimTrigger(cl, [CL_fill, CL_border], true)
      }).on('mouseleave', function(){
        over['box'+ i] = false
        $(this).css({'width': s1, 'height':s1 , 'cursor': 'initial'})
        .off('click transitionend');
        //C_AnimTrigger(cl, [CL_fill, CL_border], false)
      })


      // box title
      h2.css({
        'margin': box.title_margin + 'px',
        'font-size': box.font_size + 'px',
      })

    };

  };

  boxes = []
  for (var i = 0; i < box_s.html_id.length; i++) {
    boxes.push(new box_obj(i))
    boxes[i].init()
  }

  //harted title // NOTE: make settings file
  $('#harted').css({
    'margin': $('#link_logos').css('margin-right'),
    'position': 'fixed',
    'padding-top': linklogo.logo.margin(),
    'font-size': 1 + 'em'
  })

  artpic = art_s[platform]

  $('#art').css(artpic.css)

  // restore transition after resize
  setTimeout(function () {
    $('.box').css('transition', box_trans_mem)
  }, 100);

}; indexSet();
