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

      $('#link_logos, h2').css('display','none') // NOTE: This should be seperate
      //art.clearRect(0,0,win.iW,win.iH) // NOTE: This too
      $('#art , #background , #harted').css({
        'transition': '200ms',
        'opacity': 0,
      })

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
        $('#center_logo').css({'transition':'250ms','width':0,'height':0})
        .one('transitionend', function(){
          window.location = box_s.link[i];
        });
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
