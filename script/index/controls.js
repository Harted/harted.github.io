// TOGGLE BUTTONS --------------------------------------------------------------

// toggle button object
tog = {
  format: false, //not used
  showinact: false,
}


// Clear/apply table formatting --------------------------------------
$('#format').mouseup(format_mu) // NOTE: NOT USED ATM

function format_mu(){

  tog.format = !tog.format

  var el = $('tr')

  if (tog.format) {
    el.addClass('clearformat')
  } else {
    el.removeClass('clearformat')
    btn_off_style(this)
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
    btn_off_style(this)
  }

}



// BUTTON STYLE ----------------------------------------------------------------
$('.btn').mousedown(btn_on_style)

// Button on style function
function btn_on_style(event){

  if (event.target == undefined) {
    $(event).addClass('clicked') // by function call
  } else {
    $(event.target).addClass('clicked') // by mousedonw
  }

}

// Button off style function
// - place this one in the mouse up function after the calculations:
function btn_off_style(event){
  $(event).removeClass('clicked') // (always) by function call
}




// DATETIME ------------------------------------------------------------------//

// Hour constant shorthand
var h = 3600000 // 1 hour in miliseconds

// Time object shorthands
var to = $('#to_date')
var fr = $('#from_date')
var lb = $('#lookback')


// USER DEFINED ----------------------------------------------------------+
// This is true when the user changes the TO date by typing or selecting
// - If the user changes the TO date the hour buttons reference to this
// - date and not Date.now
var to_user = false

// - Function that sets it true
$('#to_date').focusout(date_to).on('input', date_to)

function date_to(){
  // set true if date is valid
  if(dc(this)){to_user = true} else {to_user = false}
  // set user defined style
  if(to_user){to.addClass('to_udef')} else {to.removeClass('to_udef')}
}


// CLEAR DATE ------------------------------------------------------------+
function dt_clear(){

  // Reset user defined to date
  to_user = false;

  // = now - 15 min, not user defined and not invalid
  to.val(dateT()).removeClass('to_udef invalid');
  fr.val(dateT(null, h/4)).removeClass('invalid')
  lb.val( 15 )

  // Set mouse up style
  btn_off_style(this);

}


// VALIDITY VISUALISATION & RESTRICTIONS ---------------------------------+

// Check if date and format red if it's not a date
$('input[type=datetime-local]').focusout(datecheck).on('input', datecheck)
$('#sel_time input[type=number]').on('input', lb_check)

// Check if valid and restirct from & to date
function datecheck() {

  if(dc(this)){ // check if valid date (returns true)

    $(this).removeClass('invalid') // remove red format

    // if date_to is equal or smaller than from date set from date to 1h back
    if (to.val() <= fr.val() ) {

      // if from date is set set o date vice versa
      if ($(this).val() == fr.val()){
        to.val(dateT(fr.val(), -h))
      } else if ($(this).val() == to.val()){
        fr.val(dateT(to.val(), h))
      }

    // limit date difference to 1 day
    // } else if (fr.val() <= dateT(to.val(),h*24)) {
    //
    //   // if from date is set set o date vice versa
    //   if ($(this).val() == fr.val()){
    //     to.val(dateT(fr.val(), -h*24))
    //   } else if ($(this).val() == to.val()){
    //     fr.val(dateT(to.val(), h*24))
    //   }

    }

    // date_to can't be bigger then NOW
    if (to.val() > dateT()) {
      to.val(dateT())
      fr.val(dateT(to.val(),h))
    }

  } else {

    $(this).addClass('invalid') // add red format when no valid date

  }
}

// Restrict lookback time 5-480 min
function lb_check(){
  // can't be larger then 480 minutes
  if ($(this).val() > 480) {$(this).val(480)}
}

// Date check function -----------------------------------------------
function dc(target){
  var val = $(target).val(); var date = new Date(val);
  if (date == 'Invalid Date') { return false } else { return true };
}


// TIME BUTTONS ----------------------------------------------------------+

// Time buttons object shorthands
var rt = $('#realtime')
var rel = $('#relative')

var GD = $('#get_data')
var oa = $("#only_active")

// TIME object
var TIME = {
  rel: false,
  rt: false,
  lbt: function(){return(lb.val())},
  sta: function(){return(fr.val())},
  end: function(){return(to.val())},
}

//inderect hour button reference
$('.h_btn').mouseup(hour_sel)

// direct references
$('#dt_reset').mouseup(dt_clear)
rel.mouseup(rel_mu)
rt.mouseup(rt_mu);

// Fixed time selection buttons --------------------------------------
function hour_sel(){

  // if user selected to date use this as reference, else use now
  if (to_user) {
    var d = dateT(to.val())
  } else {
    var d = dateT()
  };

  // evaluate number from buton id
  var n = eval($(this).attr('id').replace('_hour','').replace('_','/'))

  // calculate start en end date
  var start = dateT(d, n * h)
  var end = d

  // set from, to and lookback
  fr.val( start ).removeClass('invalid')
  to.val( end   ).removeClass('invalid')
  lb.val( n * 60 )

  // set button off style on end
  btn_off_style(this)

}





// RELATIVE selection button -----------------------------------------
function rel_mu(){

  TIME.rel = !TIME.rel //toggle
  relative_sel();

}

function relative_sel(){

  if (TIME.rel) {                                               // ON

    // Disable absolute from & to date
    to.prop('disabled',true)
    fr.prop('disabled',true)

    // Enable Lookback input field & realtime button
    lb.prop('disabled',false)
    rt.prop('disabled',false)

    // Show only active button
    oa.removeClass('hidden')

    // Only on exernal function call
    if (!rel.hasClass('clicked')){
      btn_on_style(rel)
    }

  } else {                                                     // OFF

    // Enable absolute from & to date
    to.prop('disabled',false)
    fr.prop('disabled',false)

    // Disable Lookback input field & realtime button
    lb.prop('disabled',true)
    rt.prop('disabled',true); reset_rt();

    // Hide only active button and set to false
    oa.addClass('hidden')
    fltrSet('only', 'active', false)

    // Apply off style to buton
    btn_off_style(rel)

  }

}


// REALTIME selection button -----------------------------------------
function rt_mu(){

  TIME.rt = !TIME.rt // Toggle
  realtime_sel()

}

function realtime_sel(){

  if (TIME.rt) {

    // Set Get data button caption
    GD.val('GET DATA (realtime)')

    // Only on exernal function call
    if (!rt.hasClass('clicked')){ btn_on_style(rt) }

  } else {

    reset_rt()

  }

}

// reset RT when: RT off, Relative off
function reset_rt(){

  // Set Get data button caption to default and enable
  GD.val('GET DATA').prop('disabled',false)

  TIME.rt = false; // set realtime to false
  btn_off_style(rt) // set buton off style

}


// GET DATA  button --------------------------------------------------
$('#get_data').click(function(){
  if($('#get_form')[0].checkValidity()){
    GET()
  } else {
    btn_off_style(this)
  };
})






// STATION BUTTONS -----------------------------------------------------------//

$('.ssel_btn').mouseup(stn_all_mu)

$(document).ready(all_stns_caption)

// Select single station button --------------------------------------
// - mouse_up trigger in -stations.js because html is created there
function sel_stn(){

  //Split glass_btn id in ZONE_STATION
  var part = $(this).attr('id').split('_')

  //Set button with reverse selected state
  stnSet(part[0],part[1],!TIA_GC[part[0]][part[1]].sel)

}

// Select complete zone button ---------------------------------------
// - mouse_up trigger in -stations.js because html is created there
function sel_zone(){

  var one_sel = false

  //Split zone title id to get zone (ZONE*_name)
  var part = $(this).attr('id').split('_')

  //Check if one is selected in TIA_GC object
  for (var stn in TIA_GC[part[0]]) {
    if (TIA_GC[part[0]].hasOwnProperty(stn)) {

      var sel = TIA_GC[part[0]][stn].sel
      if(sel) {one_sel = true; break; }; // if one true set true & break

    }
  }

  // Set all station of zone to inverse state of one_sel
  // - if one is selected all will be false
  // - if none are selected all will be true
  for (var stn in TIA_GC[part[0]]) {
    stnSet(part[0],stn,!one_sel)
  }

}


// Select ALL stations button ----------------------------------------
function stn_all_mu(){

  // get all or none sring from btn id
  var s = $(this).attr('id').replace('stn_',''); var b;

  // if its all bool is true
  if (s == 'all') { b = true } else { b = false}

  for (var zone in TIA_GC) {
    if (TIA_GC.hasOwnProperty(zone)) {

      for (var stn in TIA_GC[zone]) {
        if (TIA_GC[zone].hasOwnProperty(stn)) {

          stnSet(zone,stn,b) // set all according to b

        }
      }
    }
  }

  btn_off_style(this) // set button style to off when complete

}


// Global station set function (zone, station, boolean value) --------
function stnSet(zone,stn,b){

  // ignore from ZONE: _active
  if (stn.search('_') > -1) {return;}

  // Only set selected state when the station is active
  var act = TIA_GC[zone][stn].active
  if(act) { TIA_GC[zone][stn].sel = b}

  // Set elemen lement for style
  var el = $('#' + zone + '_' + stn + '_stnbtn')

  // Selected & Active = true -> Add on style
  if(b && act){ el.addClass('sel') } else { el.removeClass('sel') }

  // check if all stations caption has to be applied
  all_stns_caption();

}


// Caption to indicate all stations alarms will be imported when
// no stations are selected
function all_stns_caption(){

  var all_false = true

  // Check if all station buttons selected values are false
  for (var zone in TIA_GC) {
    if (TIA_GC.hasOwnProperty(zone)) {

      for (var stn in TIA_GC[zone]) {
        if (TIA_GC[zone].hasOwnProperty(stn)) {

          if (TIA_GC[zone][stn].sel) {all_false = false; break;}

        }
      }
    }
  }

  // Aplly or remove caption
  if (all_false) { $('#stns_header').addClass('all') }
  else $('#stns_header').removeClass('all')

}




// FILTERS -------------------------------------------------------------------//

// Mouse up actions
$('#filters .glass_btn').mouseup(filters_mu)
$('#filters .fsel_btn').mouseup(fltr_res_none)
$('#filters .item_title.active').mouseup(sel_type)

// Default filter values ---------------------------------------------
var FILTERS_def = function() {
  return {
    only: {
      active: false,
    },
    sev: {
      A: true, B: true, C: true, D: true, E: false,
    },
    at: {
      general: true, safety: true, interlock: true,
      autonotstarted: true, manual: true, formatnok: true,
      alarm: true,

      resseq: true,
    },
    prod: {
      general: true, inout: true, andon: true, controlroom: true,
    },
  }
}

var FILTERS = FILTERS_def() //Set object to default structure on load

//triggered in load session
function default_fltr(){

  // Set FILTERS to default
  FILTERS = FILTERS_def()

  // Apply style (and set again)
  for (var type in FILTERS) {
    if (FILTERS.hasOwnProperty(type)) {
      for (var sub in FILTERS[type]) {
        if (FILTERS[type].hasOwnProperty(sub)) {
          fltrSet(type, sub, FILTERS[type][sub])
        }
      }
    }
  }
}


// Set single filter button -------------------------------------------
function filters_mu(){

  // Split buton id (sev_A)
  var part = $(this).attr('id').split('_')
  // Set inverse state
  fltrSet(part[0], part[1], !FILTERS[part[0]][part[1]])

}


// Select none or reset fiiters button -------------------------------
function fltr_res_none(){

  // get res or none sring from btn id
  var s = $(this).attr('id').replace('fltr_',''); var b;

  if (s == 'res') {
    default_fltr(); btn_off_style(this); return; // Reset filters & return
  } else {
    b = false // set false and continue
  }

  // Set all filers to b value (false in this case)
  for (var type in FILTERS) {
    if (FILTERS.hasOwnProperty(type)) {
      for (var sub in FILTERS[type]) {
        if (FILTERS[type].hasOwnProperty(sub)) {
          fltrSet(type, sub, b)
        }
      }
    }
  }

  btn_off_style(this) // Set button style to off

}


// Select all or none by type title ----------------------------------
function sel_type(){

  var one_sel = false

  //Split filter title id to get type (sev_title)
  var part = $(this).attr('id').split('_')

  // Check if all filter button values are false
  for (var sub in FILTERS[part[0]]) {
    if (FILTERS[part[0]].hasOwnProperty(sub)) {
      if(FILTERS[part[0]][sub]) {one_sel = true; break; };
    }
  }

  // Set all filters of type to inverse state of one_sel
  // - if one is selected all will be false
  // - if none are selected all will be true
  for (var sub in FILTERS[part[0]]) {
    fltrSet(part[0], sub, !one_sel)
  }

}

// Global filter set function (zone, station, boolean value) --------
function fltrSet(type,sub, b){

  // Set value
  FILTERS[type][sub] = b

  // Set style
  if(FILTERS[type][sub]){
    $('#' + type + '_' + sub).addClass('sel')
  } else {
    $('#' + type + '_' + sub).removeClass('sel')
  }

  // Check if all severity caption has to be applied
  all_sev_caption()

}

// Caption to indicate all severity alarms will be imported when
// no severities are selected
function all_sev_caption(){

  var all_false = true

  // Check if all severity buttons are false
  for (var sev in FILTERS.sev) {
    if (FILTERS.sev.hasOwnProperty(sev)) {
      if (FILTERS.sev[sev]) {all_false = false; break;}
    }
  }

  // Aplly or remove caption
  if (all_false) { $('#sev_title').addClass('all') }
  else $('#sev_title').removeClass('all')

}

// COLLAPSE ------------------------------------------------------------------//
$('.control-group-header').click(collapseGroup)

function collapseGroup(){

  console.log('clickske zi');

  var el = $(this).parent()

  if(el.attr('class').search('collapse') > -1){
    el.removeClass('collapse')
  } else {
    el.addClass('collapse')
  }

  table.headsize()

}
