function ready(){
  loadSession();
  GET();
}

var TIME = {
  rel: true,
}

// Load session (load default, pushed state or state from URL) -------
function loadSession(){

  var session // var to read the state

  if (window.location.search.length > 0){                         // FROM URL

    session = JSON.parse(decodeURI(window.location.search.substring(1)))
    session = new fromCurrentSet(session);
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
              TIA_GC[zone][stn].active = ST[zone][stn].sel
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
          for (var stn in TIA_GC[zone]) {
            if (TIA_GC[zone][stn].hasOwnProperty('sel')) {
              TIA_GC[zone]._selected = true;
            }
          }
        }
      }
    }

    // Set FILTERS from what was saved +++++
    for (var type in FI) {
      if (FI.hasOwnProperty(type)) {

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
      lbt: 1/3,
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

    Events(data, afterEvents, timer, false, this);

    function afterEvents(timer, init){

      checkActive(EVENTS.all)

      var status = (new Date() - timer) + 'ms'

      if (pauze) { status = 'Pauzed'}

      document.title = 'L I V E - ' + status
      $('#foot_status span').text( 'Update: ' + status)

      if(!pauze) {GET()}

    }


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

function checkActive(alarms){

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
    var vari = active[i]._var

    setIgn(zone,stn);

    if (!(ignored[zone][stn].indexOf(vari) > -1)) {

      TIA_GC[zone][stn].active_alarms.push(active[i])

    }

  }

  var html = ''

  // Set stations with for loop to not overwrie names
  for (var zone in TIA_GC) {
    if (TIA_GC.hasOwnProperty(zone)) {

      if (TIA_GC[zone]._selected ) {
        html += '<div id="' + zone + '" '
        html += 'class="zonebox"><span>'
        html += zone.replace('ZONE','Zone ')

        if (ignLen(zone) > 0) {
          html += ' (ignored:' + ignLen(zone) + ')'
        }

        html += '<span class="reset_ignored">reset</span></span>'
      }

      for (var stn in TIA_GC[zone]) {
        if (TIA_GC[zone].hasOwnProperty(stn)) {

          if (stn.search('_') < 0) { //ignore zone active

            if (TIA_GC[zone][stn].active_alarms.length > 0) {
              html += '<div id="' + stn + '" '
              html += 'class="stationbox"><span>' + stn
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
              html += alarm

              html += '<div class="ignore" title="ignore" '
              html += 'var="' + TIA_GC[zone][stn].active_alarms[i]._var + '">'
              html += '</div>'

              html += '<span class="duration">'
              html += TIA_GC[zone][stn].active_alarms[i]._durtxt
              html += '</span>'

              html += '</div>'

            }

            if (TIA_GC[zone][stn].active_alarms.length > 0) {
              html += '</div>'
            }

          }
        }
      }

      if (TIA_GC[zone]._selected ) {
        html += '</div>'
      }


    }
  }

  $('#flex-container').html(html)

  $('.ignore').click(ignore)
  $('.reset_ignored').click(resetig)

}



$('#alfa_logo').click(function(){
  window.location = window.location.origin
})





var ignored = {}

function setIgn(zone,stn){

  if (ignored[zone] == undefined){
    ignored[zone] = {}
  }

  if (ignored[zone][stn] == undefined){
    ignored[zone][stn] = []
  }

}

function ignLen(zone){

  var len = 0

  for (var stn in ignored[zone]) {
    if (ignored[zone].hasOwnProperty(stn)) {

      len += ignored[zone][stn].length

    }
  }

  return len

}


function ignore(){

  var ignr = $(this).attr('var');
  var stn = $(this).parents().eq(1).attr('id');
  var zone = $(this).parents().eq(2).attr('id');

  setIgn(zone,stn);

  if (!(ignored[zone][stn].indexOf(ignr) > -1)){
    ignored[zone][stn].push(ignr)
  }

  console.log(ignored)

  $(this).parent().addClass('hidden')
}



function resetig(){

  var zone = $(this).parents().eq(1).attr('id')

  ignored[zone] = {}

  console.log(ignored)

}



$('#pauze').click(pauzen)

var pauze = false
var pauze_icon = ''

function pauzen(){
  pauze = !pauze

  if (!pauze) {
    $(this).text('\u275A\u275A').removeClass('pauzed')
    GET()
  } else {
    $(this).text('\u25ba').addClass('pauzed')

  }
}
