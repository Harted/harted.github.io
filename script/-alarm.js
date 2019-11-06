// GLOBAL alarms var -----------------------------------------------------------
var alarms
var allAlarms, filteredAlarms
var alarmParts
var groups = {}
var groupsNumRef = {}



// TODO:
// - Fix alarmFilter and show butons
// - replace 'alarms' by 'visibleAlarms'





// MASTER ALARMS FUNCTION ------------------------------------------------------
function Alarms(data, fn_after, timer, init, context){

  createAlarms(createAlarms_after, data) // 1

  function createAlarms_after(){
    analyzeAlarms(analyzeAlarms_after) // 2
  }

  function analyzeAlarms_after(id_set, time_store, linkIDn){
    linkAlarms(linkAlarms_after, id_set, time_store, linkIDn) // 3
  }

  function linkAlarms_after() {
    filterAlarms(filterAlarms_after) // 4
  }

  function filterAlarms_after(){
    groupAlarms(groupAlarms_after) // 5
  }

  //// NOTE: CLEANUP this part
  function groupAlarms_after() {

    var alarmLimit = 1000

    // Alarm limit -----------------------------------------------------
    var len

    if (filteredAlarms.length < alarmLimit) {
      len = filteredAlarms.length
    } else {
      len = alarmLimit
    }

    alarms = [];

    for (let i = 0; i < len; i++) {
      alarms.push(filteredAlarms[i])
    }


    // Alarm parts ----------------------------------------------------
    alarmParts = []

    for (let i = 0; i < filteredAlarms.length; i++) {

      p = Math.ceil((i+1)/alarmLimit) - 1

      if (alarmParts[p] == undefined) {
        alarmParts[p] = []
      }

      alarmParts[p].push(filteredAlarms[i])

    }

    alarmPages(alarmLimit);

    // Fill no data item in alarms when there's no data ---------------
    if (filteredAlarms.length == 0) {
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


// ALARM CLASS -----------------------------------------------------------------
class Alarm {

  // CONSTRUCTOR -----------------------------------------------------
  constructor(data, i) {

    // index
    this._index = i

    // From database
    this._datetime = data[0];
    this.station = data[1];
    this._var = this.setVar_temp(data[1], data[2]);
    this.comment = data[3];
    this.severity = data[4];
    this._state = parseInt(data[5]);

    // safe date parse of _datetime
    this._dt = sDateParse(this._datetime);

    // state text ON/OFF
    this.statetxt = ['OFF','ON'][this._state];

    // set zone and station full name
    this.getZoneStation(this.station)

    // set stationcode, modezone, object and description
    this.setParts(this._var)

    // set alarm type
    this.setAlarmType(this._var)

  }

  // Set alarm type --------------------------------------------------
  setAlarmType(v){

    // NOTE: Change filtering of alarms
    var types = {

      //General
      autonotstarted: /[Mm]ode.{0,}[Aa]uto/,
      manual: /[Mm]ode.{0,}[Mm]an.{0,}[Mm]ode/,
      'manual resseq': /[Mm]ode.{0,}Res.{0,}Seq/,
      'manual restm': /[Mm]ode.{0,}Res.{0,}TM/,
      'manual forced': /[Mm]ode.{0,}ForcedMan/,
      'general homerun': /[Mm]ode.{0,}HomeRun/,

      interlock: /[Ii]nt.{0,}l.{0,}k/,
      'general robot': /[0-9]R[0-9]{1,}/,
      'general com': /Com/,
      'general processtime': /ProcessTime/,
      'general atlascopco': /AtlasCopco/,

      //Production
      production: /Prod/,
      inout: /[IiOo][un]t{0,1}feed/,
      andon: /[Aa]ndon/,
      controlroom: /StopCR/,

      //Safety
      safety: /Safety/,
      motionstop: /MotionStop/,

    }

    //Init type (formatnok when there's no stationcode)
    if(this._stcode == 'n/a'){
      this._type = 'formatnok' // TEMP: When format is ok this is deprecated
    } else {
      this._type = '' // NOTE: Keep this when format of every station is ok
    }

    //Give types in types object which regex test true
    for (var t in types) {
      if (types[t].test(v)) {
        //Add a space when more then one type
        if(this._type.length > 0) {this._type += ' '}
        // Add type
        this._type += t
      }
    }

    //If no type is set, give it default type alarm
    if (this._type.length == 0) {
      this._type = 'alarm'
    }
  }

  // set stationcode, modezone, object and description ---------------
  setParts(v){

    // regExp
    var dsc = /.A[A-E]_.{0,}$/            // Description
    var stc = /^[0-9]{4}[a-zA-Z]/         // Stationcode
    var zm  = /^[0-9]{4}Z[M,S][0-9]{2,}/  // Modezone

    // Description
    var description =   regExp(dsc, '    n/a')
    this.description =  description.substr(4) //without ".AA_"

    // Remove description from var (inclusive ".AA_")
    v = v.replace(description,'')

    // Stationcode & Modezone
    this._stcode = regExp(stc, 'n/a'    ).substr(0,4)
    this.zone = regExp(zm,  '    General').substr(4)

    // Object = what is left
    this.object = v.replace(this._stcode,'').replace(this.zone,'')

    // Object empty => set n/a
    if (this.object.length == 0) {
      this.object = 'n/a'
    }

    // Regex find function
    function regExp(rgx, fallback){
      if (rgx.test(v)) {
        return v.match(rgx)[0]
      } else {
        return fallback
      }
    }

  }


  // Get zone and station from TIA_GC object -----------------
  getZoneStation(station){
    for (var zone in TIA_GC) {

      // Station present in zone -> set zone & name
      if (TIA_GC[zone].hasOwnProperty(station)) {

        this._zone = zone
        this._stntxt = TIA_GC[zone][station].name

      }

    }
  }


  // For "_var" without stationcode ----------------------------------
  // TEMP: for vars without station code
  setVar_temp(station, v){

    var stationCode = /^[0-9]{3,}/; // stn number at start of string
    var stationNum = /[0-9]{3,}/;   // any number in station 3 or longer

    // No stationcode: add station code between ()
    if (!v.match(stationCode)) {
      return '(' + station.match(stationNum) + ')' + v
      // StationCode 3 numbers in stead of 4 add 0
    } else if (v.match(stationCode)[0].length == 3){
      return '0' + v
    } else {
      return v
    }
  }
}


// [1] CREATE ALARMS -----------------------------------------------------------
function createAlarms(fn_after, data){

  // Reset allAlarms array
  allAlarms = [];

  asyncArr(data, itter, status, after, this)

  // ITTER -----------------------------------------------------------
  function itter(arr, i){
    allAlarms.push(new Alarm(arr[i], i))
  }

  // STATUS ----------------------------------------------------------
  function status(arr, i){
    statusFields('Creating', 'progress', arr, i)
  }

  // AFTER -----------------------------------------------------------
  function after(arr,i){
    statusFields('Creating', 'progress', arr, i)
    setTimeout(function () {
      fn_after.call()
    }, 1);
  }

}


// DISTINCT CLASS --------------------------------------------------------------
class Distinct {

  // Object set with method
  constructor(arr, mode, fn_after, context) {
    this.set(arr, mode, fn_after, context)
  }

  // Set method
  set(arr, mode, fn_after, context){

    // For all alarms
    for (var i = 0; i < arr.length; i++) {

      // Filter only use not underscored properties ------------------
      if (mode == 'filter') {
        for (var col in arr[i]) {
          if (col.search('_') < 0){ // Only filter objects

            // set name of subobject to name of alarmobject (column) once
            if (this[col] == undefined) { this[col] = {} }

            // Set when not set yet
            if (!this[col].hasOwnProperty(arr[i][col])) {
              // set var name in subobject
              this[col][arr[i][col]] = 1
            }
          }
        }

        // Array with chosen object ------------------------------------
      } else if (typeof(mode) == 'object'){
        for (var j = 0; j < mode.length; j++) {

          // set name of subobject to name of alarmobject (column) once
          if (this[mode[j]] == undefined) { this[mode[j]] = {} }

          // Set when not set yet
          if (!this[mode[j]].hasOwnProperty(arr[i][mode[j]])) {
            // set var name in subobject
            this[mode[j]][arr[i][mode[j]]] = 1
          }
        }
      }
    }
  }
}


// [2] Analyze alarms for active, duration and link ----------------------------
function analyzeAlarms(fn_after){

  // Vars
  var dist = new Distinct(allAlarms, ['_var']);    // for fist dist on event
  var link_store = copyObj(dist)                    // for linkID storage
  var count = copyObj(dist)                         // for alarm counting

  var linkID = 0;                         // linkID for ON.OFF events
  var linkIDn = -1;                       // linkID for ACTIVE
  var id_set = []                         // check if ID is set (ON exists)
  var time_store = []                     // time storage per ID


  asyncArr(allAlarms, itter, status, after, this);


  // ITTER -----------------------------------------------------------
  function itter(arr, i){

    //String referenced VARS  -----------------------------------
    var a = arr[i]              //alarm row
    var v = a._var              //var name
    var s = a._state            //state integer
    var date = sDateParse(a._datetime)

    a._shift = getShift(date)

    // OFF event ------------------------------------------------
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
      // First distinct event is ON event = ACTIVE ----------------
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


  // STATUS ----------------------------------------------------------
  function status(arr, i){
    statusFields('Analyzing', 'progress', arr, i)
  }


  // AFTER -----------------------------------------------------------
  function after(arr,i){
    statusFields('Analyzing', 'progress', arr, i)
    setTimeout(function () {
      fn_after.call(null, id_set, time_store)
    }, 1);
  }

};


// [3] Link remaining events ---------------------------------------------------
function linkAlarms(fn_after, id_set, time_store, linkIDn){

  asyncArr(allAlarms, itter, status, after, this);

  function itter(arr, i){

    //String referenced VARS  --------------------------------------
    var a = arr[i]   //alarm row
    var v = a._var             //var name
    var s = a._state      //state integer
    var date = sDateParse(a._datetime)

    if (s == 0 && a._linkID != 'none' && id_set[a._linkID] == true) {
      // Off event that has a link ID and the ON event's ID is also set
      // - Assign stored duration and durationtxt to the OFF event
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

  function status(arr, i){
    statusFields('Linking', 'progress', arr, i)
  }

  // AFTER -----------------------------------------------------------
  function after(arr,i){
    statusFields('Linking', 'progress', arr, i)
    setTimeout(function () {
      fn_after.call(null, id_set, time_store)
    }, 1);
  }

}


// [4] FILTER ALARMS -----------------------------------------------------------
function filterAlarms(fn_after){

  filteredAlarms = [] // to store filtered alarms

  asyncArr(allAlarms, itter, status, after, this)

  // ITTER -----------------------------------------------------------
  function itter(arr, i){

    var filtered = false
    var typeString = arr[i]._type

    // Alarmtype filters
    for (var sel in FILTERS.at) {
      if (!FILTERS.at[sel] && typeString.search(sel) > -1) {
        filtered = true
      }
    }

    // Production filters
    for (var sel in FILTERS.prod) {
      if (!FILTERS.prod[sel] && typeString.search(sel) > -1) {
        filtered = true
      }
    }

    // Only active filter
    if(FILTERS.only.active && !arr[i]._active) {filtered = true}

    // Fill filtered alarms
    if (!filtered) { filteredAlarms.push(arr[i]) }

  }

  // STATUS ----------------------------------------------------------
  function status(arr, i) {
    statusFields('Filtering', 'progress', arr, i)
  }

  // AFTER -----------------------------------------------------------
  function after(arr,i){
    statusFields('Filtering', 'progress', arr, i)
    setTimeout(function () {
      fn_after.call()
    }, 1);
  }

}


// GROUP CLASS -----------------------------------------------------------------
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

}


// [5] Group events ------------------------------------------------------------
function groupAlarms(fn_after){

  //// TEMP: Don't analyze groups in live view
  if (window.location.pathname == '/live.html'){

    statusFields('Done', 'done');
    setTimeout(function () {
      fn_after.call()
    }, 10);

  } else {

    var g = {} //to store temporary groups
    var gNum = 1 // to increment group number with each new group

    asyncArr(filteredAlarms, itter, status, after, this)

  }


  // ITTER ---------------------------------------------------------
  function itter(arr, i){

    // Reverse itteration
    i = (arr.length - 1) - i

    // Create current alarm
    var a = arr[i]

    a._groupEnd = false 

    // ON event +++++++++++++++++++++++++++++++++++++++++++++++++++++
    if (!a._active && a._state == 1) {

      // create new group for station when undefined
      // - set to undefinded when last alarms is removed from collection
      if (g[a.station] == undefined) {
        g[a.station] = new Group(gNum, a._zone, a.station); gNum ++
        g[a.station].time("start", a._start)
      }

      // Collect on event
      g[a.station].collect(a)

      // Give event group number
      a._group = new Group(g[a.station].num)


      // OFF event (with defined group) ++++++++++++++++++++++++++++++++
    } else if (g[a.station] != undefined && a._state == 0) {

      // OFF event not in collection
      if (g[a.station].collection.indexOf(a._var) < 0) {

        a._group = new Group(0)

        // OFF event IN collection
      } else {

        // Detach event in collection with OFF event
        g[a.station].detach(a)

        // Give event group number
        a._group = new Group(g[a.station].num)

        // Set group to undefined so a new group wil be created on the
        // next itteration when the collection is empty
        if (g[a.station].checkEmpty()) {

          g[a.station].time("end", a._end);

          a._group = copyObj(g[a.station]);
          a._groupEnd = true;

          g[a.station] = undefined;

        };
      }


      // OFF event (without active group) || ACTIVE event ++++++++++++++
    } else if ((g[a.station] == undefined && a._state == 0) || a._active) {
      a._group = new Group(0)
    }

  }


  // STATUS --------------------------------------------------------
  function status(arr, i){

    var len = arr.length
    var progress = Math.round( i / len * 100 )

    statusFields('Analyzing alarm groups', 'progress', arr, i)

  }

  // AFTER ---------------------------------------------------------
  function after(arr, i){

    statusFields('Done', 'done')

    // Reset groups object
    groups = {}

    // Search groups in alarm array
    for (var i = 0; i < arr.length; i++) {
      if (arr[i]._group.hasOwnProperty('alarms')) {

        // Define zone property
        if (!groups.hasOwnProperty(arr[i]._zone)) {
          groups[arr[i]._zone] = {}
        }

        // Define station property
        if (!groups[arr[i]._zone].hasOwnProperty(arr[i].station)) {
          groups[arr[i]._zone][arr[i].station] = []
        }

        // Add group to groups object
        groups[arr[i]._zone][arr[i].station].push(arr[i]._group)

        groupsNumRef[arr[i]._group.num] = arr[i]._group

      }
    }

    for (var i = 0; i < arr.length; i++) {
      if (arr[i]._group.num > 0) {
        arr[i]._group = groupsNumRef[arr[i]._group.num]
      }

    }

    // Count stations present in group object
    groups._stationcount = 0

    for (var zone in groups) {
      for (var station in groups[zone]) {
        groups._stationcount++
      }
    }

    // Call next function
    setTimeout(function () {
      fn_after.call()
    }, 1);

  }
}










// NOTE: THIS SHOULD BE ASYNC (NOT WORKING ATM) step 6
// Also: make this an option when there are too many alarms and it will take
//       long to complete

function createTimeline(){

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

  var startIndex = 0

  for (var i = gs; i < ge; i+=1000) {

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











































// For safari ------------------------------------------------------------------
// Replace '-' by '/' & Remove 'ms' before new Date.. add 'ms' after again
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


// Copy object function --------------------------------------------------------
function copyObj(obj){
  return JSON.parse(JSON.stringify(obj))
}













function alarmPages(alarmLimit){

  if(filteredAlarms.length > alarmLimit){

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
