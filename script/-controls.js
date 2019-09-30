c = {
  f: false,
  th: [],
  si: false,
}

$('#format').click(function(){

  c.f = toggle(c.f)

  if (c.f) {
    $('tr').addClass('clearformat')
  } else {
    $('tr').removeClass('clearformat')
  }

})


// TOGGLE FUNCTION
function toggle(i){
  if (i) {return false} else {return true}
}


// DATETIME --------------------------------------------------------------------
var date_to_ud = false

$('input[type=datetime-local]').focusout(datecheck)
.on('input', datecheck)

$('#to_date').focusout(dateto).on('input', dateto)

//Default
$(document).ready(function(){
  $('#to_date').val(dateT(Date.now()))
  $('#from_date').val(dateT(
    dateT(new Date( new Date(Date.now()).getTime() - 3600000 )))
  )
})


function datecheck() {

  if(dc(this)){
    $(this).removeClass('invalid')


    if ($('#to_date').val() > dateT(Date.now())) {
      $('#to_date').val(dateT())
    }


    if ($('#to_date').val() <= $('#from_date').val() ) {
        $('#from_date').val(
          dateT(new Date( $('#to_date').val()).getTime() - 3600000 )
        )
    }

  } else {
    $(this).addClass('invalid')
  }

}


function dateto(){

  if(dc(this)){
    date_to_ud = true
  } else {
    date_to_ud = false
  }

}

// Date check function -----------------------------------------------
function dc(target){

  var v = $(target).val()

  var date = new Date(v)

  if (date == 'Invalid Date') {
    return false
  } else {
    return true
  }

}


// BUTTON STYLE ----------------------------------------------------------------
$('.btn').mousedown(style_md)
function style_md(){ $(this).addClass('clicked') }
function style_mu(dit){ $(dit).removeClass('clicked') }


// TIME BUTTONS ----------------------------------------------------------------
$('#today').mouseup(today_mu)

function today_mu(){

  var start = dateT().replace(/\d{2}:\d{2}:\d{2}/,'00:00:00')
  var end = dateT()

  $('#from_date').val( start ).removeClass('invalid')
  $('#to_date').val( end ).removeClass('invalid')

  style_mu(this)

}

$('#1_hour,#2_hour,#4_hour,#8_hour').mouseup(hour_sel)

function hour_sel(){

  if (date_to_ud) {
    var d = dateT($('#to_date').val())
  } else {
    var d = dateT()
  }

  var h = 3600000
  var n = parseInt($(this).attr('id').replace('_hour'))

  var end = d

  var start = dateT(new Date(d).getTime() - (n*h))

  $('#from_date').val( start ).removeClass('invalid')
  $('#to_date').val( end ).removeClass('invalid')

  style_mu(this)

}

$('#dt_clear').mouseup(dt_clear)

function dt_clear(){

  $('#from_date').val('').addClass('invalid')
  $('#to_date').val('').addClass('invalid')

  date_to_ud = false;

  style_mu(this)

}


// Local YYYY-MM-DDTHH:MM:SS sring from date
function dateT(date){

  date = date || Date.now()
  return new Date(new Date(date).toString().split('GMT')[0]+' UTC').toISOString().split('.')[0]

}


$('#show_inact').mouseup(show_inact_mu)

function show_inact_mu(){

  c.si = toggle(c.si)

  var el = $('#sel_stations .zonename, #sel_stations .stn_btn')

  if (c.si){
    el.addClass('showinactive')
  } else {
    el.removeClass('showinactive')
    style_mu(this)
  }

}
