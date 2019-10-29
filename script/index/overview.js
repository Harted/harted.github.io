var OVERVIEW

function makeOverview(){

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
