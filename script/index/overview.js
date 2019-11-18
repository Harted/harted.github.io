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












class SearchTL {
  constructor() {
    this.isIn = undefined
    this.startsIn = undefined
    this.endsIn = undefined
    this.hasBetween = []
    this.timeNotIn = []
    this.timeline = []
  }
}

class TLduration {
  constructor(){
    this.PRODUCTION = 0
    this.break = 0
    this.layoff = 0
    this.holiday = 0
    this.weekend = 0
    this.STANDSTILL = 0
    this.TOTAL = 0
  }
  updateTxt(){
    this.PRODUCTION_txt = dhms(this.PRODUCTION)
    this.break_txt = dhms(this.break)
    this.layoff_txt = dhms(this.layoff)
    this.holiday_txt = dhms(this.holiday)
    this.weekend_txt = dhms(this.weekend)
    this.STANDSTILL_txt = dhms(this.STANDSTILL)
    this.TOTAL_txt = dhms(this.TOTAL)
  }
}

class ProdTimeline {
  constructor(a) {

    this.HDLOW = new SearchTL
    this.HDLOW.timeline = copyObj(HDLOWtimeline)

    this.BREAK = new SearchTL

    this.HDLOWB = new SearchTL

    this.timeline = []
    this.duration = new TLduration

    this.createTimeline(a)

  }

  createTimeline(a){

    // Specific event time line function
    function specTL(tlArr, name, context){
      for (var i = 0; i < tlArr.length; i++) {

        var tl = tlArr[i] // Set reference to timeline object

        if (a._start >= tl.start && a._end <= (tl.end + 999)) {

          tl.duration = (a._end - a._start);
          tl.durtxt = dhms(tl.duration);

          context[name].isIn = tl // start and ends in

        } else if (a._start <= tl.start && a._end >= (tl.end + 999)) {

          tl.duration = (tl.end + 1000) - tl.start;
          tl.durtxt = dhms(tl.duration);

          context[name].hasBetween.push(tl) // holidays lay between

        } else if (a._start >= tl.start && a._start <= (tl.end + 999)) {

          tl.duration = (tl.end + 1000) - a._start;
          tl.durtxt = dhms(tl.duration);

          context[name].startsIn = tl // starts in holiday and ends later

        } else if (a._end >= tl.start && a._end <= (tl.end + 999)) {

          tl.duration = (a._end) - tl.start;
          tl.durtxt = dhms(tl.duration);

          context[name].endsIn = tl // ends in holiday and start before

        }
      }
    }

    // Get specific HDLOW timeline
    specTL(this.HDLOW.timeline, 'HDLOW', this)

    function timeNot(name, context){

      // Object reference
      var tni = context[name].timeNotIn

      function tniPush(start){ // push new time between item function
        tni.push({
          start: start,
          type: 'PRODUCTION',
          sdate: dateT(new Date(start)),
        })
      }

      function tniPrevious(end){ // add end time to time between item function

        var prev = tni[tni.length - 1]

        prev.end = end
        prev.eDate = dateT(new Date(end))

        prev.duration = (end + 1000) - prev.start
        prev.durtxt = dhms(prev.duration)

        tniPop();
      }

      function tniPop(){ // If the time between is negative (neighbouring HDLOW)
        if ((tni[tni.length - 1].end + 999) < tni[tni.length - 1].start){
          tni.pop();
        }
      }


      if (context[name].startsIn != undefined) { // starts in holiday
        tniPush(context[name].startsIn.end + 1000)
      } else if (context[name].isIn == undefined) { // doesn't start in holliday
        tniPush(a._start)
      }

      // has holidays between
      for (var i = 0; i < context[name].hasBetween.length; i++) {
        var btw = context[name].hasBetween[i]
        tniPrevious(btw.start - 1000) // give previous end time
        tniPush(btw.end + 1000) // push new item with start time
      }

      if (context[name].endsIn != undefined) { // ends in holiday
        tniPrevious(context[name].endsIn.start - 1000)
      } else if (context[name].isIn == undefined){ // doesn't end in holliday
        tniPrevious(a._end - 1000, context)
      }

    };

    timeNot('HDLOW', this)


    // Create break timeline for dates between holidays ------------------
    this.BREAK.timeline = []
    var tnih = this.HDLOW.timeNotIn

    for (var i = 0; i < tnih.length; i++) {

      var sDay = new Date(tnih[i].start).getDay()
      var eDay = new Date(tnih[i].end).getDay()

      var day = 1000 * 60 * 60 * 24

      for (var j = sDay; j <= eDay; j++) {

        var thisDate = new Date(tnih[i].start + ((j - sDay) * day))

        for (var br in BREAK[j]) {

          if (Object.keys(BREAK[j][br])[0].length > 2){
            if (BREAK[j][br].hasOwnProperty(a._zone)){

              var brk = BREAK[j][br][a._zone]; pushBreak(this);

            }
          } else {

            var brk = BREAK[j][br]; pushBreak(this)

          }

          function pushBreak(context){

            var bT = breakTime(thisDate, brk)

            if (
              tnih[i].start < bT.start && bT.end < tnih[i].end // breaks betw
              || bT.start < tnih[i].start && tnih[i].start < bT.end // starts in
              || bT.start < tnih[i].end && tnih[i].end < bT.end // ends in
            ) {

              context.BREAK.timeline.push(bT); return false;

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

    specTL(this.BREAK.timeline, 'BREAK', this)

    this.HDLOWB.timeline = this.HDLOW.hasBetween
    .concat(this.BREAK.hasBetween)
    .sort(function(a,b){
      return a.start - b.start
    })

    this.startsIn = this.BREAK.startsIn || this.HDLOW.startsIn
    this.endsIn = this.BREAK.endsIn || this.HDLOW.endsIn
    this.isIn = this.BREAK.isIn || this.HDLOW.isIn

    if (this.startsIn != undefined) { this.HDLOWB.timeline.unshift(this.startsIn)}
    if (this.endsIn != undefined) { this.HDLOWB.timeline.push(this.endsIn)}
    if (this.isIn != undefined) { this.HDLOWB.timeline.push(this.isIn)}

    specTL(this.HDLOWB.timeline, 'HDLOWB', this)

    timeNot('HDLOWB', this);

    this.timeline = this.HDLOWB.timeline
    .concat(this.HDLOWB.timeNotIn)
    .sort(function(a,b){
      return a.start - b.start
    })

    for (var i = 0; i < this.timeline.length; i++) {

      var type = this.timeline[i].type
      var duration = this.timeline[i].duration

      this.duration[type] += duration

    }

    var dur = this.duration

    dur.STANDSTILL = dur.holiday + dur.layoff + dur.weekend + dur.break
    dur.TOTAL = dur.PRODUCTION + dur.STANDSTILL

    //// TEMP: TO debug time differendes
    dur._checkTotalTime = a._end - a._start
    dur._checkTotalDif = dur._checkTotalTime - dur.TOTAL

    dur.updateTxt()

  }

}



function YMD(date){
  return [
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
  ]
}
