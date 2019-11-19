// Search TL (to search HDLOWB timelines for matching) -------------------------// TLSearch
class TLSearch {
  constructor() {
    this.isIn = undefined       // event complete in TimelineEntry
    this.startsIn = undefined   // event starts in TimelineEntry
    this.endsIn = undefined     // event ends in TimelineEntry
    this.hasBetween = []        // event has TimelineEntries between
    this.timeNotIn = []         // time not in TimelineEntry
    this.timeline = []          // result timeline
  }
}


// Timeline duration summation object ------------------------------------------// TLduration
class TLduration {
  constructor(){
    this.PRODUCTION = 0         // duration in production (not HDLOWB)
    this.break = 0              // duration in break
    this.layoff = 0             // duration in layoff
    this.holiday = 0            // duration in holiday
    this.weekend = 0            // duration in weekend
    this.STANDSTILL = 0         // sum break, layoff, holiday & weekend
    this.TOTAL = 0              // total duration
  }

  // Create dhms text for durations
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


// Event timeline creator ------------------------------------------------------// ProdTimeline
class ProdTimeline {
  constructor(a) {

    // Create timeline search instances to search the HDLOW, BREAK
    // and after the combined HDLOWB timeline
    this.HDLOW = new TLSearch
    this.BREAK = new TLSearch
    this.HDLOWB = new TLSearch

    // Create a copy of the HDLOWtimeline for every new ProdTimeLine
    // so it's seperated and has no reference to the original
    this.HDLOW.timeline = copyObj(HDLOWtimeline)

    // Create a timeline duration instance to adding up durations
    this.duration = new TLduration

    // The result timeline
    this.timeline = []

    // Fire the method to create the timeline
    this.createTimeline(a)

  }

  createTimeline(a){

    // Get specific HDLOW timeline
    specTL(this.HDLOW.timeline, 'HDLOW', this)

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


    // FUNCTIONS ----------------------------------------------------------     // FUNCTIONS
    // Specific HDLOW, BREAK & combined HDLOWB timeline/event creator
    function specTL(tlArr, name, context){

      // Itterate over all the timelineEntries in HDLOW(B)
      for (var i = 0; i < tlArr.length; i++) {

        var tl = tlArr[i] // Set reference to timeline object

        // Note: tl.end + 999ms to include last second
        if (a._start >= tl.start && a._end <= (tl.end + 999)) {

          // event starts & ends in HDLOW(B)
          // - duration = duration of event & add TimelineEntry to isIn
          tl.duration = (a._end - a._start);
          context[name].isIn = tl

        } else if (a._start <= tl.start && a._end >= (tl.end + 999)) {

          // event has HDLOWB between, starts end ends before & after
          // - duration = duration of TimelineEntry (add last sec)
          //   (adding 1000 is nescesary because last second is not
          //    included in endtime with timelines)
          // - add TimelineEntry to hasBetween
          tl.duration = (tl.end + 1000) - tl.start;
          context[name].hasBetween.push(tl)

        } else if (a._start >= tl.start && a._start <= (tl.end + 999)) {

          // event starts in TimelineEntry end ends after
          // - duration = TimelineEntry end (add last sec) - event start
          // - add TimelineEntry to startsIn
          tl.duration = (tl.end + 1000) - a._start;
          context[name].startsIn = tl ;

        } else if (a._end >= tl.start && a._end <= (tl.end + 999)) {

          tl.duration = (a._end) - tl.start;
          context[name].endsIn = tl;

        }

        tl.durtxt = dhms(tl.duration);
      }
    }


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


    function breakTime(thisDate, time) {

      var sTime = time.s.split(':')
      var eTime = time.e.split(':')

      var dp = YMD(thisDate)

      var sDate = new Date(dp[0], dp[1], dp[2], sTime[0], sTime[1], sTime[2])
      var eDate = new Date(dp[0], dp[1], dp[2], eTime[0], eTime[1], eTime[2])

      return new TimelineEntry(sDate, eDate, 'break')

    }

  }

}


var testAlarm = {
  _start: Date.parse(new Date(2019,0,1,0,0,0)),
  _end: Date.parse(new Date(2019,10,1,0,0,0)),
}

console.log(new ProdTimeline(testAlarm));
