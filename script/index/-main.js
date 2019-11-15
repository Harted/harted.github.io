// Scripts loaded & ready (--script.js )----------------------------------------
function ready(){

  //busyChanges();
  getStations();

}

// When stations are fetched
function stationsReady(){

  loadSession(); // load default, history or link session
  GET(true); // GET data from database (INIT)

}

// Index specific onresize -----------------------------------------------------
window.onresize = function(event){
  if( tableready ){ responsive() };
};

// Responsive on resize
function responsive(){flex(); table.headsize()};



// AJAX SETTINGS ---------------------------------------------------------------
function ajax_s() {

  var loc = window.location.host

  if(
    loc == 'harted.github.io' || loc == 'localhost:8000'
  ){

    //Remote settings (data sample)
    return {
      url: 'https://www.harted.be/php/alarmdata2.php',
      type: "GET",
      cache: false,
      dataType: "json",
    }

  }

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


function GET_init(){

  statusFields('Geting Data', 'loading') // Set status fields

  // Fade out table body (not on realtime)
  if (!TIME.rt) {
    $('.table-body').removeClass('loaded').addClass('loading')
  }

  updateAX(); // Update ajax parameter data

  //Clear timeline stack
  if (timelineStack.length > 0) {console.log('timelineStack CLEARED!');}
  for (var j = 0; j < timelineStack.length; j++) {
    clearTimeout(timelineStack[j])
  }; timelineStack = [];

  for (var j = 0; j < asyncStack.length; j++) {
    clearTimeout(asyncStack[j])
  }; asyncStack = [];

  // Hide overview
  $('#overview-container').removeClass('visible');
  tog.overview = false;
  btn_off_style($('#showoverview'))


  return new Date();


}

function realtime(timer){

  // REALTIME
  if (!TIME.rt){ // apply table filer

    tableFilter(); // create table filter
    $('.th-overlay').removeClass('hidden') // Unhide th overlay (table filter)
    $('.table-body').addClass('loaded') // Fade in table body

  } else if (TIME.rt) {

    get_busy = false // Set get_busy short on false
    // Otherwise GET will not fire again (see first line GET())

    // Show refresh rate and disable get button
    GD.val('GET DATA ('+ (new Date() - timer) + 'ms)').prop('disabled',true)

    $('.th-overlay').addClass('hidden') // Hide th overlay (table filter)

    GET() // FIRE GET again (LOOP)

    return;
  }

}



// GET FUnction  ---------------------------------------------------------------
var get_busy = false

function GET(init){

  // Don't execute when busy - when not busy set true
  if(get_busy){return false;}; get_busy = true

  var timer = GET_init();

  // AJAX ------------------------------------------------------------
  $.ajax(ajax_s())

  .fail(function() {                                                  // FAIL

    console.log("Data: error")

    statusFields('Failed, try again', 'fail')

    if (TIME.rt) { reset_rt(); } // Reset realtime on error
    btn_off_style($('#get_data')) // Set Get data buton style off
    get_busy = false // Set busy false

  })

  .done(function(data) {                                              // SUCCES

    console.log("Data: succes");

    pushState(init); // push history state

    console.time('Alarms')

    Alarms(data, afterAlarms, timer, init, this); // fill alarm object

    function afterAlarms(timer, init){

      console.timeEnd('Alarms')

      setTable(); // init table based on alarms

      responsive(); // set table and page sizes

      realtime(timer); // realitme or not

      if (init) {loadFade()} // fade on load

      btn_off_style($('#get_data')) // Set Get data buton style off

      get_busy = false // Set busy false

      statusFields('', '')

      if(!TIME.rt) {createOverview();}

    }
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




// Temp live test
$('#controllogo div').click(LIVE)

function LIVE(){
  var origin = window.location.origin
  var url = '/live.html?' + encodeURI(JSON.stringify(new CurrentSet(true)))

  window.location = origin + url
}



function busyChanges(){
  if(!(window.location.hostname == 'localhost')){
    window.alert(
      "Bezig met aanpassingen...\nInterface werkt mogelijks niet naar behoren!"
    )
  }
}
