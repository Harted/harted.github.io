// ALFA LOGO -------------------------------------------------------------------
function alfaLogo(){
  // svg in object format
  var alfa_svg = {
    viewbox : "0 0 100 100",
    poly:"9.54,100 43.11,0 57.08,0 90.56,99.75 69.26,83.34 80.31,88.74 "
    + "52.72,7 47.47,7 19.96,88.54 29.53,83.69 47.24,27.04 34.55,87.78 "
  }
  // set attributes for top left logo
  $('#alfa_logo svg').attr('viewBox',alfa_svg.viewbox)
  $('#alfa_logo polygon').attr('points',alfa_svg.poly)

  $('#controllogo svg').attr('viewBox',alfa_svg.viewbox)
  $('#controllogo polygon').attr('points',alfa_svg.poly)

  $('.table-underlay #ul_logo svg').attr('viewBox',alfa_svg.viewbox)
  $('.table-underlay #ul_logo polygon').attr('points',alfa_svg.poly)

}; alfaLogo();
