c = {
  f: false,
  th: [],
}

$('#format').click(function(){

  c.f = toggle(c.f)

  switch (c.f) {
    case true:
      $('tr').addClass('clearformat')
    break;
    case false:
      $('tr').removeClass('clearformat')
    break;
  }

})


















// TOGGLE FUNCTION
function toggle(i){
  if (i) {return false} else {return true}
}
