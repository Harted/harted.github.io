// SET ALARMS ------------------------------------------------------------------
function setAlarms(data){

  alarms = [];

  // NO data

  for (let i = 0; i < data.length; i++) {
    alarms.push(new alarm(data[i]).alarm)
  };

  analyze('alarms','_var','statetxt','_state', '_datetime')

  alarms = infilter(alarms)

  // NO data
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
      _durtxt: "",
      _linkID: -1,
      _state: "",
      statetxt: "",
      _stcode: "",
      _type: "",
      _var: "No Data",
    }];
  }

}


// INPUT FILTER ----------------------------------------------------------------
function infilter(alarms){

  var new_alarms = []

  for (var i = 0; i < alarms.length; i++) {

    var filtered = false

    if (alarms[i]._type.search('production') < 0) {

      if(!FILTERS.at[alarms[i]._type]) {filtered = true}

    } else {
      var sp = alarms[i]._type.split(' ')

      if(!FILTERS.prod[sp[1]]) {filtered = true}
    }

    if(FILTERS.only.active && !alarms[i]._active) {filtered = true}

    if (!filtered) { new_alarms.push(alarms[i]) }

  }

  return new_alarms;

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
      this.alarm['_type'] = 'general'
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




function distinct(alarm_arr, filter){

  filter = filter || false

  var distinct = {}
  // For all alarm rows
  for (var i = 0; i < alarm_arr.length; i++) {
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
  return distinct
}



//
function analyze(obj_name, var_name, state_name, state_int_name, dt_name){

  var dist = distinct(window[obj_name]);
  var link_store = distinct(window[obj_name]);
  var linkID = 0;
  var linkIDn = -1;
  var id_set = []
  var time_store = []


  for (var obj in window[obj_name]) {
    if (window[obj_name].hasOwnProperty(obj)) {

      //String referenced VARS  --------------------------------------
      var a = window[obj_name][obj]   //alarm row
      var v = a[var_name]             //var name
      var s = a[state_int_name]       //state integer
      var dt = a[dt_name]             //datetimestamp

      // OFF event ---------------------------------------------------
      // - Assign link ID
      // - Store link ID in distinct object to later assign to ON event
      // - Store time to link array index to later calculate duration
      //    at the ON event
      // - Add 1 to link ID for next event
      if (s == 0){
        a['_linkID'] = linkID;
        a['_active'] = false;
        link_store[var_name][v] = linkID;
        id_set[linkID] = false
        time_store[linkID] = sDateParse(dt);
        linkID++;

      } else if (s == 1 && dist[var_name][v] == 1){
        // First distinct event is ON event = ACTIVE -------------------
        // REVIEW: may ONLY activate when end date is Date.now()
        // - Assign active and set true
        // - Change state text to ACTIVE
        // - This event has no link and no duration
        a['_active'] = true
        a[state_name] = 'ACTIVE'
        a['_linkID'] = linkIDn
        a['_duration'] = -1
        a['_durtxt'] = 'n/a'
        linkIDn --
      } else if (s == 1) {
        // Not active ON events
        // - Assing stored ID (stored at OFF event)
        // - Link ID is set... when only OFF event this will be false
        // - Duration = time at OFF event minus time at ON event
        // - Duration is stored to later assign to off event
        a['_linkID'] = link_store[var_name][v]
        id_set[a['_linkID']] = true
        var dur = time_store[a['_linkID']] - sDateParse(dt)
        a['_duration'] = dur // value in ms
        a['_durtxt'] = dhms(dur) // value in dhms
        time_store[a['_linkID']] = dur
      }
    };

    // Set it to zero when the first distinct event is found.
    // so the next same event can't be active
    dist[var_name][v] = 0

  }

  // Second loop
  for (var obj in window[obj_name]) {
    if (window[obj_name].hasOwnProperty(obj)) {

      //String referenced VARS  --------------------------------------
      var a = window[obj_name][obj]   //alarm row
      var v = a[var_name]             //var name
      var s = a[state_int_name]       //state integer

      if (s == 0 && a['_linkID'] != 'none' && id_set[a['_linkID']] == true) {
        // Off event that has a link ID and the ON event's ID is also set
        // - Assing stored duration and durationtxt to the OFF event
        a['_duration'] = time_store[a['_linkID']]
        a['_durtxt'] = dhms( time_store[a['_linkID']])
      } else if ( a['_duration'] == undefined ) {
        // Event without duration set
        // - Assing not available and -1
        a['_duration'] = -1
        a['_durtxt'] = 'n/a'
        a._linkID = linkIDn
        linkIDn--
      };
    };
  };
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
