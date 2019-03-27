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

} globalSet()

// Set paths for svg's ---------------------------------------------------------
svgSet(svg_linklogos_s)
