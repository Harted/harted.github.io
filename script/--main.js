// Body load ready (set on body in index.html) ---------------------------------
function ready(){

  getStations();

}

function stationsReady(){

  loadSession();

  GET(true);

}

// GLOBAL alarms & table variables ---------------------------------------------
var alarms, table, stored_settings

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

  if(get_busy){ return; }

  get_busy = true

  var timer = new Date()

  if (!TIME.rt) {
    $('.table-body').removeClass('loaded').addClass('loading')
  }

  updateAX();

  // AJAX
  $.ajax(ajax_s_home())

  .fail(function() {                                                  // FAIL

    console.log("Ajax: error")

    $('.fade').css({'opacity': 1});
    $('.fade_reverse').css({'opacity': 0});

    style_mu($('#get_data'))
    get_busy = false

  })

  .done(function(data) {                                              // SUCCES

    console.log("Ajax: succes");

    pushState(init);
    setAlarms(data); // fill alarm object
    setTable(); // init table based on alarms

    if (!TIME.rt) {
      $('.table-body').addClass('loaded')
    }


    responsive(); // set table and page sizes
    if (!TIME.rt){ // apply table filer
      tableFilter();
      $('.th-overlay').removeClass('hidden')
    } else {
      $('.th-overlay').addClass('hidden')
    }

    $('.fade').css({'opacity': 1});
    $('.fade_reverse').css({'opacity': 0});

    if (TIME.rt) {
      get_busy = false
      GD.val('GET DATA ('+ (new Date() - timer) + 'ms)')
      .prop('disabled',true)
      GET()
      return;
    }

    style_mu($('#get_data'))
    get_busy = false

  });
}



// AJAX PARAM object -----------------------------------------------------------
var ax = {
  rel: false,
  stn: [], stn_str: function(){ return this.stn.join(':')},
  sev: [], sev_str: function(){ return this.sev.join(':')},
  lbt: 1, lbt_str: function(){ return this.lbt + '/1440'},
  sta: '', sta_str: function(){ return this.sta.replace('T',' ')},
  end: '', end_str: function(){ return this.end.replace('T',' ')},
}


// UPDATE param object
function updateAX(){

  ax.stn = []
  ax.sev = []

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

  for (var sev in FILTERS.sev) {

    if (FILTERS.sev[sev]) {
      ax.sev.push(sev)
    }
  }

  ax.rel = TIME.rel
  ax.lbt = TIME.lbt();
  ax.sta = TIME.sta();
  ax.end = TIME.end();

}


// COPY Session
$('#volvo_logo').click(copySession)




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

function copySession(){

  var url = '/?' + btoa(JSON.stringify(curSet()))

  history.pushState(curSet(),'',url)

}



function pushState(init){

  newstate = JSON.stringify(curSet())
  oldstate = JSON.stringify(window.history.state)

  if(!TIME.rt && !popper && !init && !(newstate == oldstate)) {
    console.log('history pushed!')
    history.pushState(curSet(),'','')
  }

  popper = false;

}


var popper = false

window.onpopstate = function(event){
  console.log('POP!!!');
  popper = true;
  loadSession();
  GET();
}


function loadSession(){

  var session

  if (window.location.search.length > 0){
    console.log('From string:')
    session = JSON.parse(atob(window.location.search.substring(1)))
    history.pushState(session,'','/')
  } else if (window.history.state != null){
    console.log('From history:')
    session = window.history.state
  }

  console.log(session);

  if (session != undefined) {

    var ST = session.TIA_GC
    var FI = session.FILTERS
    var TI = session.TIME

    // stations
    for (var zone in ST) {
      if (ST.hasOwnProperty(zone)) {

        for (var stn in ST[zone]) {
          if (ST[zone].hasOwnProperty(stn)) {

            stnSet(zone,stn,ST[zone][stn].sel)

          }
        }
      }
    }


    // Filters
    for (var type in FI) {
      if (FI.hasOwnProperty(type)) {

        for (var sub in FI[type]) {
          if (FI[type].hasOwnProperty(sub)) {

            FILTERS[type][sub] = FI[type][sub]
            fltrSet(type,sub,FI[type][sub])

          }
        }
      }
    }

    // Time
    TIME.rel = TI.rel; relative_sel();
    TIME.rt = TI.rt; realtime_sel();
    lb.val( TI.lbt )
    fr.val( TI.sta )
    to.val( TI.end )

  } else {

    console.log('Set default')

    // stations
    for (var zone in TIA_GC) {
      if (TIA_GC.hasOwnProperty(zone)) {

        for (var stn in TIA_GC[zone]) {
          if (TIA_GC[zone].hasOwnProperty(stn)) {

            stnSet(zone,stn,false)

          }
        }
      }
    }

    default_fltr();
    dt_clear();

    TIME.rel = false; relative_sel();
    TIME.rt = false; realtime_sel();

    lb.prop('disabled',true)
    rt.prop('disabled',true)

  }

}

$('#alfa_logo').click(reset_history)

function reset_history(){

  if(window.history.state != null) {
    console.log('Resettet!')
    history.pushState(null,'','')
    popper = true;
    loadSession();
    GET();
  } else {
    alert('already reset')
  }

}













  // Less finished ---------------------------------------------------------------
  less.pageLoadFinished.then(
    function() {

      $('.fade_less').css('opacity', 1);
    }
  );
