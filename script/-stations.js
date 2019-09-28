TIA_GC = {
  ZONE1: {
    CLF260: { active: false },
    CLF280: { active: false },
    CLF285: { active: false },
    CSR2264: { active: false },
    CSR2364: { active: false },
    CSR265: { active: false },
    CSR266: { active: false },
    CSR267: { active: false },
    CMKE2100: { active: false },
    CLF2028: { active: false },
    CLF2029: { active: false },
    CHL2922: { active: false },
    CDU220: { active: false },
    CLF248: { active: false },
    CCP222: { active: false },
    CCP2222: { active: false },
  },
  ZONE2: {
    CMP305: { active: false },
    CMP306: { active: false },
    CMP310: { active: false },
    CMP311: { active: false },
    CLF2000: { active: false },
    CLF2030: { active: false },
    CLF4000: { active: false },
    CLF4030: { active: false },
    CLF3037: { active: false },
    CLF3038: { active: false },
  },
  ZONE3: {
    CPU445: { active: false },
    CPU446: { active: false },
    CPU447: { active: false },
    CPU448: { active: false },
    CVU462: { active: false },
    CVU463: { active: false },
    CVU465: { active: false },
    CHSC810: { active: false },
    CHSC810: { active: false },
  },
  ZONE4: {
    CBA4100: { active: false },
    CLF520: { active: false },
    CBU1001: { active: false },
    CBU1002: { active: false },
  },
  OTHER: {},
}


// GET Stations from database (ALARMSOURCE) ------------------------------------


// $.ajax({
//   url: '/script/ajax.php',
//   type: 'GET',
//   cache: false,
//   dataType: 'json',
//   data: {'stations':''}
// })
// .done(function(received) { setActiveStn(received);})
// .fail(function() { console.log("Ajax: stations: error");})

// setActiveStn([])


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

  console.log(TIA_GC);

  stnBtns(TIA_GC)

}

function stnBtns(stns) {

  var s = ''

  for (var zone in stns) {
    if (stns.hasOwnProperty(zone)) {

      if (stns[zone]._active || (true) ) {

        s += '<div class="zonegroup" id="' + zone + '_group">'
        s += '<div class="zg_header">'
        s += zone.replace('ZONE','Zone ')
        s += '</div>'
        s += '<div class="zg_items">'
        s += '<div class="zg_items2">'

      }


      for (var stn in stns[zone]) {
        if (stns[zone].hasOwnProperty(stn)) {

          if (stns[zone][stn].active || (true && stn != '_active')) {

            s += '<div id="' + stn + '_stnbtn" class="div_ctrl">' + stn + '</div>'

          }


        }
      }


      if (stns[zone]._active || (true)) {
         s += '</div></div>'
      }

    }
  }

  $('#stnbtns').html(s)














}
