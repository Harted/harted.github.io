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


// Default filter values ---------------------------------------------
var FILTERS_def = function() {
  return {
    only: {
      active: false,
    },
    sev: {
      A: true, B: true, C: true, D: true, E: false,
    },
    general: {
      interlock: true, keeppos: true, processtime: true, overtime: true,
      com: true, diag: true, system: true, robot: true,
      atlascopco: true, other: true,
    },
    safety: {
      EStop: true, GStop: true, MStop: true, overtravel: true,
      button: true, gate: true, other: true,
    },
    mode: {
      autonotstarted: true, manual: true, resseq: true, restm: true,
      forced: true, homerun: true, normalstop: true, other: true,
    },
    production: {
      prodmode: true, inout: true, andon: true, controlroom: true,
      other: true,
    },
  }
}

var FILTERS = FILTERS_def() //Set object to default structure on load








// Status fields ---------------------------------------------------------------
function statusFields(str, cls, arr, i){

  // arr & i: only when cls (class) = progress

  if (TIME.rt){return} //Don't show status when realtime is active

  if (cls === "progress") {
    var progress =  Math.round( i / arr.length * 100 )
    str += ': ' + progress + '%'
  }

  var ids = ['#load_status','#ul_status']
  var cl = 'loadstatus ' + cls

  for (var i = 0; i < ids.length; i++) {
    $(ids[i] + ' span').attr('class', cl).text(str)
  }

}


//Async array function ---------------------------------------------------------
var asyncStack = []
function asyncArr(array, fn_arr, fn_dom, fnAfter, context, time) {

  var i = 0
  var len = array.length

  time = time || 150
  var context = context || window

  function itter(){
    var starttime = Date.now() + time

    while(  Date.now() < starttime && i < len) { // array function
      fn_arr.call( context, array, i ) ; i++
    }

    if ( i < len ) { // between parts function
      fn_dom.call( context, array, i )
      asyncStack.push(setTimeout( itter, 1 )) //able to cancel async opperation
    } else { // after itteration
      fnAfter.call( context, array, i )
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








// CURRENT SET Class -----------------------------------------------------------
class CurrentSet {
  constructor(URI) {
    URI = URI || false
    if (URI) {
      this.TIA_GC = this.toBinTIAGC(TIA_GC)
      this.FILTERS = this.toBinFILTERS(FILTERS)
    } else {
      this.TIA_GC = TIA_GC
      this.FILTERS = FILTERS
    }
    this.TIME = {
      rel: TIME.rel,
      rt: TIME.rt,
      lbt: TIME.lbt(),
      sta: TIME.sta(),
      end: TIME.end(),
    }
  }

  toBinTIAGC(TIA){
    var binStr = '';
    for (var zone in TIA) {
      for (var stn in TIA[zone]) {
        if (TIA[zone][stn].hasOwnProperty('sel')) {
          switch (TIA[zone][stn].sel) {
            case true: binStr += '1'
            break;
            case false: binStr += '0'
            break;
          }
        }
      }
    }; return binStr;
  }

  toBinFILTERS(F){
    var binStr = '';
    for (var top in F) {
      for (var sub in F[top]) {
        switch (F[top][sub]) {
          case true: binStr += '1'; break;
          case false: binStr += '0'; break;
        }
      }
    }; return binStr;
  }
}

// FROM CURRENT SET Class ------------------------------------------------------
class fromCurrentSet {
  constructor(session) {
    this.TIA_GC = this.fromBinTIAGC(session.TIA_GC)
    this.FILTERS = this.fromFILTERS(session.FILTERS)
    this.TIME = session.TIME
  }

  fromBinTIAGC(ses) {
    for (var zone in TIA_GC) {
      for (var stn in TIA_GC[zone]) {
        if (stn.indexOf('_') != 0 && TIA_GC[zone][stn].hasOwnProperty('active')) {
          var bin = ses.slice(0,1)
          var ses = ses.slice(1)

          console.log(zone, stn, bin);

          switch (bin) {
            case '1': TIA_GC[zone][stn].sel = true
            break;
            case '0': TIA_GC[zone][stn].sel = false
            break;
          }
        }
      }
    }; return TIA_GC;
  }

  fromFILTERS(ses){
    for (var top in FILTERS) {
      for (var sub in FILTERS[top]) {

        var bin = ses.slice(0,1)
        var ses = ses.slice(1)

        switch (bin) {
          case '1': FILTERS[top][sub] = true
          break;
          case '0': FILTERS[top][sub] = false
          break;
        }
      }
    }; return FILTERS
  }

}
