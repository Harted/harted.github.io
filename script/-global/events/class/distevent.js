// DISTINCT ALARMS CLASS -------------------------------------------------------
class DistEvents {

  constructor(events) {

    // Create distinct object by _var
    this.dist = new Distinct(events, ['_var']);
    this.ordered = {}

  }

  // Add alarm to distinctEvents ------------------------------------------     // add
  add(a){

    // ON event who has a link with an OFF event
    if (a._state == 1 && a._linkID > -1) {

      // If distinct is 1 it's undefined so create empty array
      if (this.dist._var[a._var] == 1) { this.dist._var[a._var] = []}

      // Add alarm
      this.dist._var[a._var].push(a)

    }

  }

  // Order distinct events ------------------------------------------------     // order
  order(){

    var obj = this.dist._var // reference to distinct object

    // itterate over distinct vars
    for (var v in obj) {

      // if it has events in it
      if (obj[v].length > 0) {

        // Set zone, station, severity and count vor distinct element
        // - Got form first events in array
        //    (values are the same for all the events in this array)
        var zn = obj[v][0]._zone
        var stn = obj[v][0].station
        var sev = obj[v][0].severity
        var cnt = obj[v][0]._count

        var o = this.ordered // set reference to ordered

        // Define if undefined
        if( o[zn] == undefined) { o[zn] = {} }
        if( o[zn][stn] == undefined) { o[zn][stn] = {} }
        if( o[zn][stn][sev] == undefined) { o[zn][stn][sev] = {
          distevents: [],
          count: 0,
        }}

        var sevObj = o[zn][stn][sev] // Set reference to severity level

        // Push alarm to
        sevObj.distevents.push({

          // From event
          count: cnt.count,
          duration: cnt.duration,
          durtxt: cnt.durtxt,

          // From event timeline
          PRODUCTION: cnt.fromTL.PRODUCTION,
          STANDSTILL: cnt.fromTL.STANDSTILL,
          TOTAL: cnt.fromTL.TOTAL,
          break: cnt.fromTL.break,
          holiday: cnt.fromTL.holiday,
          layoff: cnt.fromTL.layoff,
          weekend: cnt.fromTL.weekend,

          // Add _var name and the ON events it contains
          _var: v,
          events: obj[v]

        })

        // Count how many events/severity
        sevObj.count += cnt.count

        // Delete obj from distinct when no events are present
      } else { delete obj[v] };

    }

  }


  // Sort distinct events -------------------------------------------------     // sort
  sort(mode){

    var o = this.ordered

    for (var z in o) {
      for (var st in o[z]) {
        for (var sev in o[z][st]) {

          if (sev.indexOf('_') != 0) {

            var arr = o[z][st][sev].distevents

            arr = arr.sort(function(a,b) {
              return a[mode] - b[mode];
            });

            arr = arr.reverse()

          }
        }
      }
    }

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

        // Count total events / station
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


            for (var i = 0; i < sv.distevents.length; i++) {

              // Calculate percentage of events/severity
              var a = sv.distevents[i]
              setPercentage(sv, a, selection)

            }


          }
        }
      }
    }

    // Set percentage function --------------------------------------------     //setPercentage
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
