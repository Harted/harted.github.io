var OVERVIEW

function makeOverview(){

  return; //temp disable

  OVERVIEW = {}

  for (var i = 0; i < all_alarms.length; i++) {

    if (all_alarms[i]._state == 1) {


      var zone = all_alarms[i]._zone
      var stn = all_alarms[i].station
      var stname = TIA_GC[zone][stn].name
      var sev = all_alarms[i].severity
      var zm = all_alarms[i].zone
      var obj = all_alarms[i].object
      var dsc = all_alarms[i].description
      var cmt = all_alarms[i].comment

      //filter miscalculated events (will resolve in the future by good logging)
      if (all_alarms[i]._duration >= 0) {
        var dur = all_alarms[i]._duration
      } else {
        var dur = 0
      }



      if (OVERVIEW[zone] == undefined) {
        OVERVIEW[zone] = {count:0, duration:0}
      }

      OVERVIEW[zone].count++
      OVERVIEW[zone].duration += dur
      OVERVIEW[zone].durtxt = dhms(OVERVIEW[zone].duration)

      if (OVERVIEW[zone][stn] == undefined) {
        OVERVIEW[zone][stn] = {count:0, duration:0}
      }

      OVERVIEW[zone][stn].count++
      OVERVIEW[zone][stn].duration += dur
      OVERVIEW[zone][stn].durtxt = dhms(OVERVIEW[zone][stn].duration)

      OVERVIEW[zone][stn].name = stname

      if (OVERVIEW[zone][stn][sev] == undefined) {
        OVERVIEW[zone][stn][sev] = {count:0, duration:0}
      }

      OVERVIEW[zone][stn][sev].count++
      OVERVIEW[zone][stn][sev].duration += dur
      OVERVIEW[zone][stn][sev].durtxt = dhms(OVERVIEW[zone][stn][sev].duration)

      if (OVERVIEW[zone][stn][sev][zm] == undefined) {
        OVERVIEW[zone][stn][sev][zm] = {count:0, duration:0}
      }

      OVERVIEW[zone][stn][sev][zm].count++
      OVERVIEW[zone][stn][sev][zm].duration += dur
      OVERVIEW[zone][stn][sev][zm].durtxt = dhms(OVERVIEW[zone][stn][sev][zm].duration)

      if (OVERVIEW[zone][stn][sev][zm][obj] == undefined) {
        OVERVIEW[zone][stn][sev][zm][obj] = {count:0, duration:0}
      }

      OVERVIEW[zone][stn][sev][zm][obj].count++
      OVERVIEW[zone][stn][sev][zm][obj].duration += dur
      OVERVIEW[zone][stn][sev][zm][obj].durtxt = dhms(OVERVIEW[zone][stn][sev][zm][obj].duration)

      if (OVERVIEW[zone][stn][sev][zm][obj][dsc] == undefined) {
        OVERVIEW[zone][stn][sev][zm][obj][dsc] = {count:0, duration:0, comment: cmt}
      }

      OVERVIEW[zone][stn][sev][zm][obj][dsc].count++
      OVERVIEW[zone][stn][sev][zm][obj][dsc].duration += dur
      OVERVIEW[zone][stn][sev][zm][obj][dsc].durtxt = dhms(OVERVIEW[zone][stn][sev][zm][obj][dsc].duration)

      if (OVERVIEW[zone][stn][sev][zm][obj][dsc].alarms == undefined){
        OVERVIEW[zone][stn][sev][zm][obj][dsc].alarms = []
      }

      OVERVIEW[zone][stn][sev][zm][obj][dsc].alarms.push(all_alarms[i])

    }

  }

  console.log(OVERVIEW)

}



var SHIFTS = {
  1: {
    W: { s: '00:00:00', e: '05:14:59' },
    S1: { s: '05:15:00', e: '13:29:59' },
    S2: { s: '13:30:00', e: '21:29:59' },
    N1: { s: '21:30:00', e: '23:59:59' },
  },
  2: {
    N2: { s: '00:00:00', e: '05:14:59' },
    S1: { s: '05:15:00', e: '13:29:59' },
    S2: { s: '13:30:00', e: '21:29:59' },
    N1: { s: '21:30:00', e: '23:59:59' },
  },
  3: {
    N2: { s: '00:00:00', e: '05:14:59' },
    S1: { s: '05:15:00', e: '13:29:59' },
    S2: { s: '13:30:00', e: '21:29:59' },
    N1: { s: '21:30:00', e: '23:59:59' },
  },
  4: {
    N2: { s: '00:00:00', e: '05:14:59' },
    S1: { s: '05:15:00', e: '13:29:59' },
    S2: { s: '13:30:00', e: '21:29:59' },
    N1:  { s: '21:30:00', e: '23:59:59' },
  },
  5: {
    N2: { s: '00:00:00', e: '05:14:59' },
    S1: { s: '05:15:00', e: '12:14:59' },
    S2: { s: '12:15:00', e: '18:59:59' },
    N1: { s: '19:00:00', e: '23:59:59' },
  },
  6: {
    N2: { s: '00:00:00', e: '03:14:59' },
    W: { s: '03:15:00', e: '23:59:59' },
  },
  7: {
    W:  { s: '00:00:00', e: '23:59:59' },
  },
}


function uniT(tStr){
  arr = tStr.split(':')
  return new Date(2019,0,1,arr[0], arr[1], arr[2])
}


var today = new Date()
var today_day = today.getDay()
var today_t = uniT(today.toTimeString().substr(0,8))
var tdy_sh =  SHIFTS[today_day]

for (var sh in tdy_sh) {
  if (tdy_sh.hasOwnProperty(sh)) {

    if (uniT(tdy_sh[sh].s) < today_t && uniT(tdy_sh[sh].e) > today_t ) {
      console.log(sh)
    }

  }
}





















//
