// Make header ------------------------------------------------------------------------------------------------------------------------
function Header(color){
  $('#header').css({
    'background-color': color,
    'height': header_height,
  })
};

// Make headerlogo --------------------------------------------------------------------------------------------------------------------
function HeaderLogo(){
  $('#headerlogo svg').css({
    'width': '0px',
    'heigth': 'Opx',
    'transition': anim_speed_factor * 250 + "ms",
    'fill': color_back,
  })
  setTimeout(function(){
    $('#headerlogo svg').css({
      'width': '40px',
      'height': '40px',
    })
  }, 25);
};
