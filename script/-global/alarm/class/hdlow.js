// TimelineEntry ---------------------------------------------------------------// TimelineEntry
class TimelineEntry {
  constructor(start, end, type) { // start & end as date, type as string
    this.start = Date.parse(start)
    this.end = Date.parse(end)
    this.type = type
    this.sDate = dateT(start)
    this.eDate = dateT(end)
  }
}


// Holidays --------------------------------------------------------------------// Holidays
class Holidays {

  constructor(HD) {
    this.timeline = []
    this.createTimeline(HD)
  }

  createTimeline(HD) {

    for (var day in HD) {

      var dp = YMD(HD[day])
      var dayNum = HD[day].getDay()

      var sTime = SHIFTS[dayNum].S1.s.split(':')
      var eTime = SHIFTS[dayNum + 1].N2.e.split(':')

      var sDate = new Date(dp[0], dp[1], dp[2], sTime[0], sTime[1], sTime[2])
      var eDate = new Date(dp[0], dp[1], dp[2], eTime[0], eTime[1], eTime[2])
      eDate = new Date(Date.parse(eDate) + (1000*60*60*24))

      this.timeline.push(new TimelineEntry(sDate, eDate, 'holiday'))

    }

  }
}


// Layoff ----------------------------------------------------------------------// Layoff
class LayOff {
  constructor(LO) {
    this.timeline = []
    this.createTimeline(LO)
  }

  createTimeline(LO){

    for (var day in LO) {

      var dp = YMD(LO[day][0])
      var dayNum = LO[day][0].getDay()

      if (LO[day][1] == 'N') {

        var sTime = SHIFTS[dayNum].N1.s.split(':')
        var eTime = SHIFTS[dayNum + 1].N2.e.split(':')

        var sDate = new Date(dp[0], dp[1], dp[2], sTime[0], sTime[1], sTime[2])
        var eDate = new Date(dp[0], dp[1], dp[2], eTime[0], eTime[1], eTime[2])
        eDate = new Date(Date.parse(eDate) + (1000*60*60*24))

      } else {

        var sTime = SHIFTS[dayNum][LO[day][1]].s.split(':')
        var eTime = SHIFTS[dayNum][LO[day][1]].e.split(':')

        var sDate = new Date(dp[0], dp[1], dp[2], sTime[0], sTime[1], sTime[2])
        var eDate = new Date(dp[0], dp[1], dp[2], eTime[0], eTime[1], eTime[2])

      }

      this.timeline.push(new TimelineEntry(sDate, eDate, 'layoff'))

    }

  }
}


// Weekends --------------------------------------------------------------------// Weekends
class Weekends {
  constructor() {
    this.timeline = []
    this.createTimeline()
  }

  createTimeline(){

    var satSt = Date.parse(new Date(2019,0,5,0,0,0))
    var now = Date.parse(new Date())

    for (var i = satSt; i < now; i += (1000*60*60*24*7) ) {

      var ds = YMD(new Date(i))

      var mon = i + (1000*60*60*24*2)
      var de = YMD(new Date(mon))

      var sTime = SHIFTS[6].W.s.split(':')
      var eTime = SHIFTS[1].W.e.split(':')

      var sDate = new Date(ds[0], ds[1], ds[2], sTime[0], sTime[1], sTime[2])
      var eDate = new Date(de[0], de[1], de[2], eTime[0], eTime[1], eTime[2])

      this.timeline.push(new TimelineEntry(sDate, eDate, 'weekend'))


    }

  }
}


// Add Holiday, LayOff & Weekend timeline and sort by start date ---------------// CONCAT
var HDLOWtimeline = []
.concat(new Holidays(HOLIDAYS).timeline)
.concat(new LayOff(LAYOFF).timeline)
.concat(new Weekends().timeline)
.sort(function(a,b){
  return a.start - b.start
})
