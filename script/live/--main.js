// Body load ready (set on body in live.html) ---------------------------------
function ready(){
  loadSession();
  loadFade();
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

    var ST = session.TIA_GC // get stations from session
    var FI = session.FILTERS // get filters from session
    var TI = session.TIME // get time from session

  }

  console.log(ST,FI,TI)

}
