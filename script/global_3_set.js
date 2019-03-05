// VARIABLES --------------------------------------------------------------------------------------------------------------------------
var linklogo = {}

// GLOBAL SET ------------------------------------------------------------------
function globalSet() {

  // CALCULATIONS ----------------------------------------------------------
  linklogo = linklogo_s[platform];

  // STYLE APPLICATION -----------------------------------------------------
  $('#link_logos').css({
    'position': linklogo.position,
    'margin-top': linklogo.margin,
    'margin-right': linklogo.margin,
    'display': linklogo.display(),
  }).addClass(linklogo.class);

  $('.link_logo').css({
    'width': linklogo.logo.width(),
    'height': linklogo.logo.height(),
    'margin': linklogo.logo.margin(),
    'padding-bottom': linklogo.logo.padding_bottom(),
  });

} globalSet()
