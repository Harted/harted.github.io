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
  new Date (2018,11,31),
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

// LAYOFF CLASS
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


class Weekends {
  constructor() {
    this.timeline = []
    this.createTimeline()
  }

  createTimeline(){

    var satSt = Date.parse(new Date(2019,0,5,0,0,0))
    var now = Date.parse(new Date())

    for (var i = satSt; i < now; i += (1000*60*60*24*7) ) {

      var ys = new Date(i).getFullYear()
      var ms = new Date(i).getMonth()
      var ds = new Date(i).getDate()

      var mon = i + (1000*60*60*24*2)

      var ye = new Date(mon).getFullYear()
      var me = new Date(mon).getMonth()
      var de = new Date(mon).getDate()

      var sTime = SHIFTS[6].W.s.split(':')
      var eTime = SHIFTS[1].W.e.split(':')

      var sDate = new Date(ys, ms, ds, sTime[0], sTime[1], sTime[2])
      var eDate = new Date(ye, me, de, eTime[0], eTime[1], eTime[2])

      this.timeline.push({
        start: Date.parse(sDate),
        end: Date.parse(eDate),
        type: 'weekend',
        sdate: dateT(sDate),
        eDate: dateT(eDate),
      })


    }

  }
}

var weekendTL = new Weekends()
console.log(weekendTL);

// Add Holiday, LayOff & Weekend timeline and sort by start date
var HDLOWtimeline = holidayTL.timeline
.concat(layOffTL.timeline)
.concat(weekendTL.timeline)
.sort(function(a,b){
  return a.start - b.start
})









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

    this.inHDLOW = undefined
    this.sInHDLOW = undefined
    this.eInHDLOW = undefined
    this.HDLOWsBetween = []

    this.timeNotHDLOW = []

    this.inBrk = undefined
    this.sInBrk = undefined
    this.eInBrk = undefined
    this.BrksBetween = []

    this.inHDLOWB = undefined
    this.sInHDLOWB = undefined
    this.eInHDLOWB = undefined
    this.HDLOWBsBetween = []

    this.timeNotHDLOWB = []

    this.createTimeline(a)

  }

  createTimeline(a){

    // Specific event time line function
    function specTL(tlArr, name, context){
      for (var i = 0; i < tlArr.length; i++) {

        var tl = tlArr[i]

        if (a._start >= tl.start && a._end <= tl.end) {
          tl.duration = (a._end - a._start);
          tl.durtxt = dhms(tl.duration);
          context['in' + name] = tl // start and ends in
        } else if (a._start <= tl.start && a._end >= tl.end) {
          tl.duration = (tl.end + 1000) - tl.start;
          tl.durtxt = dhms(tl.duration);
          context[name + 'sBetween'].push(tl) // holidays lay between
        } else if (a._start >= tl.start && a._start <= tl.end) {
          tl.duration = (tl.end + 1000) - a._start;
          tl.durtxt = dhms(tl.duration);
          context['sIn' + name] = tl // starts in holiday and ends later
        } else if (a._end >= tl.start && a._end <= tl.end) {
          tl.duration = (a._end) - tl.start;
          tl.durtxt = dhms(tl.duration);
          context['eIn' + name] = tl // ends in holiday and start before
        }
      }
    }

    // Get specific HDLOW timeline
    specTL(HDLOWtimeline, 'HDLOW', this)

    function timeNot(name, context){

      // Object reference
      var tni = context['timeNot' + name]

      function tniPush(start){ // push new time between item function
        tni.push({
          start: start,
          type: 'PRODUCTION',
          sdate: dateT(new Date(start)),
        })
      }

      function tniPrevious(end){ // add end time to time between item function
        tni[tni.length - 1].end = end
        tni[tni.length - 1].eDate = dateT(new Date(end))
        tni[tni.length - 1].duration = end - tni[tni.length - 1].start
        tni[tni.length - 1].durtxt = dhms(tni[tni.length - 1].duration)
        tniPop();
      }

      function tniPop(){ // If the time between is negative (neighbouring HDLOW)
        if (tni[tni.length - 1].end < tni[tni.length - 1].start){
          tni.pop();
        }
      }


      if (context['sIn' + name] != undefined) { // starts in holiday
        tniPush(context['sIn' + name].end + 1000)
      } else if (context['in' + name] == undefined) { // doesn't start in holliday
        tniPush(a._start)
      }

      // has holidays between
      for (var i = 0; i < context[name + 'sBetween'].length; i++) {
        var btw = context[name + 'sBetween'][i]
        tniPrevious(btw.start - 1000) // give previous end time
        tniPush(btw.end + 1000) // push new item with start time
      }

      if (context['eIn' + name] != undefined) { // ends in holiday
        tniPrevious(context['eIn' + name].start - 1000)
      } else if (context['in' + name] == undefined){ // doesn't end in holliday
        tniPrevious(a._end)
      }

    };

    timeNot('HDLOW', this)


    // Create break timeline for dates between holidays ------------------
    var breakTL = []
    var tnih = this.timeNotHDLOW

    for (var i = 0; i < tnih.length; i++) {

      var sDay = new Date(tnih[i].start).getDay()
      var eDay = new Date(tnih[i].end).getDay()

      var day = 1000 * 60 * 60 * 24

      for (var j = sDay; j <= eDay; j++) {

        var thisDate = new Date(tnih[i].start + ((j - sDay) * day))

        for (var br in BREAK[j]) {

          if (Object.keys(BREAK[j][br])[0].length > 2){
            if (BREAK[j][br].hasOwnProperty(a._zone)){

              var brk = BREAK[j][br][a._zone]; pushBreak();

            }
          } else {

            var brk = BREAK[j][br]; pushBreak()

          }

          function pushBreak(){

            var bT = breakTime(thisDate, brk)

            if (
              tnih[i].start < bT.start && bT.end < tnih[i].end // breaks betw
              || bT.start < tnih[i].start && tnih[i].start < bT.end // starts in
              || bT.start < tnih[i].end && tnih[i].end < bT.end // ends in
            ) {

              breakTL.push(bT); return false;

            }
          }
        }
      }
    }

    function breakTime(thisDate, time) {

      var sTime = time.s.split(':')
      var eTime = time.e.split(':')

      var dp = YMD(thisDate)

      var sDate = new Date(dp[0], dp[1], dp[2], sTime[0], sTime[1], sTime[2])
      var eDate = new Date(dp[0], dp[1], dp[2], eTime[0], eTime[1], eTime[2])

      return {
        start: Date.parse(sDate),
        end: Date.parse(eDate),
        type: 'break',
        sdate: dateT(sDate),
        eDate: dateT(eDate),
      }

    }

    specTL(breakTL, 'Brk', this)

    this.HDLOWBrkTL = this.HDLOWsBetween
    .concat(this.BrksBetween)
    .sort(function(a,b){
      return a.start - b.start
    })

    this.startIn = this.sInBrk || this.sInHDLOW
    this.endIn = this.eInBrk || this.eInHDLOW
    this.in = this.inBrk || this.inHDLOW

    if (this.startIn != undefined) { this.HDLOWBrkTL.unshift(this.startIn)}
    if (this.endIn != undefined) { this.HDLOWBrkTL.push(this.endIn)}
    if (this.in != undefined) { this.HDLOWBrkTL.push(this.in)}

    specTL(this.HDLOWBrkTL, 'HDLOWB', this)

    timeNot('HDLOWB', this);

    this.timeline = this.HDLOWBrkTL
    .concat(this.timeNotHDLOWB)
    .sort(function(a,b){
      return a.start - b.start
    })


  }

}

var prodTest = new ProdTimeline({

  _start: Date.parse(new Date(2019,10,7,11,22,0)),
  _end: Date.parse(new Date(2019,10,7,11,23,59)),
  _zone: 'ZONE2'

})

var prodTest2 = new ProdTimeline({

  _start: Date.parse(new Date(2019,10,1,11,22,10)),
  _end: Date.parse(new Date(2019,10,7,11,35,59)),
  _zone: 'ZONE2'

})

console.log('prodTest:', prodTest, prodTest2);

for (var i = 0; i < prodTest.timeline.length - 1; i++) {
  console.log(prodTest.timeline[i+1].start - prodTest.timeline[i].end)
}



function YMD(date){
  return [
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
  ]
}
