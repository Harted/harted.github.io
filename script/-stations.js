TIA_GC = {
  ZONE1: {
    CLF260: { active: false, name: 'Bodybuffer' },
    CLF280: { active: false, name: 'Doorline Assembly' },
    CLF285: { active: false, name: 'Doorline Buffer' },
    CSR2264: { active: false, name: 'Backup Panoroof CMA' },
    CSR2364: { active: false, name: 'Manual Panoroof SPA' },
    CSR265: { active: false, name: 'Sealing' },
    CSR266: { active: false, name: 'Fitting Panoroof 1' },
    CSR267: { active: false, name: 'Fitting Panoroof 2' },
    CMKE2100: { active: false, name: 'Bottom Cable Furnace' },
    CLF2028: { active: false, name: 'Pretrim 1' },
    CLF2029: { active: false, name: 'Pretrim 2' },
    CHL2922: { active: false, name: 'Headlining' },
    CDU220: { active: false, name: 'Robot Driving Unit' },
    CLF248: { active: false, name: 'Buffer to PT5' },
    CCP222: { active: false, name: 'Cockpit conveyor' },
    CCP2222: { active: false, name: 'Cockpit pre-assembly' },
  },
  ZONE2: {
    CMP305: { active: false, name: 'Wedding CMA/SPA' },
    CMP306: { active: false, name: 'Bolting CMA/SPA' },
    CMP310: { active: false, name: 'Bolt repair / Engine Bay' },
    CMP311: { active: false, name: 'Divorce' },
    CLF2000: { active: false, name: 'BAX' },
    CLF2030: { active: false, name: 'Rear wheel unit' },
    CLF4000: { active: false, name: 'FAX' },
    CLF4030: { active: false, name: 'Front suspension' },
    CLF3037: { active: false, name: 'Palletline 1' },
    CLF3038: { active: false, name: 'Palletline 2' },
  },
  ZONE3: {
    CPU445: { active: false, name: 'PUR Panoroof' },
    CPU446: { active: false, name: 'PUR Glazing' },
    CPU447: { active: false, name: 'PUR Backup' },
    CLF448: { active: false, name: 'PUR Conveyor' },
    CVU462: { active: false, name: 'Brake Filling L' },
    CVU463: { active: false, name: 'Brake Filling R' },
    CVU465: { active: false, name: 'UREA' },
    CHSC810: { active: false, name: 'High Store IN' },
    CHSC811: { active: false, name: 'High Store OUT' },
  },
  ZONE4: {
    CBA4100: { active: false, name: 'Wheelshuttle' },
    CLF520: { active: false, name: 'Final 2' },
    CBU1001: { active: false, name: 'Bumper Connection' },
    CBU1002: { active: false, name: 'Bumper Assembly' },
  },
  OTHER: {},
}


// GET Stations from database (ALARMSOURCE) ------------------------------------

function getStations(){

  $.ajax({
    url: '/script/ajax.php',
    type: 'GET',
    cache: false,
    dataType: 'json',
    data: {'stations':''}
  })
  .done(function(received) { setActiveStn(received);})
  .fail(function() { console.log("Ajax: stations: error");})


// Sample for home
// setActiveStn([['CSR266'],['CLF2028'],['CLF2029'],['CHL2922'],['CCP2222'],['CMP305'],['CMP306'],['CMP310'], ['CMP311'],['CLF3037']])

}


// Set active true with found stations -----------------------------------------
function setActiveStn(stn_arr){

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

          if (stn_arr.includes(station)){
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
