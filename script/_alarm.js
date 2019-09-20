//ALARM OBJECT GENERATOR -------------------------------------------------------
function alarm(data) {

  //alarm part names for object in order of fetched data
  var alarmparts = [
    'datetime','station', '_var', 'comment', 'severity', '_state'
  ];

  var onoff = ['OFF','ON']

  var rgx = {
    st : RegExp(/^[0-9]{4}[a-zA-Z]/),
    z: {
      m: RegExp(/^[0-9]{4}ZM[0-9.]{2,}/),
      s: RegExp(/^[0-9]{4}ZS[0-9.]{2,}/),
      ms: RegExp(/Z[M,S][0-9.]{2,}/),
    },
    dsc: RegExp(/.A[A-E]_.{0,}$/),
    aa: RegExp(/.A[A-E]_/)
  };

  //alarm object
  this.alarm = {};

  //put alarm parts
  for (let i = 0; i < data.length; i++) {
    this.alarm[alarmparts[i]] = data[i]
  };

  this.alarm.statetxt = onoff[parseInt(this.alarm._state)]

  //Regexing ---------------------------------------------------------
  //part1 + description
  if (rgx.dsc.test(this.alarm._var)){

    //Example: 3037ZM02CR01.AD_TrfOutSetInterlock
    //     p2:             .AD_TrfOutSetInterlock
    this.p2 = this.alarm._var.match(rgx.dsc)[0]
    //     p1: 3037ZM02CR01
    this.p1 = this.alarm._var.replace(this.p2,'')
    //     p2:                 TrfOutSetInterlock
    this.p2 = this.p2.replace(this.p2.match(rgx.aa)[0],'')
    this.alarm['description'] = this.p2

  }

  //derived from part 1:                  3037ZM02CR01
  if (rgx.st.test(this.p1)){
    //          _stcode:                  3037
    this.alarm['_stcode'] = this.p1.substr(0,4)

    //is station is OK: extract zone
    if (rgx.z.m.test(this.p1)){
      //            zone:                     ZM02
      this.alarm['zone'] = this.p1.match(rgx.z.ms)[0] //ZM
      this.alarm['_type'] = 'alarm'
    } else if (rgx.z.s.test(this.p1)){
      //            zone:                     ZS02 (not in this example case)
      this.alarm['zone'] = this.p1.match(rgx.z.ms)[0] //ZS
      this.alarm['_type'] = 'safety'
    } else {
      //if no ZM of ZS
      this.alarm['zone'] = 'General'
      this.alarm['_type'] = 'general'
    };

    //remove stcode and zone to retain object:    CR01
    this.alarm['object'] = this.p1
    .replace(this.alarm._stcode,'').replace(this.alarm.zone,'')

    //if station is NOK do nothing and place p1 in desc. (for now)
  } else {
    this.alarm['_stcode'] = 'n/a'
    this.alarm['zone'] = 'n/a'
    this.alarm['object'] = 'n/a'
    this.alarm['description'] = this.alarm._var + ' (alarm format nok!!)'
  }


};





function distinct(alarm_arr){

  var distinct = {}
  // For all alarm rows
  for (var i = 0; i < alarm_arr.length; i++) {
    // For columns in alarm row
    for (var col in alarm_arr[i]) {
      // set name of subobject to name of alarmobject (column) once
      if (distinct[col] == undefined) { distinct[col] = {} }
      // set var name in subobject null
      distinct[col][alarm_arr[i][col]] = 1
    }
  }
  return distinct
}




function active(obj_name, var_name, state_name, state_int_name, dt_name){

  var dist = distinct(window[obj_name]);
  var link_store = distinct(window[obj_name]);
  var linkID = 0;
  var time_store = []


  for (var obj in window[obj_name]) {
    if (window[obj_name].hasOwnProperty(obj)) {

      var a = window[obj_name][obj]
      var v = a[var_name]
      var s = a[state_int_name]
      var dt = a[dt_name]

      if (s == 0){
        a['_linkID'] = linkID
        link_store[var_name][v] = linkID

        time_store[linkID] = Date.parse(dt);

        linkID++

      }

      if (s == 1 && dist[var_name][v] == 1){
        a['_active'] = true
        a[state_name] = 'ACTIVE'
        a['_linkID'] = 'none'
        a['_duration'] = 'none'
      } else {
        a['_active'] = false
        a['_linkID'] = link_store[var_name][v]

        if (s == 1) {
          var dur = time_store[a['_linkID']] - Date.parse(dt)
          a['_duration'] = dur
          time_store[a['_linkID']] = dur
        }


      }

      dist[var_name][v] = 0



    }
  }

  for (var obj in window[obj_name]) {
    if (window[obj_name].hasOwnProperty(obj)) {

      var a = window[obj_name][obj]
      var s = a[state_int_name]

      if (s == 0 && a['_linkID'] != 'none') {
        a['_duration'] = time_store[a['_linkID']]
      } else if ( a['_duration'] == undefined ) {
        a['_duration'] = 'none'
      }

    }
  }

  console.log(time_store)

  console.log(alarms)
  console.log(dist[var_name]);
  console.log(link_store[var_name]);


}
