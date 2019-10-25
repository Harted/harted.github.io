// GET Stations from database (ALARMSOURCE) ------------------------------------

function getStations(){

$('#load_status').html('<span class="loading">Connecting to database</span>')

$.ajax({
  url: '/script/ajax.php',
  type: 'GET',
  cache: false,
  dataType: 'json',
  data: {'stations':''}
})
.done(function(received) { setActiveStn(received);})
.fail(function() {
  $('#load_status').html('<span class="fail">Woops &#128579 Something went wrong!</span>')
  console.log("Stations: error");
})



// Sample for home
// setActiveStn([['CSR266'],['CLF2028'],['CLF2029'],['CHL2922'],['CCP2222'],['CMP305'],['CMP306'],['CMP310'], ['CMP311'],['CLF3037']])

}


// Set active true with found stations -----------------------------------------
function setActiveStn(stn_arr, buttons){

  // Convert received multidimensional array in single dimension
  for (var i = 0; i < stn_arr.length; i++) {
    stn_arr[i] = stn_arr[i][0]
  }

  // Set zone active if found in array
  for (var zone in TIA_GC) {
    if (TIA_GC.hasOwnProperty(zone)) {

      var zone_active = false // var for complete zone active

      for (var station in TIA_GC[zone]) {
        if (TIA_GC[zone].hasOwnProperty(station)) {

          if (stn_arr.indexOf(station) > -1){
            TIA_GC[zone][station].active = true ; // set true if included
            stn_arr.splice(stn_arr.indexOf(station),1) // remove from array
            zone_active = true // zone is active when one station is
          }

          // set zone selected default to false
          TIA_GC[zone][station].sel = false ;

        }
      }

      // set zone active after looped through zone
      TIA_GC[zone]._active = zone_active

    }
  }

  // if there are still stations in the array add to OTHER
  if (stn_arr.length > 0) {
    for (var i = 0; i < stn_arr.length; i++) {
      TIA_GC.OTHER[stn_arr[i]] = {active:true,};
    }
  }


  stnBtns(TIA_GC) // Make and output HTML


}

function stnBtns(stns) {

  for (var zone in stns) {

    var s = '' // string to add html (for every zone seperately)

    if (stns.hasOwnProperty(zone)) {

      // set zone item title
      s += '<span id="' + zone + '_name" class="item_title '

      // set active when active to show (otherwise hide)
      if(stns[zone]._active) { s += 'active '}

      // replace caps with nice word :)
      s += '">' + zone.replace('ZONE','Zone ') + '</span>'

      // make buttons for every station in the zone
      for (var stn in stns[zone]) {
        if (stns[zone].hasOwnProperty(stn)) {

          if(stn.search('_') < 0){ // ignore zone _active

            // set id (ZONE*_STATION) and glass_btn class
            s += '<div id="' + zone + '_' + stn + '_stnbtn" class="glass_btn '

            // set active to show (otherwise hide)
            if (stns[zone][stn].active) { s += 'active ' }

            // set title to show station name on hover
            s += '" title="' + stns[zone][stn].name

            // set button caption
            s += '">' + stn + '</div>'

          }
        }
      }

      $('#' + zone).html(s); // output zone html

    }
  }

  // button mouseup actions
  $('#sel_stations .glass_btn.active').mouseup(sel_stn)
  $('#sel_stations .item_title').mouseup(sel_zone)

  stationsReady(); // to start GET() on load after stations are fetched

}
