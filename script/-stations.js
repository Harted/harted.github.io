TIA_GC = {
  ZONE1: {
    CLF260: { active: false, name: '' },
    CLF280: { active: false, name: '' },
    CLF285: { active: false, name: '' },
    CSR2264: { active: false, name: '' },
    CSR2364: { active: false, name: '' },
    CSR265: { active: false, name: '' },
    CSR266: { active: false, name: '' },
    CSR267: { active: false, name: '' },
    CMKE2100: { active: false, name: '' },
    CLF2028: { active: false, name: 'Pretrim 1' },
    CLF2029: { active: false, name: 'Pretrim 2' },
    CHL2922: { active: false, name: 'Headlining' },
    CDU220: { active: false, name: 'Dashboard' },
    CLF248: { active: false, name: '' },
    CCP222: { active: false, name: 'Cockpit line' },
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
    CPU445: { active: false, name: '' },
    CPU446: { active: false, name: '' },
    CPU447: { active: false, name: '' },
    CPU448: { active: false, name: '' },
    CVU462: { active: false, name: '' },
    CVU463: { active: false, name: '' },
    CVU465: { active: false, name: '' },
    CHSC810: { active: false, name: '' },
    CHSC810: { active: false, name: '' },
  },
  ZONE4: {
    CBA4100: { active: false, name: '' },
    CLF520: { active: false, name: '' },
    CBU1001: { active: false, name: '' },
    CBU1002: { active: false, name: '' },
  },
  OTHER: {},
}


// GET Stations from database (ALARMSOURCE) ------------------------------------

function getStations(){
//
//   $.ajax({
//     url: '/script/ajax.php',
//     type: 'GET',
//     cache: false,
//     dataType: 'json',
//     data: {'stations':''}
//   })
//   .done(function(received) { setActiveStn(received);})
//   .fail(function() { console.log("Ajax: stations: error");})
//

setActiveStn([['CSR266'],['CLF2028'],['CLF2029'],['CHL2922'],['CCP2222'],['CMP305'],['CMP306'],['CMP310'], ['CMP311'],['CLF3037']])

}



// Set active true with found stations -----------------------------------------
function setActiveStn(stn_arr){

  for (var i = 0; i < stn_arr.length; i++) {
    stn_arr[i] = stn_arr[i][0]
  }

  for (var zone in TIA_GC) {
    if (TIA_GC.hasOwnProperty(zone)) {

      var zone_active = false

      for (var station in TIA_GC[zone]) {
        if (TIA_GC[zone].hasOwnProperty(station)) {

          if (stn_arr.includes(station)){
            TIA_GC[zone][station].active = true ;
            stn_arr.splice(stn_arr.indexOf(station),1)
            zone_active = true
          }

          TIA_GC[zone][station].sel = false ;

        }
      }

      TIA_GC[zone]._active = zone_active

    }
  }

  if (stn_arr.length > 0) {
    for (var i = 0; i < stn_arr.length; i++) {
      TIA_GC.OTHER[stn_arr[i]] = {active:true,};
    }
  }

  stnBtns(TIA_GC)

}

function stnBtns(stns) {

  var s = ''

  for (var zone in stns) {

    var s = ''

    if (stns.hasOwnProperty(zone)) {

      s += '<span id="' + zone + '_name" class="item_title '
      if(stns[zone]._active) { s += 'active '}
      s += '">' + zone.replace('ZONE','Zone ') + '</span>'

      for (var stn in stns[zone]) {
        if (stns[zone].hasOwnProperty(stn)) {

          if(stn.search('_') < 0){

            s += '<div id="' + zone + '_' + stn + '_stnbtn" class="glass_btn '
            if (stns[zone][stn].active) { s += 'active ' }
            s += '" title="' + stns[zone][stn].name
            s += '">' + stn + '</div>'

          }
        }
      }

      $('#' + zone).html(s);

    }
  }

  // button mouseup actions
  $('#sel_stations .glass_btn.active').mouseup(sel_stn)
  $('#sel_stations .item_title').mouseup(sel_zone)

  stationsReady();

}
