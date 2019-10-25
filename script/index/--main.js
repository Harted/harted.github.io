// Temp live test
$('#controllogo div').click(LIVE)

function LIVE(){
  var origin = window.location.origin
  var url = '/live.html?' + btoa(JSON.stringify(curSet()))

  window.location = origin + url
}


// Body load ready (set on body in index.html) ---------------------------------
function ready(){
  getStations();

  if(!(window.location.hostname == 'localhost')){
    window.alert("Bezig met aanpassingen...\nInterface werkt mogelijks niet naar behoren!")
  }

}

// When stations are fetched
function stationsReady(){

  loadSession(); // load default, history or link session
  GET(true); // GET data from database

}

// Index specific onresize -----------------------------------------------------
window.onresize = function(event){
  if(tableready){responsive()};
};


// Responsive on resize
function responsive(){
  console.time('flex')
  flex();
  console.timeEnd('flex')
  console.time('headsize')
  table.headsize()
  console.timeEnd('headsize')
};



// AJAX SETTINGS ---------------------------------------------------------------
function ajax_s() {

  return {
    url: '/script/ajax.php',
    type: "GET",
    cache: false,
    dataType: "json",
    data: {
      rel: ax.rel,
      stn: ax.stn_str(),
      sev: ax.sev_str(),
      lbt: ax.lbt_str(),
      sta: ax.sta_str(),
      end: ax.end_str(),
    }
  }
}

function ajax_s_home(){
  return {
    url: 'https://www.harted.be/php/alarmdata.php',
    type: "GET",
    cache: false,
    dataType: "json",
  }
}



// GET FUnction  ---------------------------------------------------------------
var get_busy = false

function GET(init){

  if(get_busy){ return; } // Don't execute when already busy

  $('#load_status').html('<span class="loading">Getting data</span>')
  $('#ul_status span').text('Getting data...')

  get_busy = true // Set busy true

  var timer = new Date() // Init time for refresh rate

  // Fade out table body (not on realtime)
  if (!TIME.rt) {
    $('.table-body').removeClass('loaded').addClass('loading')
  }

  // Update ajax parameter data
  updateAX();

  // AJAX ------------------------------------------------------------
  $.ajax(ajax_s_home())

  .fail(function() {                                                  // FAIL

    console.log("Data: error")

    //loadFade(); // Fade in interface

      $('#load_status').html('<span class="fail">Woops &#128579 Something went wrong!</span>')

    if (TIME.rt) { reset_rt(); } // Reset realtime on error
    btn_off_style($('#get_data')) // Set Get data buton style off
    get_busy = false // Set busy false

  })

  .done(function(data) {                                              // SUCCES

    console.log("Data: succes");

    console.time('pushState')

    pushState(init); // push history state
    console.timeEnd('pushState')
    console.time('setAlarms')
    setAlarms(data); // fill alarm object
    console.timeEnd('setAlarms')
    console.time('setTable')
    setTable(); // init table based on alarms
    console.timeEnd('setTable')
    console.time('responsive')
    responsive(); // set table and page sizes
    console.timeEnd('responsive')

    // NOT REALTIME
    if (!TIME.rt){ // apply table filer

      tableFilter(); // create table filter
      $('.th-overlay').removeClass('hidden') // Unhide th overlay (table filter)
      $('.table-body').addClass('loaded') // Fade in table body

    }

    loadFade()

    // REALTIME loop
    if (TIME.rt) {

      get_busy = false // Set get_busy short on false
      // Otherwise GET will not fire again (see first line GET())

      // Show refresh rate and disable get button
      GD.val('GET DATA ('+ (new Date() - timer) + 'ms)').prop('disabled',true)

      $('.th-overlay').addClass('hidden') // Hide th overlay (table filter)

      GET() // FIRE GET again (LOOP)

      return;

    }

    btn_off_style($('#get_data')) // Set Get data buton style off
    get_busy = false // Set busy false

  });
}




// AJAX PARAM object -----------------------------------------------------------
// - Join Station and Severity array with :
// - Add /1440 to lookbackime (sql minutes)
// - Replace T with space for sql date format
var ax = {
  rel: false,
  stn: [], stn_str: function(){ return this.stn.join(':')},
  sev: [], sev_str: function(){ return this.sev.join(':')},
  lbt: 1, lbt_str: function(){ return this.lbt + '/1440'},
  sta: '', sta_str: function(){ return this.sta.replace('T',' ')},
  end: '', end_str: function(){ return this.end.replace('T',' ')},
}


// UPDATE param object -----------------------------------------------
function updateAX(){

  // Reset station and severity array
  ax.stn = []
  ax.sev = []

  // Add selected stations to array
  for (var zone in TIA_GC) {
    if (TIA_GC.hasOwnProperty(zone)) {
      for (var stn in TIA_GC[zone]) {
        if (TIA_GC[zone].hasOwnProperty(stn)) {
          if (TIA_GC[zone][stn].sel) {
            ax.stn.push(stn)
          }
        }
      }
    }
  }

  // Add selected severities to array
  for (var sev in FILTERS.sev) {
    if (FILTERS.sev[sev]) {
      ax.sev.push(sev)
    }
  }

  // Get time parameters from TIME object
  ax.rel = TIME.rel
  ax.lbt = TIME.lbt();
  ax.sta = TIME.sta();
  ax.end = TIME.end();

}





// SESSION SAVE AND HISTORY ----------------------------------------------------
$('#volvo_logo img').click(copySession) // COPY Session
$('#alfa_logo').click(state_default) // Set default state

// Return one object of TIA_GC, FILTERS & TIME objects
function curSet(){
  return {
    TIA_GC: TIA_GC,
    FILTERS: FILTERS,
    TIME: {
      rel: TIME.rel,
      rt: TIME.rt,
      lbt: TIME.lbt(),
      sta: TIME.sta(),
      end: TIME.end(),
    }
  }
}

// copySession -------------------------------------------------------
function copySession(){

  // Push link to URL bar to bookmark or copy
  var url = '/?' + btoa(JSON.stringify(curSet()))
  history.pushState(curSet(),'',url)

}

// Pop state ---------------------------------------------------------
// - When user presses back or forward in browser this generates a pop event

var popper = false // Global var set true when window popped

window.onpopstate = function(event){

  popper = true; // set to not store history on pop
  loadSession();
  GET();

}


// Push state function -----------------------------------------------
function pushState(init){

  // Set new and old state
  newstate = JSON.stringify(curSet())
  oldstate = JSON.stringify(window.history.state)

  // DON'T push state when:
  // - Realtime is Active
  // - A pop event is fired (state is already in history)
  // - On init (function argument)
  // - If new and old state are the same
  if(!TIME.rt && !popper && !init && !(newstate == oldstate)) {
    console.log('History saved!')
    history.pushState(curSet(),'','')
  }

  popper = false; // Reset popper

}



// Load session (load default, pushed state or state from URL) -------
function loadSession(){

  var session // var to read the state

  if (window.location.search.length > 0){                         // FROM URL
    session = JSON.parse(atob(window.location.search.substring(1)))
    history.pushState(session,'','/')
  } else if (window.history.state != null){                       // FROM STATE
    session = window.history.state
  }

  if (session != undefined) { // FROM URL or STATE (so.. defined)

    var ST = session.TIA_GC // get stations from session
    var FI = session.FILTERS // get filters from session
    var TI = session.TIME // get time from session

    // Set TIA_GC from what was saved +++++
    // - it's a for loop to not ovewrite names for example
    for (var zone in ST) {
      if (ST.hasOwnProperty(zone)) {
        for (var stn in ST[zone]) {
          if (ST[zone].hasOwnProperty(stn)) {

            stnSet(zone,stn,ST[zone][stn].sel)

          }
        }
      }
    }

    // Set FILTERS from what was saved +++++
    for (var type in FI) {
      if (FI.hasOwnProperty(type)) {
        for (var sub in FI[type]) {
          if (FI[type].hasOwnProperty(sub)) {

            fltrSet(type,sub,FI[type][sub])

          }
        }
      }
    }

    // set TIME and form values from what was saved +++++
    TIME.rel = TI.rel; relative_sel();
    TIME.rt = TI.rt; realtime_sel();
    lb.val( TI.lbt )
    fr.val( TI.sta )
    to.val( TI.end )

  } else {                                                        // DEFAULT

    // Set stations with for loop to not overwrie names
    for (var zone in TIA_GC) {
      if (TIA_GC.hasOwnProperty(zone)) {
        for (var stn in TIA_GC[zone]) {
          if (TIA_GC[zone].hasOwnProperty(stn)) {
            stnSet(zone,stn,false)
          }
        }
      }
    }

    default_fltr(); // Set default filters
    dt_clear(); // Set default time values

    TIME.rel = true; relative_sel(); // Relative true by defualt (15min)
    TIME.rt = false; realtime_sel(); // Realtime false by default

  }

}


// State default function ------------------------------------------------------
// - When in saved state function to reset state to default (click alfa logo)
function state_default(){

  if(window.history.state != null) {

    history.pushState(null,'','') // set history state to null
    loadSession(); // will be default because state = null
    GET(true);  // Get (init) - so history not gets pushed again

  } else {

    alert('Interface already in default state!')

  }

}
