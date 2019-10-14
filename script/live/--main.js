// Body load ready (set on body in live.html) ---------------------------------
function ready(){
  loadSession();
  GET();
}

var FILTERS = {}

var TIME = {
  rel: true,
}

// Load session (load default, pushed state or state from URL) -------
function loadSession(){

  var session // var to read the state

  if (window.location.search.length > 0){                         // FROM URL
    session = JSON.parse(atob(window.location.search.substring(1)))
    history.pushState(session,'','/live.html')
  } else if (window.history.state != null){                       // FROM STATE
    session = window.history.state
  }

  if (session != undefined) { // FROM URL or STATE (so.. defined)

    ST = session.TIA_GC // get stations from session
    FI = session.FILTERS // get filters from session

    // Set TIA_GC from what was saved +++++
    // - it's a for loop to not ovewrite names for example
    for (var zone in ST) {
      if (ST.hasOwnProperty(zone)) {

        var one_sel = false

        for (var stn in ST[zone]) {
          if (ST[zone].hasOwnProperty(stn)) {
            if (stn.search('_') < 0) { //ignore zone active
              TIA_GC[zone][stn].active = ST[zone][stn].active
              TIA_GC[zone][stn].sel = ST[zone][stn].sel

              if(ST[zone][stn].sel){one_sel = true}

            } else {
              TIA_GC[zone][stn] = ST[zone][stn] // set zone active
            }
          }
        }

        TIA_GC[zone]._selected = one_sel

      }
    }


    // Check none selected -> Then all selected
    var one_zone_selected = false

    for (var zone in TIA_GC) {
      if (TIA_GC[zone].hasOwnProperty(['_selected'])) {
        if (TIA_GC[zone]._selected) {one_zone_selected = true};
      }
    }

    if (!one_zone_selected) {
      for (var zone in TIA_GC) {
        if (TIA_GC[zone].hasOwnProperty(['_selected'])) {
          TIA_GC[zone]._selected = true;
        }
      }
    }

    // Set FILTERS from what was saved +++++
    for (var type in FI) {
      if (FI.hasOwnProperty(type)) {

        FILTERS[type] = {}

        for (var sub in FI[type]) {
          if (FI[type].hasOwnProperty(sub)) {

            FILTERS[type][sub] = FI[type][sub]

          }
        }
      }
    }

  }

}


// AJAX SETTINGS ---------------------------------------------------------------
function ajax_s() {

  return {
    url: '/script/ajax.php',
    type: "GET",
    cache: false,
    dataType: "json",
    data: {
      rel: true,
      stn: ax.stn_str(),
      sev: ax.sev_str(),
      lbt: 1,
      sta: '',
      end: '',
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



function GET(){

  var timer = new Date() // Init time for refresh rate

  updateAX();

  $.ajax(ajax_s())
  .done(function(data) {

    setAlarms(data);
    checkActive()

    document.title = 'L I V E - '+ (new Date() - timer) + 'ms'

    GET()

  })
  .fail(function() {
    console.log("error");
  });


  loadFade();


}


var ax = {
  stn: [], stn_str: function(){ return this.stn.join(':')},
  sev: [], sev_str: function(){ return this.sev.join(':')},
}

// UPDATE param object -----------------------------------------------
function updateAX(){

  // Reset station and severity array
  ax.stn = []
  ax.sev = []

  // Add selected stations to array
  for (var zone in ST) {
    if (ST.hasOwnProperty(zone)) {
      for (var stn in ST[zone]) {
        if (ST[zone].hasOwnProperty(stn)) {
          if (ST[zone][stn].sel) {
            ax.stn.push(stn)
          }
        }
      }
    }
  }

  // Add selected severities to array
  for (var sev in FI.sev) {
    if (FI.sev[sev]) {
      ax.sev.push(sev)
    }
  }
}








var active

function checkActive(){

  active = []

  for (var i = 0; i < alarms.length; i++) {
    if (alarms[i]._active){
      active.push(alarms[i])
    }
  }

  // Set stations with for loop to not overwrie names
  for (var zone in TIA_GC) {
    if (TIA_GC.hasOwnProperty(zone)) {
      for (var stn in TIA_GC[zone]) {
        if (TIA_GC[zone].hasOwnProperty(stn)) {
          TIA_GC[zone][stn].active_alarms = []
        }
      }
    }
  }

  for (var i = 0; i < active.length; i++) {

    var zone = active[i]._zone
    var stn = active[i].station

    TIA_GC[zone][stn].active_alarms.push(active[i])

  }

  var html = ''

  // Set stations with for loop to not overwrie names
  for (var zone in TIA_GC) {
    if (TIA_GC.hasOwnProperty(zone)) {

      if (TIA_GC[zone]._active && TIA_GC[zone]._selected ) {
        html += '<div class="zonebox"><span>'
        html += zone.replace('ZONE','Zone ')
        html += '</span>'
      }

      for (var stn in TIA_GC[zone]) {
        if (TIA_GC[zone].hasOwnProperty(stn)) {

          if (stn.search('_') < 0) { //ignore zone active

            if (TIA_GC[zone][stn].active_alarms.length > 0) {
              html += '<div class="stationbox"><span>' + stn
              html += ' - ' + TIA_GC[zone][stn].name + '</span>'
            }

            for (var i = 0; i < TIA_GC[zone][stn].active_alarms.length; i++) {

              var alarm =
              '<span>' + TIA_GC[zone][stn].active_alarms[i].severity + ' |</span>'



              if (TIA_GC[zone][stn].active_alarms[i]._type == 'formatnok') {

                alarm +=
                '<span>' + TIA_GC[zone][stn].active_alarms[i]._var + '</span>'

              } else {

                alarm +=
                '<span>' + TIA_GC[zone][stn].active_alarms[i].zone + ' |</span>'
                + '<span>' + TIA_GC[zone][stn].active_alarms[i].object + ' |</span>'
                + '<span>' + TIA_GC[zone][stn].active_alarms[i].comment + '</span>'

              }



              html += '<div class="alarmrow '
              html += TIA_GC[zone][stn].active_alarms[i].severity + ' '
              html += TIA_GC[zone][stn].active_alarms[i]._type
              html += '">'
              html += alarm + '</div>'

            }

            if (TIA_GC[zone][stn].active_alarms.length > 0) {
              html += '</div>'
            }

          }
        }
      }

      if (TIA_GC[zone]._active && TIA_GC[zone]._selected ) {
        html += '</div>'
      }


    }
  }

  $('#flex-container').html(html)





}



$('#alfa_logo').click(function(){
  window.location = 'http://10.249.67.154'
})
