var alarmlimit = 2000

// SET ALARMS ------------------------------------------------------------------
function setAlarms(data, fn_after, timer, init, context){

  // Reset alarm array
  all_alarms = [];
  alarms = [];

  var data_len = data.length
  var part100 = Math.round(data_len/100)
  var progress = 0

  asyncArr(data, alarmProcess, alarmsStatus, alarmsAfter, this)

  function alarmProcess(arr, i){

    all_alarms.push(new alarm(arr[i]).alarm)

  }

  function alarmsStatus(arr, i){

    var len = arr.length
    var progress = Math.round( i / len * 100 )

    statusFields('Processing alarms: ' + progress + '%', 'progress')

  }

  function alarmsAfter(arr, i){

    // Analyze alarms (active, linkId, duration)
    analyze(afterAnalyze, this)

    function afterAnalyze() {

      // Filter alarms by selected buttons (Only active, Types & Production)
      all_alarms = infilter(all_alarms)

      // Alarm limit -----------------------------------------------------
      var len

      if (all_alarms.length < alarmlimit) {
        len = all_alarms.length
      } else {
        len = alarmlimit
      }

      for (let i = 0; i < len; i++) {
        alarms.push(all_alarms[i])
      }

      // Fill no data item in alarms when there's no data ---------------
      if (alarms.length == 0) {
        alarms = [{
          comment: "",
          description: "",
          object: "",
          severity: "",
          station: "",
          zone: "",
          _active: false,
          _datetime: "No Data",
          _duration: -1,
          _durtxt: "n/a",
          _linkID: -1,
          _state: "",
          statetxt: "",
          _stcode: "",
          _type: "",
          _var: "No Data",
        }];
      }

      fn_after.call(context, timer, init)

    }
  }
}












// ALARM OBJECT GENERATOR ------------------------------------------------------
function alarm(data) {

  // Alarm part names for object in order of fetched data
  var alarmparts = [
    '_datetime','station', '_var', 'comment', 'severity', '_state'
  ];

  // Local alarm object
  this.alarm = {};

  // Put alarm parts into the object
  for (let i = 0; i < data.length; i++) {
    this.alarm[alarmparts[i]] = data[i]
  };


  // FORMATTING DATA ------------------------------------------------------

  // Set statetxt 0=OFF 1=ON
  var onoff = ['OFF','ON']
  this.alarm.statetxt = onoff[parseInt(this.alarm._state)]

  // Station name & zone
  for (var zone in TIA_GC) {
    if (TIA_GC.hasOwnProperty(zone)) {
      if (TIA_GC[zone].hasOwnProperty(this.alarm.station)) {
        this.alarm._zone = zone
        if (TIA_GC[zone][this.alarm.station].hasOwnProperty('name')){
          this.alarm._stntxt = TIA_GC[zone][this.alarm.station].name
        }
      }
    }
  }


  // REGEX expressions
  var rgx = {
    st : /^[0-9]{4}[a-zA-Z]/,
    z: {
      m: /^[0-9]{4}ZM[0-9.]{2,}/,
      s: /^[0-9]{4}ZS[0-9.]{2,}/,
      ms: /Z[M,S][0-9.]{2,}/,
    },
    dsc: /.A[A-E]_.{0,}$/,
    aa: /.A[A-E]_/,
    mode:{
      a: /[Mm]ode.{0,}[Aa]uto/,
      m: /[Mm]ode.{0,}[Mm]an/,
    },
    lck: /[Ii]nterlock/,
    prod: {
      p: /Prod/,
      in: /[Ii]nfeed/,
      out: /[Oo]utfeed/,
      andon: /[Aa]ndon/,
      cr: /StopCR/,
    }
  };

  // Split object and set descrition          3037ZM02CR01.AD_TrfOutSetInterlock
  if (rgx.dsc.test(this.alarm._var)){

    //Part 2:                                             .AD_TrfOutSetInterlock
    this.p2 = this.alarm._var.match(rgx.dsc)[0]

    //Part 1:                                                       3037ZM02CR01
    this.p1 = this.alarm._var.replace(this.p2,'')

    //Description: Part 2 - Severity                          TrfOutSetInterlock
    this.p2 = this.p2.replace(this.p2.match(rgx.aa)[0],'')
    this.alarm['description'] = this.p2

  };

  // Station - Zone - Object                                        3037ZM02CR01
  if (rgx.st.test(this.p1)){
    //          _stcode:                                            3037
    this.alarm['_stcode'] = this.p1.substr(0,4)

    //is station is OK: extract zone
    if (rgx.z.m.test(this.p1)){
      //        modezone:                                               ZM02
      this.alarm['zone'] = this.p1.match(rgx.z.ms)[0]

      // TYPES +++++++++++++++++++++++++++++++++++++++++++++++++++

      if (rgx.mode.a.test(this.alarm._var)) {
        this.alarm['_type'] = 'autonotstarted'
      } else if (rgx.mode.m.test(this.alarm._var)) {
        this.alarm['_type'] = 'manual'
      } else if (rgx.lck.test(this.alarm._var)) {
        this.alarm['_type'] = 'interlock'
      } else if (rgx.prod.p.test(this.alarm._var)) {

        this.alarm['_type'] = 'production '
        if (rgx.prod.in.test(this.alarm._var)) {
          this.alarm['_type'] += 'inout'
        } else if (rgx.prod.out.test(this.alarm._var)) {
          this.alarm['_type'] += 'inout'
        } else if (rgx.prod.andon.test(this.alarm._var)) {
          this.alarm['_type'] += 'andon'
        } else if (rgx.prod.cr.test(this.alarm._var)) {
          this.alarm['_type'] += 'controlroom'
        } else {
          this.alarm['_type'] += 'general'
        }

      } else {
        this.alarm['_type'] = 'alarm'
      }

      // END +++++++++++++++++++++++++++++++++++++++++++++++++++++


    } else if (rgx.z.s.test(this.p1)){
      //      safetyzone:                                               ZS02
      this.alarm['zone'] = this.p1.match(rgx.z.ms)[0]
      this.alarm['_type'] = 'safety'
    } else {
      //if no ZM of ZS
      this.alarm['zone'] = 'General'

      if (rgx.prod.p.test(this.alarm._var)) {

        this.alarm['_type'] = 'production '
        if (rgx.prod.in.test(this.alarm._var)) {
          this.alarm['_type'] += 'inout'
        } else if (rgx.prod.out.test(this.alarm._var)) {
          this.alarm['_type'] += 'inout'
        } else if (rgx.prod.andon.test(this.alarm._var)) {
          this.alarm['_type'] += 'andon'
        } else if (rgx.prod.cr.test(this.alarm._var)) {
          this.alarm['_type'] += 'controlroom'
        } else {
          this.alarm['_type'] += 'general'
        }

      } else {
        this.alarm['_type'] = 'general'
      }


    };

    //remove stcode and zone to retain object:                              CR01
    this.alarm['object'] = this.p1
    .replace(this.alarm._stcode,'').replace(this.alarm.zone,'')

    //if station is NOK do nothing and place _var in desc.
  } else {

    this.alarm['_stcode'] = 'n/a'
    this.alarm['zone'] = 'n/a'
    this.alarm['object'] = 'n/a'
    this.alarm['description'] = this.alarm._var
    this.alarm['_type'] = 'formatnok'

  }


};





// INPUT FILTER ----------------------------------------------------------------
function infilter(alarms){

  var new_alarms = [] // to store filtered alarms

  for (var i = 0; i < alarms.length; i++) {

    var filtered = false

    if (alarms[i]._type.search('production') < 0) {             // TYPES

      // Check if type of alarm is filered
      if(!FILTERS.at[alarms[i]._type]) {filtered = true}

    } else {                                                    // PRODUCTION

      // split production alarm
      var sp = alarms[i]._type.split(' ')

      // check if last part of porduction type alarm is filtered
      if(!FILTERS.prod[sp[1]]) {filtered = true}

    }

    // filter non active alarms when set                        // ONLY ACTIVE
    if(FILTERS.only.active && !alarms[i]._active) {filtered = true}


    // PUSH alarm in filtered list when filtered is false
    if (!filtered) { new_alarms.push(alarms[i]) }

  }

  return new_alarms; // return the filtered array

}







// Make a distinct list of alarms ----------------------------------------------
function distinct(alarm_arr, filter, fn_after, context){

  filter = filter || false

  var distinct = {}

  if(fn_after == undefined){
    for (var i = 0; i < alarm_arr.length; i++) {
      distProcess(alarm_arr, i)
    }
  } else {
    asyncArr(alarm_arr, distProcess, distStatus, distAfter, this)
  }

  // For all alarm rows
  function distProcess(alarm_arr, i) {
    // For columns in alarm row
    for (var col in alarm_arr[i]) {
      // Only filter objects
      if (col.search('_') < 0 || !filter){
        // set name of subobject to name of alarmobject (column) once
        if (distinct[col] == undefined) { distinct[col] = {} }
        // set var name in subobject null
        distinct[col][alarm_arr[i][col]] = 1
      }
    }
  }

  function distStatus(arr, i){

    var len = arr.length
    var progress = Math.round( i / len * 100 )

    statusFields('Finding distinct alarms: ' + progress + '%', 'progress')

  }

  function distAfter(){

    fn_after.call(context, distinct)

  }

  return distinct

}








// Analyze alarms for active, duration and link --------------------------------
function analyze(fn_after, context){


  var dist = distinct(all_alarms, false, afterDistinct, this);

  function afterDistinct(dist){

    var link_store = JSON.parse(JSON.stringify(dist))

    var linkID = 0;
    var linkIDn = -1;
    var id_set = []
    var time_store = []

    asyncArr(all_alarms, analyzeP1, analyzeS1, analyzeA1, this);

    function analyzeP1(arr, i){

      //String referenced VARS  --------------------------------------
      var a = arr[i]     //alarm row
      var v = a._var              //var name
      var s = a._state            //state integer
      var dt = a._datetime        //datetimestamp

      // OFF event ---------------------------------------------------
      // - Assign link ID
      // - Store link ID in distinct object to later assign to ON event
      // - Store time to link array index to later calculate duration
      //    at the ON event
      // - Add 1 to link ID for next event
      if (s == 0){
        a._linkID = linkID;
        a._active = false;
        link_store._var[v] = linkID;
        id_set[linkID] = false
        time_store[linkID] = sDateParse(dt);
        linkID++;

      } else if (s == 1 && dist._var[v] == 1){
        // First distinct event is ON event = ACTIVE -------------------
        // REVIEW: may ONLY activate when end date is Date.now()
        // - Assign active and set true
        // - Change state text to ACTIVE
        // - This event has no link but a duraction to now

        a._linkID = linkIDn

        if (TIME.rel) {

          a._active = true
          a.statetxt = 'ACTIVE'

          var dur = Date.now() - sDateParse(dt)
          a._duration = dur
          a._durtxt = dhms(dur)

        } else {

          a._active = false

          a._duration = -1
          a._durtxt = 'n/a'

        }

        linkIDn --
      } else if (s == 1) {
        // Not active ON events
        // - Assing stored ID (stored at OFF event)
        // - Link ID is set... when only OFF event this will be false
        // - Duration = time at OFF event minus time at ON event
        // - Duration is stored to later assign to off event
        a._linkID = link_store._var[v]
        id_set[a._linkID] = true
        var dur = time_store[a._linkID] - sDateParse(dt)
        a._duration = dur // value in ms
        a._durtxt = dhms(dur) // value in dhms
        time_store[a._linkID] = dur
      }

      // Set it to zero when the first distinct event is found.
      // so the next same event can't be active
      dist._var[v] = 0

    }

    function analyzeS1(arr, i){

      var len = arr.length
      var progress = Math.round( i / len * 100 )

      statusFields('Analyzing ON events: ' + progress + '%', 'progress')

    }

    function analyzeA1(arr, i){

      statusFields('Analyzing ON events: 100%', 'progress')

      asyncArr(arr, analyzeP2, analyzeS2, analyzeA2, this);

      function analyzeP2(arr, i){

        //String referenced VARS  --------------------------------------
        var a = arr[i]   //alarm row
        var v = a._var             //var name
        var s = a._state      //state integer

        if (s == 0 && a._linkID != 'none' && id_set[a._linkID] == true) {
          // Off event that has a link ID and the ON event's ID is also set
          // - Assing stored duration and durationtxt to the OFF event
          a._duration = time_store[a._linkID]
          a._durtxt = dhms( time_store[a._linkID])
        } else if ( a._duration == undefined ) {
          // Event without duration set
          // - Assing not available and -1
          a._duration = -1
          a._durtxt = 'n/a'
          a._linkID = linkIDn
          linkIDn--
        };

      };

      function analyzeS2(arr, i){

        var len = arr.length
        var progress = Math.round( i / len * 100 )

        statusFields('Analyzing OFF events: ' + progress + '%', 'progress')

      }

      function analyzeA2(arr, i){

        statusFields('Done ', 'done')

        setTimeout(function () {
          fn_after.call(context)
        }, 10);

      }
    }
  }


};

// For safari
function sDateParse(date){
  date = date.replace(/-/g,'/')
  date = date.split('.')

  var d = new Date(date[0]);
  return Date.parse(d)+parseInt(date[1]);
}

// Function: Convert ms to dhms string format ----------------------------------
function dhms(ms) {

  var day_c = (1000 * 60 * 60 * 24)
  var hrs_c = (1000 * 60 * 60)
  var min_c = (1000 * 60)
  var sec_c = 1000

  if (ms < 10000) {var fx = 1} else {var fx = 0}

  var days = Math.floor(ms / day_c);
  ms -= days * day_c
  var hrs = Math.floor(ms / hrs_c);
  ms -= hrs * hrs_c
  var min = Math.floor(ms / min_c);
  ms -= min * min_c
  var sec = (ms / sec_c).toFixed(fx);

  if (days > 0) {
    return days + 'd' + hrs + 'h' +  min + 'm' + sec + 's'
  } else if (hrs > 0) {
    return hrs + 'h' +  min + 'm' + sec + 's'
  } else if (min > 0) {
    return min + 'm' + sec + 's'
  } else {
    return sec + 's'
  };

};
