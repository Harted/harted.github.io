// TOGGLE ----------------------------------------------------------------------

tog = {
  format: false,
  showinact: false,
}

var h = 3600000 // 1 hour in miliseconds
var to = $('#to_date')
var fr = $('#from_date')
var lb = $('#lookback')
var rt = $('#realtime')
var GD = $('#get_data')

// Clear/apply table formatting --------------------------------------
$('#format').mouseup(format_mu)

function format_mu(){

  tog.format = !tog.format

  var el = $('tr')

  if (tog.format) {
    el.addClass('clearformat')
  } else {
    el.removeClass('clearformat')
    style_mu(this)
  }

};

// Show/hide inactive stations ---------------------------------------
$('#show_inact').mouseup(show_inact_mu)

function show_inact_mu(){

  tog.showinact = !tog.showinact

  var el = $('#sel_stations .item_title, #sel_stations .glass_btn')

  if (tog.showinact){
    el.addClass('showinactive')
  } else {
    el.removeClass('showinactive')
    style_mu(this)
  }

}




// BUTTON STYLE ----------------------------------------------------------------
$('.btn').mousedown(style_md)
// - common mousedown style:
function style_md(){ $(this).addClass('clicked') }
// - place this one in the mouse up function after the calculations:
function style_mu(target){ $(target).removeClass('clicked') }



// DEFAULTS --------------------------------------------------------------------
// Default value: 1/4h from now
$(document).ready(default_dt)

function default_dt(){
  to.val(dateT())
  fr.val(dateT(null, h/4))
  lb.val( 15 )
}


// DATETIME ------------------------------------------------------------------//

// USER DEFINED ----------------------------------------------------------+
// This is true when the user changes the TO date by typing or selecting
// - If the user changes the TO date the hour buttons reference to this
// - date and not Date.now
var to_user = false
// - Function that sets it true
$('#to_date').focusout(date_to).on('input', date_to)

function date_to(){
  if(dc(this)){to_user = true} else {to_user = false}
  if(to_user){to.addClass('to_udef')} else {to.removeClass('to_udef')}
}


// VALIDITY VISUALISATION & RESTRICTIONS ---------------------------------+

// Check if date and format red if it's not a date
$('input[type=datetime-local]').focusout(datecheck).on('input', datecheck)

function datecheck() {

  if(dc(this)){ // check if valid date (returns true)

    $(this).removeClass('invalid') // remove red format

    // date_to can't be bigger then NOW
    if (to.val() > dateT()) { to.val(dateT())}

    // if date_to is equal or smaller than from date set from date to 1h back
    if (to.val() <= fr.val() ) {
      fr.val(dateT(to.val(),h))
    }

  } else {

    $(this).addClass('invalid') // add red format when no valid date

  }
}

// Date check function -----------------------------------------------
function dc(target){
  var val = $(target).val(); var date = new Date(val);
  if (date == 'Invalid Date') { return false } else { return true };
}



// TIME BUTTONS ----------------------------------------------------------------
var TIME = {
  rel: false,
  rt: false,
  lbt: function(){return(lb.val())},
  sta: function(){return(fr.val())},
  end: function(){return(to.val())},
}

$('.h_btn').mouseup(hour_sel)
$('#dt_reset').mouseup(dt_clear)
$('#relative').mouseup(rel_mu)
rt.mouseup(rt_mu);


// Fixed time selection buttons
function hour_sel(){

  if (to_user) { var d = dateT(to.val()) }
  else { var d = dateT()};

  var n = eval($(this).attr('id').replace('_hour','').replace('_','/'))

  var start = dateT(d, n * h)
  var end = d

  fr.val( start ).removeClass('invalid')
  to.val( end   ).removeClass('invalid')
  lb.val( n * 60 )

  style_mu(this)

}

// Reset to default
function dt_clear(){

  default_dt();

  to_user = false;
  to.removeClass('to_udef invalid');
  fr.removeClass('invalid')

  style_mu(this);

}


// Local yyyy-mm-ddThh:mm:ss sring from date
function dateT(d, sub){

  // now or defined by T string
  if (d == undefined){

    d = new Date(Date.now())

  } else if (/[\d]{4}-[\d]{1,}-[\d]{1,}T[\d]{2}:[\d]{2}:[\d]{2}/.test(d)) {

      var p = d.match(/[\d]{1,}/g)

      var d = new Date(p[0],p[1]-1,p[2],p[3],p[4],p[5])

  }

  // subtract
  var n = Date.parse(d)

  if (sub != undefined) {

    n = n - sub

  }

  // create T string
  var o = new Date(n)

  var str = new Date(
    new Date(n).toString().split('GMT')[0]+' UTC'
  ).toISOString().split('.')[0];

  return str

}











$(document).ready(function(){
  lb.prop('disabled',true)
  rt.prop('disabled',true)
})

function rel_mu(){

  TIME.rel = !TIME.rel

  if (TIME.rel) {
    to.prop('disabled',true)
    fr.prop('disabled',true)
    lb.prop('disabled',false)
    rt.prop('disabled',false)
  } else {
    to.prop('disabled',false)
    fr.prop('disabled',false)
    lb.prop('disabled',true)
    rt.prop('disabled',true); reset_rt();
    style_mu(this)
  }

}

function rt_mu(){

  TIME.rt = !TIME.rt

  if (TIME.rt) {
    GD.val('GET DATA (realtime)')
  } else {
    GD.val('GET DATA').prop('disabled',false)
    style_mu(this)
  }

}

function reset_rt(){
  GD.val('GET DATA').prop('disabled',false)
  TIME.rt = false;
  style_mu('#realtime')
}



// STATION BUTTONS -------------------------------------------------------------

$('.ssel_btn').mouseup(stn_all_mu)


function sel_stn(){

  var part = $(this).attr('id').split('_')
  var state = TIA_GC[part[0]][part[1]].sel

  stnSet(part[0],part[1],!state)

}

function sel_zone(){

  var one_sel = false
  var part = $(this).attr('id').split('_')

  for (var stn in TIA_GC[part[0]]) {
    if (TIA_GC[part[0]].hasOwnProperty(stn)) {

      var sel = TIA_GC[part[0]][stn].sel

      if(sel) {one_sel = true; break; };

    }
  }

  for (var stn in TIA_GC[part[0]]) {
    stnSet(part[0],stn,!one_sel)
  }

}



function stn_all_mu(){

  var s = $(this).attr('id').replace('stn_',''); var b;

  if (s == 'all') { b = true } else { b = false}

  for (var zone in TIA_GC) {
    if (TIA_GC.hasOwnProperty(zone)) {

      for (var stn in TIA_GC[zone]) {
        if (TIA_GC[zone].hasOwnProperty(stn)) {

          stnSet(zone,stn,b)

        }
      }
    }
  }

  style_mu(this)

}


function stnSet(zone,stn,b){

  var act = TIA_GC[zone][stn].active

  if(act) { TIA_GC[zone][stn].sel = b}

  var el = $('#' + zone + '_' + stn + '_stnbtn')

  if(b && act){
    el.addClass('sel')
  } else {
    el.removeClass('sel')
  }

}









// FILTERS ---------------------------------------------------------------------

FILTERS = {
  sev: {
    A: true, B: true, C: true, D: true, E: false,
  },
  at: {
    active: false, general: true, safety: true, interlock: true,
    autonotstarted: true, manual: true, formatnok: true,
    alarm: true,
  },
  prod: {
    general: true, inout: true, andon: true, controlroom: true,
  },
}

$(document).ready(default_fltr);

function default_fltr(){
  for (var type in FILTERS) {
    if (FILTERS.hasOwnProperty(type)) {
      for (var sub in FILTERS[type]) {
        if (FILTERS[type].hasOwnProperty(sub)) { fltrSet(type, sub) }
      }
    }
  }
}

// clicky wicky
$('#filters .glass_btn').mouseup(filters_mu)

function filters_mu(){

  var part = $(this).attr('id').split('_')

  FILTERS[part[0]][part[1]] = !FILTERS[part[0]][part[1]]

  fltrSet(part[0], part[1])

}

function fltrSet(type,sub){

  if(FILTERS[type][sub]){
    $('#' + type + '_' + sub).addClass('sel')
  } else {
    $('#' + type + '_' + sub).removeClass('sel')
  }

}


$('#filters .fsel_btn').mouseup(fltr_all_mu)


function fltr_all_mu(){

  var s = $(this).attr('id').replace('fltr_',''); var b;

  if (s == 'all') { b = true } else { b = false}

  for (var zone in TIA_GC) {
    if (TIA_GC.hasOwnProperty(zone)) {

      for (var type in FILTERS) {
        if (FILTERS.hasOwnProperty(type)) {
          for (var sub in FILTERS[type]) {
            if (FILTERS[type].hasOwnProperty(sub)) {

              FILTERS[type][sub] = b

              fltrSet(type, sub)

            }
          }
        }
      }
    }
  }

  style_mu(this)

}

$('#filters .item_title.active').mouseup(sel_type)

function sel_type(){

  var one_sel = false
  var part = $(this).attr('id').split('_')

  for (var sub in FILTERS[part[0]]) {
    if (FILTERS[part[0]].hasOwnProperty(sub)) {

      if(FILTERS[part[0]][sub]) {one_sel = true; break; };

    }
  }

  for (var sub in FILTERS[part[0]]) {
    FILTERS[part[0]][sub] = !one_sel
    fltrSet(part[0], sub)
  }

}
