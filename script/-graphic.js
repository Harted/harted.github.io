// ALFA LOGO -------------------------------------------------------------------
var alfa_svg = {
  viewbox : "0 0 100 100",
  poly:"9.54,100 43.11,0 57.08,0 90.56,99.75 69.26,83.34 80.31,88.74 "
  + "52.72,7 47.47,7 19.96,88.54 29.53,83.69 47.24,27.04 34.55,87.78 ",
}
// set attributes for top left logo
$('#alfa_logo svg').attr('viewBox',alfa_svg.viewbox)
$('#alfa_logo polygon').attr('points',alfa_svg.poly)

// logo under controls
$('#controllogo svg').attr('viewBox',alfa_svg.viewbox)
$('#controllogo polygon').attr('points',alfa_svg.poly)

// Logo in backgound table
$('.table-underlay #ul_logo polygon').attr('points',alfa_svg.poly)
$('.table-underlay #ul_logo svg').attr('viewBox',alfa_svg.viewbox)


// HAMBURGER -------------------------------------------------------------------
var hamburger_svg = {
  viewbox : "0 0 100 100",
  paths : ''
  + '<path d="M88.92,20.81H11.08c-5.35,0-9.73-4.38-9.73-9.73v0c0-5.35,'
  + '4.38-9.73,9.73-9.73h77.84c5.35,0,9.73,4.38,9.73,9.73v0 '
  + 'C98.65,16.43,94.27,20.81,88.92,20.81z"/>'
  + '<path d="M88.92,59.73H11.08c-5.35,0-9.73-4.38-9.73-9.73v0c0-5.35, '
  + '4.38-9.73,9.73-9.73h77.84c5.35,0,9.73,4.38,9.73,9.73v0 '
  + 'C98.65,55.35,94.27,59.73,88.92,59.73z"/>'
  + '<path d="M88.92,98.65H11.08c-5.35,0-9.73-4.38-9.73-9.73v0c0-5.35,'
  + '4.38-9.73,9.73-9.73h77.84c5.35,0,9.73,4.38,9.73,9.73v0 '
  + 'C98.65,94.27,94.27,98.65,88.92,98.65z"/>'
}

// Control header hamburger
$('#control-header #hamburger svg').attr('viewBox',hamburger_svg.viewbox)
.html(hamburger_svg.paths)
