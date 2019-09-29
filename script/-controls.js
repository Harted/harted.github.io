c = {
  f: false,
  th: [],
}

$('#format').click(function(){

  c.f = toggle(c.f)

  if (c.f) {
    $('tr').addClass('clearformat')
  } else {
    $('tr').removeClass('clearformat')
  }

})



$('input[type=datetime-local]').focusout(datecheck)
$('input[type=datetime-local]').on('input', datecheck)

function datecheck(){

  var date = new Date($(this).val())
  if (date == 'Invalid Date') {
    $(this).addClass('invalid')
  } else {
    $(this).removeClass('invalid')
  }

  console.log(date); //////HIERZO

}












// TOGGLE FUNCTION
function toggle(i){
  if (i) {return false} else {return true}
}
