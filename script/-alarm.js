var alarmLimit = 1000
var groups = {}

// SET ALARMS ------------------------------------------------------------------
function setAlarms(data, fn_after, timer, init, context){

  // Reset alarm array
  all_alarms = [];
  alarms = [];

  var data_len = data.length
  var part100 = Math.round(data_len/100)
  var progress = 0

  // Async Create Alarms
  asyncArr(data, alarmProcess, alarmsStatus, alarmsAfter, this) // ------------- ASYNC DRIVER ***

  function alarmProcess(arr, i){ // -------------------------------------------- PROCESS

    all_alarms.push(new alarm(arr[i]).alarm)

  }

  function alarmsStatus(arr, i){ // -------------------------------------------- STATUS

    var len = arr.length
    var progress = Math.round( i / len * 100 )

    statusFields('Processing alarms: ' + progress + '%', 'progress')

  }

  function alarmsAfter(arr, i){

    // Filter alarms by selected buttons (Only active, Types & Production)
    all_alarms = infilter(all_alarms)

    // Analyze alarms (active, linkId, duration)
    analyze(afterAnalyze, this)

    function afterAnalyze() { // ----------------------------------------------- AFTER


      console.log(all_alarms);

      // Alarm limit -----------------------------------------------------
      var len

      if (all_alarms.length < alarmLimit) {
        len = all_alarms.length
      } else {
        len = alarmLimit
      }

      for (let i = 0; i < len; i++) {
        alarms.push(all_alarms[i])
      }


      // Alarm parts ----------------------------------------------------
      alarmParts = []

      for (let i = 0; i < all_alarms.length; i++) {

        p = Math.ceil((i+1)/alarmLimit) - 1

        if (alarmParts[p] == undefined) {
          alarmParts[p] = []
        }

        alarmParts[p].push(all_alarms[i])

      }

      alarmPages();

      // Fill no data item in alarms when there's no data ---------------
      if (all_alarms.length == 0) {
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
          _group: {stn:'',num:''},
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







function alarmPages(){

  if(all_alarms.length > alarmLimit){

    var pages = alarmParts.length
    var v
    var v_old = 0

    $('#pagepick').addClass('display')
    $('#pages').text('Pages: ' + pages)
    $('#page').attr('max', pages)

    $('#pagepick input[type=number]').on('input', pageChange)

    function pageChange() {

      v = $(this).val()

      if (v > pages) {v = pages}
      if (v < 1 && v != '' ) {v = 1}

      $(this).val(v)

      if(!Number.isNaN(parseInt(v))){

        $(this).off('keyup').on('keyup',enter)
        .off('focusout').on('focusout',pageConfirm)

        function enter(event){

          if (event.keyCode == 13) {
            pageConfirm();
          }
        }
      }

      function pageConfirm(){
        if(v != v_old){

          alarms = alarmParts[v - 1]

          setTable()
          responsive();
          tableFilter();

          v_old = v

        }
      }
    }
  } else {
    $('#pagepick').removeClass('display')
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

    //TEMP: for _var without stationscode
    if(i == 2 && this.alarm._var.match(/^[0-9]{3,}/) == null){
      this.alarm._var = '(' + this.alarm.station.match(/[0-9]{3,}/) + ')' + this.alarm._var
    }


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
      m: /[Mm]ode.{0,}[Mm]an.{0,}[Mm]ode/,
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

    if (this.alarm.object == "") {
      this.alarm.object = "n/a"
    }

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

    if (alarms[i]._type.search('production') < 0) {                             // TYPES

      // Check if type of alarm is filered
      if(!FILTERS.at[alarms[i]._type]) {filtered = true}

    } else {                                                                    // PRODUCTION

      // split production alarm
      var sp = alarms[i]._type.split(' ')

      // check if last part of porduction type alarm is filtered
      if(!FILTERS.prod[sp[1]]) {filtered = true}

    }

    // filter non active alarms when set                                        // ONLY ACTIVE
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
        // set var name in subobject
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
      var date = sDateParse(a._datetime)

      a._shift = getShift(date)

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
        time_store[linkID] = date;
        linkID++;

        a._end = date

      } else if (s == 1 && dist._var[v] == 1){
        // First distinct event is ON event = ACTIVE -------------------
        // - Assign active and set true
        // - Change state text to ACTIVE
        // - This event has no link but a duraction to now

        a._linkID = linkIDn

        if (TIME.rel) {

          a._active = true
          a.statetxt = 'ACTIVE'

          var dur = Date.now() - date
          a._duration = dur
          a._durtxt = dhms(dur)

          a._start = date
          a._end = 'active'

        } else {

          a._active = true

          a._duration = -1
          a._durtxt = 'n/a'

          a._start = date
          a._end = 'unknown'

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

        a._end = time_store[a._linkID]
        a._start = date

        var dur = time_store[a._linkID] - date
        a._duration = dur // value in ms
        a._durtxt = dhms(dur) // value in dhms
        time_store[a._linkID] = date

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

      asyncArr(arr, analyzeP2, analyzeS2, analyzeA2, this);

      function analyzeP2(arr, i){

        //String referenced VARS  --------------------------------------
        var a = arr[i]   //alarm row
        var v = a._var             //var name
        var s = a._state      //state integer
        var date = sDateParse(a._datetime)

        if (s == 0 && a._linkID != 'none' && id_set[a._linkID] == true) {
          // Off event that has a link ID and the ON event's ID is also set
          // - Assing stored duration and durationtxt to the OFF event
          a._start = time_store[a._linkID]

          var dur = date - time_store[a._linkID]
          a._duration = dur
          a._durtxt = dhms(dur)

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

        var len = arr.length //len for reverse itteration
        var g = {} //to store temporary groups
        var gNum = 1 // to increment group number with each new group


        // Group class
        class Group {

          constructor(groupNumber, zone, station) {

            this.num = groupNumber

            if(zone != undefined && station != undefined){
              this.zone = zone;
              this.stn = station;
              this.alarms = []
              this.collection = []
              this.sev = this.severityObj(['A','B','C','D','E'])
            }

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

                var a = new CurrentAlarm(this.alarms[i])

                if(this.sev[a.sev] == undefined){
                  this.sev[a.sev]
                }

                this.sev[a.sev].alarms.push(this.alarms[i])

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

          createTimeline(){

            var gs = Math.floor(this.start / 1000)*1000
            var ge = Math.floor(this.end / 1000)*1000

            this.timeline = []

            var alarmsTSMem = ''
            var topSev = ''
            var sev_obj = {A:false,B:false,C:false,D:false,E:false};

            function resetSevObj(){
              for (var sev in sev_obj) {
                if (sev_obj.hasOwnProperty(sev)) {
                  sev_obj[sev] = false
                }
              }
            }

            for (var i = gs; i < ge; i+=1000) {

              var alarmsThisSecond = []

              // Check active alarms at every second
              for (var j = 0; j < this.alarms.length; j++) {

                var a = new CurrentAlarm(this.alarms[j])



                var as = Math.floor(a.s / 1000)*1000
                var ae = Math.floor(a.e / 1000)*1000

                if (as <= i && i <= ae) {
                  alarmsThisSecond.push(this.alarms[j])
                  topSev = this.getTopSev(topSev, a.sev)
                  sev_obj[a.sev] = true;
                }

              }

              if(JSON.stringify(alarmsThisSecond) != alarmsTSMem){

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

                alarmsTSMem = JSON.stringify(alarmsThisSecond)

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

        }


        // Curent alarm class (to work with smaller vars)
        class CurrentAlarm {
          constructor(alarm) {
            this.cmt = alarm.comment;
            this.dsc = alarm.description;
            this.obj = alarm.object;
            this.sev = alarm.severity;
            this.stx = alarm.statetxt;
            this.stn = alarm.station;
            this.zm = alarm.zone;

            this.act = alarm._active;
            this.dt = alarm._datetime;
            this.dur = alarm._duration;
            this.dtx = alarm._durtxt;
            this.e = alarm._end;
            this.lID = alarm._linkID;
            this.sft = alarm._shift;
            this.s = alarm._start;
            this.st = alarm._state;
            this.snc = alarm._stcode;
            this.stt = alarm._stntxt;
            this.tpe = alarm._type;
            this.var = alarm._var;
            this.zn = alarm._zone;
          }
        }


        //// TEMP: Don't analyze groups in live view
        if (window.location.pathname == '/live.html'){
          fn_after.call(context)
        } else {
          asyncArr(arr, analyzeP3, analyzeS3, analyzeA3, this)
        }


        // GROUPS --------------------------------------------------------------
        function analyzeP3(arr, i){

          // Reverse itteration
          i = (len - 1) - i

          // Create current alarm object
          var a = new CurrentAlarm(arr[i])

          // GROUP DECISIONS ----------------------------------------------
          if (!a.act && a.st == 1) {                                            // ON event

            // create new group for station when undefined
            // - set to undefinded when last alarms is removed from collection
            if (g[a.stn] == undefined) {
              g[a.stn] = new Group(gNum, a.zn, a.stn); gNum ++
              g[a.stn].time("start", a.s)
            }

            // Collect on event
            g[a.stn].collect(arr[i])

            // Give event group number
            arr[i]._group = new Group(g[a.stn].num)

          } else if (g[a.stn] != undefined && a.st == 0) {                      // OFF event (with defined group)

            // Detach event in collection with OFF event
            g[a.stn].detach(arr[i])

            // Give event group number
            arr[i]._group = new Group(g[a.stn].num)

            // Set group to undefined so a new group wil be created on the
            // next itteration when the collection is empty
            if (g[a.stn].checkEmpty()) {

              g[a.stn].time("end", a.e);
              g[a.stn].createTimeline();

              arr[i]._group = copyObj(g[a.stn]);

              g[a.stn] = undefined;

            };

          } else if ((g[a.stn] == undefined && a.st == 0) || a.act) {           // OFF event (without active group) || ACTIVE event

            arr[i]._group = new Group(0)

          }

        }

        function analyzeS3(arr, i){

          var len = arr.length
          var progress = Math.round( i / len * 100 )

          statusFields('Analyzing alarm groups: ' + progress + '%', 'progress')

        }

        function analyzeA3(arr, i){

          statusFields('Done ', 'done')

          setTimeout(function () {

            //// TEMP: Groups length for not showing groups when more then one station
            groups = {}

            for (var i = 0; i < arr.length; i++) {
              if (arr[i]._group.hasOwnProperty('alarms')) {
                groups[arr[i].station] = true;
              }
            }




            fn_after.call(context)

          }, 1);

        }
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
    return days + 'd' + hrs + 'h' +  (min + Math.round(sec/60)) + 'm'
  } else if (hrs > 0) {
    return hrs + 'h' +  min + 'm' + sec + 's'
  } else if (min > 0) {
    return min + 'm' + sec + 's'
  } else {
    return sec + 's'
  };

};



function copyObj(obj){
  return JSON.parse(JSON.stringify(obj))
}
