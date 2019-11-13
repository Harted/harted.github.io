// GROUP CLASS -----------------------------------------------------------------
class Group {

  constructor(groupID) {

    this.ID = groupID
    this.alarms = []
    this.collection = []
    this.sev = this.severityObj(['A','B','C','D','E'])

  }

  collect(alarm){
    this.alarms.push(alarm)
    this.collection.push(alarm._var)
  }

  detach(alarm){
    var index = this.collection.indexOf(alarm._var)

    if(index > -1){
      this.collection.splice(index,1)
    };
  }

  checkEmpty(){

    var empty = this.collection.length === 0
    if (empty) {

      // Collection empty and not needed further
      delete this.collection

      // group alarms per severity
      for (var i = 0; i < this.alarms.length; i++) {

        var a = this.alarms[i]

        if(this.sev[a.severity] == undefined){
          this.sev[a.severity]
        }

        this.sev[a.severity].alarms.push(this.alarms[i])

      }

      this.countSev()

    }
    return empty

  }

  time(startEndStr, time){
    this[startEndStr] = time;
    this[startEndStr + 'Txt'] = dateT(new Date(time));
    if (startEndStr === "end") {
      this.duration = this.end - this.start
      this.durtxt = dhms(this.duration)
    }
  }

  severityObj(sevArr){
    var obj = {};
    for (var i = 0; i < sevArr.length; i++) {
      obj[sevArr[i]] = {alarms: []}
    }; return obj;
  }

  countSev(){
    for (var sev in this.sev) {
      if (this.sev.hasOwnProperty(sev)) {
        this.sev[sev].count = this.sev[sev].alarms.length
      }
    }
  }

  getTopSev(top, check){
    for (var sev in this.sev) {
      if (this.sev.hasOwnProperty(sev)) {
        if (sev == top || sev == check) {
          return sev
        }
      }
    }
  }

  createTimeline(groupCnt){

    var gs = Math.floor(this.start / 1000)*1000
    var ge = Math.floor(this.end / 1000)*1000

    this.timeline = []

    var alarmsTSMem = 0
    var topSev = ''
    var sev_obj = {A:false,B:false,C:false,D:false,E:false};

    function resetSevObj(){
      for (var sev in sev_obj) {
        if (sev_obj.hasOwnProperty(sev)) {
          sev_obj[sev] = false
        }
      }
    }

    var startIndex = 0

    var secondArr = []
    for (var i = gs; i < ge; i+=1000) { secondArr.push(i) }

    asyncArr(secondArr, itter, status, after, this, 10);

    // ITTER ---------------------------------------------------------
    function itter(arr, i){

      i = arr[i]

      var alarmsThisSecond = []

      var startIndexSet = false

      // Check active alarms at every second
      for (var j = startIndex; j < this.alarms.length; j++) {

        var a = this.alarms[j]

        var as = Math.floor(a._start / 1000)*1000
        var ae = Math.floor(a._end / 1000)*1000

        if (as <= i && i <= ae) {

          if (!startIndexSet) {
            startIndex = j; startIndexSet = true; // set start index to narrow search when first alarm changes index
          }

          alarmsThisSecond.push(this.alarms[j])
          topSev = this.getTopSev(topSev, a.severity)
          sev_obj[a.severity] = true;
        } else if (as > i) {

          break // break when alarm is later than range for optimalisation

        }

      }

      if(alarmsThisSecond.length != alarmsTSMem){

        this.timeline.push({
          start: i,
          starttxt: dateT(new Date(i)),
          alarms: alarmsThisSecond,
          end: i + 1000,
          endtxt: dateT(new Date(i + 1000)),
          dur: 1000,
          durtxt: dhms(1000),
          top: topSev,
          sev_obj: copyObj(sev_obj)
        })

        topSev = ''
        resetSevObj();

        alarmsTSMem = alarmsThisSecond.length

      } else {

        var t = this.timeline[this.timeline.length - 1]

        t.top = topSev; topSev = ''
        t.sev_obj = copyObj(sev_obj); resetSevObj();
        t.end = i + 1000;
        t.endtxt = dateT(new Date(t.end));
        t.dur = t.end - t.start;
        t.durtxt = dhms(t.dur);

      }
    }

    // STATUS --------------------------------------------------------
    function status(arr, i){ timelineStatus(); };

    // AFTER ---------------------------------------------------------
    function after(arr,i){ groupCnt.count-- ; timelineStatus(); }

    // Show status on interface
    function timelineStatus(){

      // Current count reverse & total group count
      var current = (groupCnt.count * -1) + groupCnt.max
      var max = groupCnt.max

      // Show status
      if (current < max) {
        var txt = 'Creating timeline for group: ' + current + '/' + max
      } else { var txt = ''; };

      $('#timelineStatus span').text(txt)

    }

  }

}
