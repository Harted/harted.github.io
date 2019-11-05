// GLOBAL alarms var -----------------------------------------------------------
var alarms
var alarmParts

// FADE functions --------------------------------------------------------------
function loadFade(){ //fade interface on load
  $('.fade').css({'opacity': 1});
  $('.fade_reverse').css({'opacity': 0});
}

var TIA_GC = {
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

// Status fields ---------------------------------------------------------------
function statusFields(str, cls){

  if (TIME.rt){return}

  var ids = ['#load_status','#ul_status']
  var cl = 'loadstatus ' + cls

  for (var i = 0; i < ids.length; i++) {
    $(ids[i] + ' span').attr('class', cl).text(str)
  }

}


//Async array function ---------------------------------------------------------
function asyncArr(array, fn_arr, fn_dom, fn_after, context) {

  var i = 0
  var len = array.length
  //var part = Math.ceil( len / 10 )
  time = 100
  var context = context || window

  function itter(){
    //var p = part // size of part
    var starttime = Date.now() + time
    while( /*p--*/ Date.now() < starttime && i < len) { // array function
      fn_arr.call( context, array, i ) ; i++
    }
    if ( i < len ) { // between parts function
      fn_dom.call( context, array, i )
      setTimeout( itter, 0 )
    } else { // after itteration
      fn_after.call( context, array, i )
    }
  }

  itter(); // start itteration

}



// Local yyyy-mm-ddThh:mm:ss sring from date
function dateT(d, sub){

  // now or defined by string
  if (d == undefined){

    d = new Date(Date.now()) // if ndefined set to now

  } else if (/[\d]{4}-[\d]{1,}-[\d]{1,}T[\d]{2}:[\d]{2}:[\d]{2}/.test(d)) {

      var p = d.match(/[\d]{1,}/g) // split by didget group

      // Create new date with parts (because GMT is not in T string)
      var d = new Date(p[0],p[1]-1,p[2],p[3],p[4],p[5])

  }

  var n = Date.parse(d) // parse date to enable calculations

  if (sub != undefined) { n = n - sub } // subtract if defined

  var o = new Date(n) // convert back to date string

  // Make T string
  var str = new Date(
    new Date(n).toString().split('GMT')[0]+' UTC'
  ).toISOString().split('.')[0];

  return str // return T string

}
