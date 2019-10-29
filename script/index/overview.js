var OVERVIEW

function makeOverview(){

  return; //temp disable

  // Ideas for overview:
  // - Only duration for A & B
  // -- therfore create alarm groups so combined duration is possible
  // --- so add on and off time to every alarm
  // Adding duration for events doen't make sence
  // - C & D only need a count.. duration is not important
  // SO.... DELETE THE SHIT BENEITH AND START OVER AT THE BASE 

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

      if (OVERVIEW[zone] == undefined) { OVERVIEW[zone] = {count:0} }

      OVERVIEW[zone].count++

      if (OVERVIEW[zone][stn] == undefined) { OVERVIEW[zone][stn] = {count:0}}

      OVERVIEW[zone][stn].count++
      OVERVIEW[zone][stn].name = stname

      if (OVERVIEW[zone][stn][sev] == undefined) {
        OVERVIEW[zone][stn][sev] = {count:0}
      }

      OVERVIEW[zone][stn][sev].count++

      if (OVERVIEW[zone][stn][sev][zm] == undefined) {
        OVERVIEW[zone][stn][sev][zm] = {count:0}
      }

      OVERVIEW[zone][stn][sev][zm].count++

      if (OVERVIEW[zone][stn][sev][zm][obj] == undefined) {
        OVERVIEW[zone][stn][sev][zm][obj] = {count:0}
      }

      OVERVIEW[zone][stn][sev][zm][obj].count++

      if (OVERVIEW[zone][stn][sev][zm][obj][dsc] == undefined) {
        OVERVIEW[zone][stn][sev][zm][obj][dsc] = {
          count:0, duration: 0,comment: cmt
        }
      }

      OVERVIEW[zone][stn][sev][zm][obj][dsc].count++
      OVERVIEW[zone][stn][sev][zm][obj][dsc].duration += dur

      OVERVIEW[zone][stn][sev][zm][obj][dsc].durtxt =
      dhms(OVERVIEW[zone][stn][sev][zm][obj][dsc].duration)

      if (OVERVIEW[zone][stn][sev][zm][obj][dsc].alarms == undefined){
        OVERVIEW[zone][stn][sev][zm][obj][dsc].alarms = []
      }

      OVERVIEW[zone][stn][sev][zm][obj][dsc].alarms.push(all_alarms[i])

    }

  }

  console.log(OVERVIEW)

}


// SHIFTS ----------------------------------------------------------------------
var SHIFTS = {
  1: {
    W: { s: '00:00:00', e: '05:14:59' },
    S1: { s: '05:15:00', e: '13:29:59' },
    S2: { s: '13:30:00', e: '21:29:59' },
    N1: { s: '21:30:00', e: '23:59:59' },
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

SHIFTS[2] = SHIFTS[3] = SHIFTS[4] = SHIFTS[1]


function uniT(tStr){
  var arr = tStr.split(':')
  return new Date(2019,0,1,arr[0], arr[1], arr[2])
}

function weekIndex(date){
  var base = new Date(2019,0,1,0,0,0)
  return Math.round((date - base) / (1000 * 60 * 60 * 24 * 7)) % 2
}

function getShift(date){

  date = new Date(date)

  var day = date.getDay(); if (day == 0) { day = 7 }; // 7 = sunday

  var time = uniT(date.toTimeString().substr(0,8))
  var shfts =  SHIFTS[day]

  for (var s in shfts) {
    if (shfts.hasOwnProperty(s)) {

      if (uniT(shfts[s].s) <= time && time <= uniT(shfts[s].e)) {

        var AB = { S1: ['B','A'], S2: ['A','B']}

        if (s == 'S1' || s == 'S2') {
          s = AB[s][weekIndex(date)]
        }

        return s.substr(0,1)

      }

    }
  }
}


// HOLIDAYs --------------------------------------------------------------------
var HOLIDAYS = [
  // Januari
  new Date (2019,00,01), new Date (2019,00,02),
  // April
  new Date (2019,03,19), new Date (2019,03,22),
  // May
  new Date (2019,04,01), new Date (2019,04,30), new Date (2019,04,31),
  // June
  new Date (2019,05,10),
  // July (SSD)
  new Date (2019,06,22), new Date (2019,06,23), new Date (2019,06,24),
  new Date (2019,06,25), new Date (2019,06,26),
  // (SSD)
  new Date (2019,06,29), new Date (2019,06,30), new Date (2019,06,31),
  new Date (2019,07,01), new Date (2019,07,02),
  // (SSD)
  new Date (2019,07,05), new Date (2019,07,06),new Date (2019,07,07),
  new Date (2019,07,08), new Date (2019,07,09),
  // August
  new Date (2019,07,15),
  new Date (2019,07,16),
  // November
  new Date (2019,10,01), new Date (2019,10,11),
  // December (XSD)
  new Date (2019,11,23), new Date (2019,11,24), new Date (2019,11,25),
  new Date (2019,11,26), new Date (2019,11,27),
  // (XSD)
  new Date (2019,11,30), new Date (2019,11,31),
]

console.log(HOLIDAYS);




// LAY-OFF ---------------------------------------------------------------------
var LAYOFF = [
  // Januari
  [new Date (2019,00,01), 'S1'], [new Date (2019,00,02), 'S2'],

]

console.log(LAYOFF);




// BREAK -----------------------------------------------------------------------
var BREAK = {
  1: {
    E1: { s: '07:00:00', e: '07:14:59' },
    E2: { s: '09:00:00', e: '09:14:59' },
    E3: {
      ZONE1: { s: '11:25:00', e: '11:49:59' },
      ZONE2: { s: '11:15:00', e: '11:39:59' },
      ZONE3: { s: '11:10:00', e: '11:34:59' },
      ZONE4: { s: '11:05:00', e: '11:29:59' },
    },
    L1: { s: '15:30:00', e: '15:44:59' },
    L2: { s: '17:30:00', e: '17:44:59' },
    L3: { s: '19:30:00', e: '19:39:59' },
    N3: {
      ZONE3: { s: '23:55:00', e: '23:59:59' },
      ZONE4: { s: '23:50:00', e: '23:59:59' },
    },
  },
  2: {
    N1: {
      ZONE1: { s: '00:10:00', e: '00:34:59' },
      ZONE2: { s: '00:00:00', e: '00:24:59' },
      ZONE3: { s: '00:00:00', e: '00:19:59' },
      ZONE4: { s: '00:00:00', e: '00:14:59' },
    },
    N2: { s: '03:00:00', e: '03:13:59' },
    E1: { s: '07:00:00', e: '07:14:59' },
    E2: { s: '09:00:00', e: '09:14:59' },
    E3: {
      ZONE1: { s: '11:25:00', e: '11:49:59' },
      ZONE2: { s: '11:15:00', e: '11:39:59' },
      ZONE3: { s: '11:10:00', e: '11:34:59' },
      ZONE4: { s: '11:05:00', e: '11:29:59' },
    },
    L1: { s: '15:30:00', e: '15:44:59' },
    L2: { s: '17:30:00', e: '17:44:59' },
    L3: { s: '19:30:00', e: '19:39:59' },
    N3: {
      ZONE3: { s: '23:55:00', e: '23:59:59' },
      ZONE4: { s: '23:50:00', e: '23:59:59' },
    },
  },
  3: {
    N1: {
      ZONE1: { s: '00:10:00', e: '00:34:59' },
      ZONE2: { s: '00:00:00', e: '00:24:59' },
      ZONE3: { s: '00:00:00', e: '00:19:59' },
      ZONE4: { s: '00:00:00', e: '00:14:59' },
    },
    N2: { s: '03:00:00', e: '03:13:59' },
    E1: { s: '07:00:00', e: '07:14:59' },
    E2: { s: '09:00:00', e: '09:14:59' },
    E3: {
      ZONE1: { s: '11:25:00', e: '11:49:59' },
      ZONE2: { s: '11:15:00', e: '11:39:59' },
      ZONE3: { s: '11:10:00', e: '11:34:59' },
      ZONE4: { s: '11:05:00', e: '11:29:59' },
    },
    L1: { s: '15:30:00', e: '15:44:59' },
    L2: { s: '17:30:00', e: '17:44:59' },
    L3: { s: '19:30:00', e: '19:39:59' },
    N3: {
      ZONE3: { s: '23:55:00', e: '23:59:59' },
      ZONE4: { s: '23:50:00', e: '23:59:59' },
    },
  },
  4: {
    N1: {
      ZONE1: { s: '00:10:00', e: '00:34:59' },
      ZONE2: { s: '00:00:00', e: '00:24:59' },
      ZONE3: { s: '00:00:00', e: '00:19:59' },
      ZONE4: { s: '00:00:00', e: '00:14:59' },
    },
    N2: { s: '03:00:00', e: '03:13:59' },
    E1: { s: '07:00:00', e: '07:14:59' },
    E2: { s: '09:00:00', e: '09:14:59' },
    E3: {
      ZONE1: { s: '11:25:00', e: '11:49:59' },
      ZONE2: { s: '11:15:00', e: '11:39:59' },
      ZONE3: { s: '11:10:00', e: '11:34:59' },
      ZONE4: { s: '11:05:00', e: '11:29:59' },
    },
    L1: { s: '15:30:00', e: '15:44:59' },
    L2: { s: '17:30:00', e: '17:44:59' },
    L3: { s: '19:30:00', e: '19:39:59' },
    N3: {
      ZONE3: { s: '23:55:00', e: '23:59:59' },
      ZONE4: { s: '23:50:00', e: '23:59:59' },
    },
  },
  5: {
    N1: {
      ZONE1: { s: '00:10:00', e: '00:34:59' },
      ZONE2: { s: '00:00:00', e: '00:24:59' },
      ZONE3: { s: '00:00:00', e: '00:19:59' },
      ZONE4: { s: '00:00:00', e: '00:14:59' },
    },
    N2: { s: '03:00:00', e: '03:13:59' },
    E1: { s: '07:00:00', e: '07:14:59' },
    E2: { s: '09:00:00', e: '09:14:59' },
    E3: {
      ZONE1: { s: '11:25:00', e: '11:49:59' },
      ZONE2: { s: '11:15:00', e: '11:39:59' },
      ZONE3: { s: '11:10:00', e: '11:34:59' },
      ZONE4: { s: '11:05:00', e: '11:29:59' },
    },
    L1: { s: '14:15:00', e: '14:29:59' },
    L2: { s: '16:00:00', e: '16:09:59' },
    L3: { s: '17:30:00', e: '17:39:59' },
    N2: {
      ZONE1: { s: '21:40:00', e: '22:04:59' },
      ZONE2: { s: '21:30:00', e: '21:54:59' },
      ZONE3: { s: '21:25:00', e: '21:49:59' },
      ZONE4: { s: '21:20:00', e: '21:44:59' },
    },
  },
  6: {
    N1: { s: '00:00:00', e: '00:14:59' },
  },
  7: {},
}

function duration(s,e,zone){

  var dur = {
    tot: {},
    prd: {},
    stl: {},
  }

  // Total
  var s_date = new Date (s)
  var e_date = new Date (e)

  dur.tot.nmb = e_date - s_date
  dur.tot.txt = dhms(dur.tot.nmb)

  s = s.split('T')
  e = e.split('T')

  // Production <> Standstill
  var s_d = new Date(s[0]).getDay(); if (s_d == 0) { s_d = 7 }; // 7 = sunday
  var e_d = new Date(e[0]).getDay(); if (e_d == 0) { e_d = 7 }; // 7 = sunday

  if (e_d < s_d) { e_d += 7 }

  var s_t = s[1]
  var e_t = e[1]

  console.log(s_d, e_d, s_t, e_t)

  if (dur.tot.nmb < (7 * 24 * 60 * 60 * 1000)){ //less than 1 week

    var end = e_d; if (end > 7){ end -= 7 } // e_d < s_d

    // start in break ------
    function inBreak(day, time, ref){

      for (var brk in BREAK[day]) {
        if (BREAK[day].hasOwnProperty(brk)) {

          if (BREAK[day][brk].hasOwnProperty(zone)){
            var brk_t = BREAK[day][brk][zone]
          } else if (BREAK[day][brk].hasOwnProperty('s')) {
            var brk_t = BREAK[day][brk]
          }

          if(uniT(brk_t.s) <= uniT(time) && uniT(time) < uniT(brk_t.e)) {

            var nm = day + brk // name

            switch (ref) { // time
              case 'e': var tm = uniT(brk_t[ref]) - uniT(time) ;break;
              case 's': var tm = uniT(time) - uniT(brk_t[ref]) ;break;
            }

            if (tm > dur.tot.nmb) { tm = dur.tot.nmb }

          }
        }
      }

      return [nm, tm]

    }

    var inBrk = {
      s : {
        name : inBreak (s_d, s_t, 'e')[0],
        time : inBreak (s_d, s_t, 'e')[1],
      },
      e : {
        name : inBreak (e_d, e_t, 's')[0],
        time : inBreak (e_d, e_t, 's')[1],
      },
    }


    console.log(inBrk);


    // breaks between ------
    var brks_between = []

    // if not in same break check breaks between
    if (!(inBrk.s.name == inBrk.e.name) || (inBrk.s.name == undefined && inBrk.e.name == undefined) ){

      for (var i = s_d; i <= e_d; i++) {

        dn = i; if (dn > 7){ dn -= 7 } // e_d < s_d

        for (brk in BREAK[dn]) {
          if (BREAK[dn].hasOwnProperty(brk)) {

            if (BREAK[dn][brk].hasOwnProperty(zone)){
              var brk_t = BREAK[dn][brk][zone]
            } else if (BREAK[dn][brk].hasOwnProperty('s')) {
              var brk_t = BREAK[dn][brk]
            }


            if (

              !(s_d == end) && ( // different day
                s_d == dn && uniT(brk_t.s) > uniT(s_t) || // start day
                end == dn && uniT(brk_t.e) <= uniT(e_t) || // end day
                (s_d != dn && end != dn) // days between start and end
              ) || (s_d == end) && ( // same day
                uniT(brk_t.s) > uniT(s_t) &&
                uniT(brk_t.e) <= uniT(e_t)
              )

            ) {

              brks_between.push({
                day : dn,
                brk : brk,
                time : brk_t,
              })

            }

          }
        }

      }
    }

    var dur_breaks = 0

    for (var i = 0; i < brks_between.length; i++) {
      dur_breaks += uniT(brks_between[i].time.e) - uniT(brks_between[i].time.s) + 1000
    }

    dur.stl.nmb = dur_breaks + (inBrk.s.time || 0) + (inBrk.e.time || 0)
    dur.stl.txt = dhms(dur.stl.nmb)

    dur.prd.nmb = dur.tot.nmb - dur.stl.nmb
    dur.prd.txt = dhms(dur.prd.nmb)


    console.log(brks_between, dur_breaks, dhms(dur_breaks))

  } else {

    window.alert('Found an alarm that lasts more than one week! WTF!')

  }

  console.log(dur)

}


var br_s = dateT(new Date(sDateParse( '2019-09-23 11:23:00.725' )))
var br_e = dateT(new Date(sDateParse( '2019-09-23 11:39:58.725' )))

duration(br_s, br_e, 'ZONE1')

















//
