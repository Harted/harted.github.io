// GLOBAL alarms var -----------------------------------------------------------
var alarms
var allAlarms, filteredAlarms
var alarmParts
var groups = {}
var groupsByID = {}

var distAlarms


// TODO:
// - Fix alarmFilter and show butons
// - replace 'alarms' by 'visibleAlarms'




// MASTER ALARMS FUNCTION ------------------------------------------------------
function Alarms(data, fn_after, timer, init, context){

  var liveView = window.location.pathname == '/live.html' || TIME.rt

  console.time('createAlarms')
  createAlarms(createAlarms_after, data) // 1

  function createAlarms_after(){
    console.timeEnd('createAlarms')
    console.time('analyzeAlarms')
      analyzeAlarms(analyzeAlarms_after) // 2
  }

  function analyzeAlarms_after(id_set, time_store, linkIDn){
    console.timeEnd('analyzeAlarms')
    console.time('linkAlarms')
    linkAlarms(linkAlarms_after, id_set, time_store, linkIDn, liveView) // 3
  }

  function linkAlarms_after() {

    console.timeEnd('linkAlarms')
    // TEMP: To check dif between total time and timeline total time
    if (!liveView) {
      for(i = 0; i < allAlarms.length; i++){
        if(allAlarms[i]._timeline != undefined){
          if (allAlarms[i]._timeline.duration._checkTotalDif != 0){
            console.log('DEBUG: difference between duration and timeline total');
            console.log(allAlarms[i]._timeline.duration._checkTotalDif)
            console.log(allAlarms[i])
          }
        }
      }
    }

    console.time('filterAlarms')
    filterAlarms(filterAlarms_after) // 4
  }

  function filterAlarms_after(){
    console.timeEnd('filterAlarms')
    if (liveView) {
      groupAlarms_after();
    } else {
      distinctAlarms(distinctAlarms_after) // 5
    }

  }

  function distinctAlarms_after(){
    groupAlarms(groupAlarms_after) // 6
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
    this._varOrg = data[2];
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

      // for (i = 0; i < allAlarms.length; i++) {console.log(allAlarms[i]._type.replace(' formatnok','').split(' ').length, allAlarms[i]._type.replace(' formatnok',''))}

      // MODE ---------------------------------------
      mode: /.{0,}[^d]Mode/, // not prodmode

      autonotstarted: /[Mm]ode.{0,}[Aa]uto/,
      manual: /[Mm]ode.{0,}[Mm]an.{0,}[Mm]ode/,
      resseq: /[Mm]ode.{0,}Res.{0,}Seq/,
      restm: /[Mm]ode.{0,}Res.{0,}TM/,
      forced: /[Mm]ode.{0,}ForcedMan/,
      homerun: /[Mm]ode.{0,}HomeRun/,
      normalstop: /[Mm]ode.{0,}NormalStop/,

      // General ---------------------------------------
      'general interlock': /[Ii]nt.{0,}l.{0,}k/,
      'general keeppos': /KeepPos/,
      'general processtime': /ProcessTime/,
      'general overtime': /Ovt.{0,}Alm/,

      'general atlascopco': /AtlasCopco/,
      'general robot': /[0-9]R[0-9]{1,}/,

      'general com': /Com/,
      'general diag': /DiagPLC/,
      'general system': /LSystemVar/,

      //Production -------------------------------------
      production: /Prod/,

      inout: /[IiOo][un]t{0,1}feed/,
      andon: /[Aa]ndon/,
      controlroom: /StopCR/,
      prodmode: /ProdMode/, // Cylce stop/sim without part

      //Safety
      safety: /Safety/,

      EStop: /EStop/,
      GStop: /GStop/,
      MStop: /MotionStop/,

      gate: /AS[0-9]{2}.{0,}SG/,
      button: /AS[0-9]{2}.{0,}SH/,
      overtravel: /CA[0-9]{2}.{0,}SG[0-9]{2}/,

    }

    this._type = ''

    //Give types in types object which regex test true
    for (var t in types) {
      if (types[t].test(v)) {
        //Add a space when more then one type
        if (this._type.length > 0) {this._type += ' '}
        // Add type
        this._type += t
      }
    }

    //If no type is set, give it default type alarm
    if (this._type.length == 0) {
      this._type = 'general other'
    } else if (this._type.split(' ').length == 1) {
      this._type += ' other'
    }

    //Init type (formatnok when there's no stationcode)
    if(this._stcode == 'n/a'){
      this._type += ' formatnok' // TEMP: When format is ok this is deprecated
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


// COUNT CLASS -----------------------------------------------------------------
class CountObj {

  constructor(name) {
    this.count = 0
    this.duration = 0
    this.fromTL = {}
  }

  add(a){
    this.count++
    this.duration += a._duration
    this.durtxt = dhms(this.duration)

    if(a._timeline != undefined){
      for (var item in a._timeline.duration) {
        if(item.indexOf('_') != 0){

          var split = item.split('_')

          if (split.length == 1) {

            if (this.fromTL[item] == undefined) {this.fromTL[split[0]] = 0}
            this.fromTL[item] += a._timeline.duration[item]

          } else {
            //// NOTE: durtxt not needed here
            //this.fromTL[item] = dhms(this.fromTL[split[0]])
          }
        }
      }
    }

    this._timelineCorrect = this.dur === this.fromTL.TOTAL

  }
}



// [2] Analyze alarms for active, duration and link ----------------------------
function analyzeAlarms(fn_after){

  // Vars
  var dist = new Distinct(allAlarms, ['_var']);     // for fist dist on event
  var link_store = copyObj(dist)                    // for linkID storage

  var linkID = 0;                         // linkID for ON.OFF events
  var linkIDn = -1;                       // linkID for ACTIVE
  var id_set = []                         // check if ID is set (ON exists)
  var time_store = []                     // time storage per ID


  asyncArr(allAlarms, itter, status, after, this);


  // ITTER -----------------------------------------------------------
  function itter(arr, i){

    var a = arr[i]  // Set a as curent alarm reference

    // Set alarms shift
    a._shift = getShift(a._dt)


    // OFF event ------------------------------------------------
    if (a._state == 0){

      a._linkID = linkID;
      a._active = false;

      // Set end time & store to calculate duration at ON event
      a._end = time_store[linkID] = a._dt;

      // Store linkID and remember ON event linkID is not set yet
      link_store._var[a._var] = linkID; id_set[linkID] = false;

      linkID++ ; // Increment linkID

      // ON event without OFF event = ACTIVE ----------------------
    } else if (a._state == 1 && dist._var[a._var] == 1){

      a._linkID = linkIDn
      a._active = true
      a._start = a._dt
      a._end = 'unknown'

      if (TIME.rel) {

        a.statetxt = 'ACTIVE' // Replace state text by ACTIVE

        var dur = Date.now() - a._dt
        a._duration = dur; a._durtxt = dhms(dur);

      } else {

        a._duration = -1
        a._durtxt = 'n/a'

      }

      linkIDn -- // Set negative linkID

      // ON event with OFF event ----------------------------------
    } else if (a._state == 1) {


      // Set stored linkID and remember ID is set
      a._linkID = link_store._var[a._var]; id_set[a._linkID] = true;
      a._active = false;
      a._end = time_store[a._linkID]

      // Set duration
      var dur = a._end - a._dt
      a._duration = dur; a._durtxt = dhms(dur);

      // Set start time & store to calculate duration at OFF event
      a._start = a._dt; time_store[a._linkID] = a._dt

    }

    // Set distinct to 0 - next ON event is not ACTIVE
    dist._var[a._var] = 0

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
function linkAlarms(fn_after, id_set, time_store, linkIDn, liveView){

  var cnt = new Distinct(allAlarms, ['_var']);  // for alarm counting
  var prodTlSet = [] // for production timeline reference

  asyncArr(allAlarms, itter, status, after, this);

  function itter(arr, i){

    var a = arr[i]  // Set a as curent alarm reference

    // OFF event with ON event set
    if (a._state == 0 && id_set[a._linkID]) {

      a._start = time_store[a._linkID] //stored time at ON event

      // Set duration
      var dur = a._dt - a._start
      a._duration = dur; a._durtxt = dhms(dur);

    } else if ( a._duration == undefined ) {

      // Event without duration set
      // - Assing not available and -1
      a._start = 'unknown'
      a._duration = -1
      a._durtxt = 'n/a'
      a._linkID = linkIDn
      linkIDn--

    };

    if(!liveView) {

      // PRODUCTION timeline (only if there's a link)
      if (id_set[a._linkID]) {
        if (a._state == 0){ // Off event
          a._timeline = new ProdTimeline(a)
          prodTlSet[a._linkID] = a._timeline
        } else { // On event (reference)
          a._timeline = prodTlSet[a._linkID] // add reference to object
        }
      } else {
        a._timeline = undefined
      }

      // Count alarms
      if (cnt._var[a._var] == 1) { cnt._var[a._var] = new CountObj()}

      if (a._state == 0){
        cnt._var[a._var].add(a)
        a._count = cnt._var[a._var]
      } else {
        a._count = cnt._var[a._var] // add reference to count obj
      }
      
    }



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

    // Filter by button selection
    for (var type in FILTERS) {
      if (type != 'only' && type != 'sev' ) {
        for (var sub in FILTERS[type]) {

          if (!FILTERS[type][sub] && sub != 'other') {

            if (typeString.search(sub) > -1) { //.split(' ')[1]
              filtered = true
            }

          } else if (!FILTERS[type][sub] && sub == 'other'){

            if (typeString.search(type + ' other') > -1) {
              filtered = true
            }

          }
        }
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



// [5] Distinct events sumary --------------------------------------------------
function distinctAlarms(fn_after){

  distAlarms = new DistAlarms(filteredAlarms);

  asyncArr(filteredAlarms, itter, status, after, this)

  // ITTER -----------------------------------------------------------
  function itter(arr, i){

    var a = arr[i]

    distAlarms.addDist(a)

  }

  // STATUS ----------------------------------------------------------
  function status(arr, i) {
    statusFields('Distinct', 'progress', arr, i)
  }

  // AFTER -----------------------------------------------------------
  function after(arr,i){

    distAlarms.order()
    distAlarms.calc()

    statusFields('Distinct', 'progress', arr, i)
    setTimeout(function () {
      fn_after.call()
    }, 1);
  }


}



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

// timelineStack to be able to cancel timeline creation
var timelineStack = []

// [6] Group events ------------------------------------------------------------
function groupAlarms(fn_after){

  // Don't analyze groups in live view
  if (window.location.pathname == '/live.html'){

    statusFields('Done', 'done');
    setTimeout(function () {
      fn_after.call()
    }, 1);

  } else {

    var gID = 1 // to increment group number with each new group
    groups = {} // Reset groups object

    // to set short g variable for current group
    var g, index
    function currentGroup(a){
      index = groups[a._zone][a.station].length - 1
      g = groups[a._zone][a.station][index]
    }

    asyncArr(filteredAlarms, itter, status, after, this)

  }


  // ITTER ---------------------------------------------------------
  function itter(arr, i){

    // Reverse itteration
    i = (arr.length - 1) - i

    // Reference current alarm
    var a = arr[i]

    // To draw border in table
    a._groupEnd = false


    // ON event ++++++++++++++++++++++++++++++++++++++++++++++
    if (!a._active && a._state == 1) {

      // Create zone when not present
      if (groups[a._zone] == undefined) {
        groups[a._zone] = {}
      }

      // Create station when not presetn
      if (groups[a._zone][a.station] == undefined) {
        groups[a._zone][a.station] = []; newGroup(); // First new group
      }

      currentGroup(a); // set current group object (g)

      if (g.collection == undefined) { newGroup();} // Add new group

      currentGroup(a); // set current group object (g)

      g.collect(a) // collect alarm
      a._group = g // Add reference to alarm

      function newGroup(){

        groups[a._zone][a.station].push(new Group(gID)); gID++;

        currentGroup(a); // set current group object (g)
        g.time("start", a._start) // set start time of group

      }

      // OFF event +++++++++++++++++++++++++++++++++++++++++++++
    } else if (a._state == 0) {

      if (groups[a._zone] == undefined) {
        a._group = 'no group' // no group when zone is undefined
      } else if (groups[a._zone][a.station] == undefined) {
        a._group = 'no group' // no group when station is undefined
      } else {
        currentGroup(a); // set current group object (g)

        if (g.collection == undefined) {
          a._group = 'no group' // no group when there's no collection
        } else {

          if (g.collection.indexOf(a._var) < 0) {
            a._group = 'no group' // no group when not in collection

          } else {

            g.detach(a) // remove OFF event from colleciton
            a._group = g // Add reference to alarm

            // Check if the collection is empty
            if (g.checkEmpty()) {

              g.time("end", a._end); // Set end time of group
              a._groupEnd = true; // Set _groupEnd reference for table line

            }
          }
        }
      }

      // ACTIVE event ++++++++++++++++++++++++++++++++++++++++++
    } else if (a._active) { a._group = 'no group' }

  }


  // STATUS --------------------------------------------------------
  function status(arr, i){
    statusFields('Grouping', 'progress', arr, i)
  }

  // AFTER ---------------------------------------------------------
  function after(arr, i){

    statusFields('Done', 'done')

    // Count stations present in group object
    groups._stationcount = 0

    var groupCnt = {count: 0, max: 0} // To show satus
    groupsByID = {} // Rest groupsByID object

    for (var zone in groups) {
      for (var station in groups[zone]) {

        groups._stationcount++

        // Create timelines in the background
        for (var i = 0; i < groups[zone][station].length; i++) {

          // Fill groupsByID object
          groupsByID[groups[zone][station][i].ID] = groups[zone][station][i]

          // count = todo, max = total groups (for status)
          groupCnt.count++ ; groupCnt.max++ ;

          // Async execution of timeline creation (add to timeline stack)
          timelineStack.push(
            setTimeout(asyncTimeline.bind(null, i, zone, station), 0)
          );

          function asyncTimeline(i, zone, station){
            var current = timelineStack.shift() // Empty timelinestack on exec.
            groups[zone][station][i].createTimeline(groupCnt)
          }
        }
      }
    }

    console.log('Groups', groups);
    fn_after.call() // Call next function

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





function roundP(num, digits){
  return Math.round(num * Math.pow(10,digits)) / Math.pow(10,digits)
}
