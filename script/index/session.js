// SESSION SAVE AND HISTORY ----------------------------------------------------
$('#volvo_logo img').click(copySession) // COPY Session
$('#alfa_logo').click(state_default) // Set default state


// copySession -------------------------------------------------------
function copySession(){

  var url = '/?' + encodeURI(JSON.stringify(new CurrentSet(true)))
  history.pushState(new CurrentSet,'',url)

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
  newstate = JSON.stringify(new CurrentSet)
  oldstate = JSON.stringify(window.history.state)

  // DON'T push state when:
  // - Realtime is Active
  // - A pop event is fired (state is already in history)
  // - On init (function argument)
  // - If new and old state are the same
  if(!TIME.rt && !popper && !init && !(newstate == oldstate)) {
    console.log('History saved!')
    history.pushState(new CurrentSet,'','')
  }

  popper = false; // Reset popper

}



// Load session (load default, pushed state or state from URL) -------
function loadSession(){

  var session // var to read the state

  if (window.location.search.length > 0){                         // FROM URL

    session = JSON.parse(decodeURI(window.location.search.substring(1)))
    session = new fromCurrentSet(session);
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
