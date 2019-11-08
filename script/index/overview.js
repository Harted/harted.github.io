// SHIFTS ----------------------------------------------------------------------
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

SHIFTS[3] = SHIFTS[4] = SHIFTS[2]


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
  // February (STAKING)
  new Date (2019,01,13),
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

class Holidays {

  constructor(HD) {
    this.timeline = []
    this.createTimeline(HD)
  }

  createTimeline(HD) {

    for (var day in HD) {

      var y = HD[day].getFullYear()
      var m = HD[day].getMonth()
      var d = HD[day].getDate()

      var dayNum = HD[day].getDay()

      var sTime = SHIFTS[dayNum].S1.s.split(':')
      var eTime = SHIFTS[dayNum + 1].N2.e.split(':')

      var sDate = new Date(y, m, d, sTime[0], sTime[1], sTime[2])
      var eDate = new Date(y, m, d, eTime[0], eTime[1], eTime[2])
      eDate = new Date(Date.parse(eDate) + (1000*60*60*24))

      this.timeline.push({
        start: Date.parse(sDate),
        end: Date.parse(eDate),
        type: 'holiday',
        sdate: dateT(sDate),
        eDate: dateT(eDate),
      })

    }

  }
}

var holidayTL = new Holidays(HOLIDAYS)

console.log(holidayTL);


// LAY-OFF ---------------------------------------------------------------------
var LAYOFF = [
  // Februari
  [new Date (2019,01,01), 'N'],
  [new Date (2019,01,06), 'S2'],
  // March
  [new Date (2019,02,13), 'S2'],
  [new Date (2019,02,29), 'N'],
  // April
  [new Date (2019,03,03), 'S2'],
  [new Date (2019,03,05), 'N'],
  [new Date (2019,03,10), 'S2'],
  [new Date (2019,03,12), 'N'],
  [new Date (2019,03,17), 'S2'],
  // May
  [new Date (2019,04,15), 'S2'],
  [new Date (2019,04,22), 'S2'],
  // June
  [new Date (2019,05,05), 'S2'],
  [new Date (2019,05,19), 'S2'],
  [new Date (2019,05,26), 'S2'],
  // July
  [new Date (2019,06,03), 'S2'],
  [new Date (2019,06,10), 'S2'],
  [new Date (2019,06,19), 'N'],
  // August
  [new Date (2019,07,13), 'S1'],
  [new Date (2019,07,14), 'S2'],
  [new Date (2019,07,20), 'S1'],
  [new Date (2019,07,21), 'S2'],
  [new Date (2019,07,28), 'S2'],
  [new Date (2019,07,30), 'N'],
  // September
  [new Date (2019,08,04), 'S2'],
  [new Date (2019,08,06), 'N'],
  [new Date (2019,08,11), 'S2'],
  [new Date (2019,08,13), 'N'],
  [new Date (2019,08,18), 'S2'],
  [new Date (2019,08,20), 'N'],
  [new Date (2019,08,24), 'S1'],
  [new Date (2019,08,25), 'S2'],
  // Oktober
  [new Date (2019,09,01), 'S1'],
  [new Date (2019,09,02), 'S2'],
  [new Date (2019,09,04), 'N'],
  [new Date (2019,09,08), 'S1'],
  [new Date (2019,09,09), 'S2'],
  [new Date (2019,09,11), 'N'],
  [new Date (2019,09,15), 'S1'],
  [new Date (2019,09,16), 'S2'],
  [new Date (2019,09,18), 'N'],
  [new Date (2019,09,23), 'S2'],
  [new Date (2019,09,25), 'N'],
  [new Date (2019,09,31), 'N'],
  // November
  [new Date (2019,10,05), 'S1'],
  [new Date (2019,10,06), 'S2'],
  [new Date (2019,10,13), 'S2'],
  [new Date (2019,10,15), 'N'],
  [new Date (2019,10,20), 'S2'],
  [new Date (2019,10,22), 'N'],
  [new Date (2019,10,27), 'S2'],
  [new Date (2019,10,29), 'N'],
  // December
  [new Date (2019,11,03), 'S1'],
  [new Date (2019,11,04), 'S2'],
  [new Date (2019,11,11), 'S2'],
  [new Date (2019,11,13), 'N'],
  [new Date (2019,11,18), 'S2'],
  [new Date (2019,11,20), 'N'],


]


class LayOff {
  constructor(LO) {
    this.timeline = []
    this.createTimeline(LO)
  }

  createTimeline(LO){

    for (var day in LO) {

      var y = LO[day][0].getFullYear()
      var m = LO[day][0].getMonth()
      var d = LO[day][0].getDate()

      var dayNum = LO[day][0].getDay()

      if (LO[day][1] == 'N') {

        var sTime = SHIFTS[dayNum].N1.s.split(':')
        var eTime = SHIFTS[dayNum + 1].N2.e.split(':')

        var sDate = new Date(y, m, d, sTime[0], sTime[1], sTime[2])
        var eDate = new Date(y, m, d, eTime[0], eTime[1], eTime[2])
        eDate = new Date(Date.parse(eDate) + (1000*60*60*24))

      } else {

        var sTime = SHIFTS[dayNum][LO[day][1]].s.split(':')
        var eTime = SHIFTS[dayNum][LO[day][1]].e.split(':')

        var sDate = new Date(y, m, d, sTime[0], sTime[1], sTime[2])
        var eDate = new Date(y, m, d, eTime[0], eTime[1], eTime[2])

      }

      this.timeline.push({
        start: Date.parse(sDate),
        end: Date.parse(eDate),
        type: 'layoff',
        sdate: dateT(sDate),
        eDate: dateT(eDate),
      })

    }

  }
}

var layOffTL = new LayOff(LAYOFF)

console.log(layOffTL);

var HDLOtimeline = holidayTL.timeline.concat(layOffTL.timeline)
.sort(function(a,b){
  return a.start - b.start
})

console.log('Holiday & layOff timeline', HDLOtimeline);

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





class ProdTimeline {
  constructor(a) {
    this.timeline = []
    this.HDLObetween = []
    this.startInHDLO = undefined
    this.createTimeline(a)
  }

  createTimeline(a){

    for (var i = 0; i < HDLOtimeline.length; i++) {

      var tl = HDLOtimeline[i]

      // Holidays
      if (a._start <= tl.start && a._end > tl.end) { // holidays between
        this.HDLObetween.push(tl)
      } else if (a._start > tl.start && a._start <= tl.end) {
        this.startInHDLO = tl
      }

    }

  }

}

var prodTest = new ProdTimeline({

  _start: Date.parse(new Date(2019,00,1,12,0,0)),
  _end: Date.parse(new Date(2019,11,31,23,59,59)),
  _zone: 'ZONE2'

})

console.log('prodTest:', prodTest);


















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

  // console.log(s_d, e_d, s_t, e_t)

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


    // console.log(inBrk);


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


    // console.log(brks_between, dur_breaks, dhms(dur_breaks))

  } else {

    window.alert('Found an alarm that lasts more than one week! WTF!')

  }

  //console.log(dur)

}
var br_s = dateT(new Date(sDateParse( '2019-09-23 11:23:00.725' )))
var br_e = dateT(new Date(sDateParse( '2019-09-25 11:39:58.725' )))

duration(br_s, br_e, 'ZONE1')






//
