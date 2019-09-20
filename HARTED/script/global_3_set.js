// VARIABLES -------------------------------------------------------------------
var linklogo = {}

// GLOBAL SET ------------------------------------------------------------------
function globalSet() {



  // CALCULATIONS ----------------------------------------------------------
  linklogo = linklogo_s[platform];

  // STYLE APPLICATION -----------------------------------------------------
  $('#link_logos').css({
    'position': linklogo.position,
    'margin': linklogo.margin(),
    'display': linklogo.display(),
    'top': linklogo.alignArray()[0],
    'left': linklogo.alignArray()[1],
    'bottom': linklogo.alignArray()[2],
    'right': linklogo.alignArray()[3],
    'width': linklogo.width()
  });

  $('.link_logo').css({
    'width': linklogo.logo.width(),
    'height': linklogo.logo.height(),
    'margin': linklogo.logo.margin(),
    'padding-bottom': linklogo.logo.padding_bottom(),
  });

  $('.link_logo g').css(linklogo_s.css.default)
  .on('mouseenter', function(){
    $(this).css(linklogo_s.css.enter)
  }).on('mouseleave', function(){
    $(this).css(linklogo_s.css.default)
  }).on('click', function(){
    $(this).css(linklogo_s.css.default)
    .css(linklogo_s.css.click)
    .one('transitionend', function(){
      window.open(linklogo_s.link[$(this).attr('id')])
    })
  })

} globalSet()

// Set paths for svg's ---------------------------------------------------------
svgSet(svg_linklogos_s)

var resetLinkLogo = debounce(function(){
  $('.link_logo a').css(linklogo_s.click.css)
  console.timeEnd('lalala')
}, 250, false)
