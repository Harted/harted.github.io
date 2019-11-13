// DISTINCT ALARMS CLASS -------------------------------------------------------
class DistAlarms {

  constructor(alarms) {
    this.dist = new Distinct(alarms, ['_var']);
    this.ordered = {}
  }

  addDist(a){

    if (a._state == 1 && a._linkID > -1) {

      if (this.dist._var[a._var] == 1) {
        this.dist._var[a._var] = []
      }

      this.dist._var[a._var].push(a)

    }

  }

  order(){

    var obj = this.dist._var

    for (var v in obj) {

      if (obj[v].length > 0) {

        var zn = obj[v][0]._zone
        var stn = obj[v][0].station
        var sev = obj[v][0].severity
        var cnt = obj[v][0]._count

        var o = this.ordered

        if( o[zn] == undefined) { o[zn] = {} }
        if( o[zn][stn] == undefined) { o[zn][stn] = {} }
        if( o[zn][stn][sev] == undefined) { o[zn][stn][sev] = {
          alarms: [],
          count: 0,
        }}

        var sevObj = o[zn][stn][sev]

        sevObj.alarms.push({
          count: cnt.count,
          duration: cnt.duration,
          durtxt: cnt.durtxt,
          PRODUCTION: cnt.fromTL.PRODUCTION,
          STANDSTILL: cnt.fromTL.STANDSTILL,
          TOTAL: cnt.fromTL.TOTAL,
          break: cnt.fromTL.break,
          holiday: cnt.fromTL.holiday,
          layoff: cnt.fromTL.layoff,
          weekend: cnt.fromTL.weekend,
          _var: v,
          obj: obj[v]
        })

        sevObj.count += cnt.count



      } else { delete obj[v] };

    }

  }

  sort(mode){

    var o = this.ordered

    for (var z in o) {
      for (var st in o[z]) {
        for (var sev in o[z][st]) {

          if (sev.indexOf('_') != 0) {

            var arr = o[z][st][sev].alarms

            arr = arr.sort(function(a,b) {
              return a[mode] - b[mode];
            });

            arr = arr.reverse()

          }
        }
      }
    }

    console.log('Sorted by ' + mode, o);

  }

  calc(){

    var selection = [
      'count', //'duration', 'PRODUCTION', 'STANDSTILL',
      //'break', 'holiday', 'layoff', 'weekend'
    ]

    for (var zone in this.ordered) {
      for (var stn in this.ordered[zone]) {

        var st = this.ordered[zone][stn]
        st._total = {count: 0}

        // Count total alarms / station
        for (var sev in st) {

          if (sev.indexOf('_') != 0) { // Don't include '_total'
            var sv = this.ordered[zone][stn][sev]
            st._total.count += sv.count
          }

        }

        // Calculate percentages
        for (var sev in st) {

          if (sev.indexOf('_') != 0) {

            var sv = this.ordered[zone][stn][sev]
            setPercentage(st._total, sv, selection)


            for (var i = 0; i < sv.alarms.length; i++) {

              // Calculate percentage of alarm/severity
              var a = sv.alarms[i]
              setPercentage(sv, a, selection)

            }


          }
        }
      }
    }

    // Set percentage function
    function setPercentage(top, sub, sel){

      sub.perc = {}

      for (var i = 0; i < sel.length; i++) {
        var s = sel[i]

        if (sev[s] == 0) {
          sub.perc[s] = 0
        } else {
          sub.perc[s] = roundP(sub[s] / top[s] * 100,2)
        }
      }

    }

  }
}
