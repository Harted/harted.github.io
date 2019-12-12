// CREATE EVENTS ---------------------------------------------------------------// createEvents
function createEvents(fnAfter, data){

  EVENTS.all = [];

  // asyncArr(array, fn_arr, fn_dom, fnAfter, context [, time])
  asyncArr(data, itter, status, after, this);

  // ITTER -----------------------------------------------------------
  function itter(arr, i){ EVENTS.all.push(new Event(arr[i], i)) };

  // STATUS ----------------------------------------------------------
  function status(arr, i){
    statusFields('Creating', 'progress', arr, i)
  };

  // AFTER -----------------------------------------------------------
  function after(arr,i){
    status(arr, i); setTimeout( function (){ fnAfter.call() } , 1);
  }
}


// Analyze alarms for active, duration and link --------------------------------// analyzeEvents
function analyzeEvents(fnAfter){

  var activeCheck = new Distinct(EVENTS.all, ['_var']);  // for finding ACTIVE
  var linkStore = copyObj(activeCheck)                 // for linkID storage

  var linkID = 0;         // linkID for ON.OFF events
  var linkIDn = -1;       // linkID for ACTIVE & OFF without ON
  var idHasON = []        // to check if id is given to ON event
  var timeStore = []      // time storage per ID

  // asyncArr(array, fn_arr, fn_dom, fnAfter, context [, time])
  asyncArr(EVENTS.all, itter, status, after, this);

  // ITTER -----------------------------------------------------------
  function itter(arr, i){

    var a = arr[i]

    if (a._state == 0){                                              // OFF

      // LinkID --------------------------------------------
      a._linkID = linkID;
      // - Store linkID to give it to ON further in array
      linkStore._var[a._var] = linkID;
      // - Set ID has ON to false, this is set to true when
      //   it is given to an ON event so it can know when
      //   an OFF event has no ON event in the array
      idHasON[linkID] = false;

      // NOT ACTIVE & TIME ---------------------------------
      // - Off event is first so the event can't be active
      a._active = false;

      // - Set end time & store to calculate duration at ON event
      a._end = timeStore[linkID] = a._dt;
      linkID++ ; // Increment after storage

    } else if (a._state == 1 && activeCheck._var[a._var] == 1){      // ACTIVE
      // - If state = 1 and the var is not set to 0 in the dist
      //   this is the first event of it's type and it's ON so
      //   the event is ACTIVE

      // LinkID --------------------------------------------
      // - Set negative linkID (the event has no partner)
      a._linkID = linkIDn; linkIDn --;

      // ACTIVE & TIME -------------------------------------
      // - The event is active so it has no end time yet
      a._active = true; a._start = a._dt; a._end = 'unknown'

      // Duration ------------------------------------------
      // - When relative time is selected duration can be
      //   calculated with current datetime, when absolute
      //   the active event is not realy active, it just
      //   has no OFF partner in the array
      if (TIME.rel) {

        var dur = Date.now() - a._dt

        a.statetxt = 'ACTIVE' // Replace state text by ACTIVE
        a._duration = dur; a._durtxt = dhms(dur);

      } else {
        a._duration = -1; a._durtxt = 'n/a'
      }

    } else if (a._state == 1) {                                     // ON

      // LinkID --------------------------------------------
      // - Set stored linkID from OFF event
      // - ID is given to the ON event, so they are linked
      a._linkID = linkStore._var[a._var];
      idHasON[a._linkID] = true;

      // NOT ACTIVE & TIME ---------------------------------
      // - The event is not active because an OFF event preceded it
      // - The end time is the time of the OFF event
      // - The start time is the time of this event and it is
      //   stored to set to the OFF event in the next itteration
      a._active = false;
      a._end = timeStore[a._linkID];
      a._start = a._dt; timeStore[a._linkID] = a._dt;

      // DURATION ------------------------------------------
      // - The duration can be calculated because the ON and
      //   OFF event are linked and the end time of this event
      //   comes from that OFF event.
      var dur = a._end - a._dt
      a._duration = dur; a._durtxt = dhms(dur);

    }

    // Set var in activeCheck object to 0 so this alarm can't be
    // active in the next itteration
    activeCheck._var[a._var] = 0

  }

  // STATUS ----------------------------------------------------------
  function status(arr, i){
    statusFields('Analyzing', 'progress', arr, i);
  };

  // AFTER -----------------------------------------------------------
  function after(arr,i){
    status(arr, i); // Update status 100%
    setTimeout(function () {
      // Call next function with arguments used in linkEvents()
      fnAfter.call(null, idHasON, timeStore, linkIDn)
    }, 1);
  }

};


// Link remaining events -------------------------------------------------------// linkEvents
function linkEvents(fnAfter, idHasON, timeStore, linkIDn){

  // asyncArr(array, fn_arr, fn_dom, fnAfter, context [, time])
  asyncArr(EVENTS.all, itter, status, after, this);

  // ITTER ----------------------------------------------------------
  function itter(arr, i){

    var a = arr[i]

    if (a._state == 0 && idHasON[a._linkID]) {

      // OFF event with ON event
      // - Set the start time from the ON event (stored in previous itter)
      a._start = timeStore[a._linkID]
      // - Calculate the duration with given start time
      var dur = a._dt - a._start
      a._duration = dur; a._durtxt = dhms(dur);

    } else if ( a._duration == undefined ) {

      // OFF event without on event
      // - Start of the event is unknown, so is the duration
      // - Change the linkID to a negative one
      a._start = 'unknown'; a._duration = -1; a._durtxt = 'n/a'
      a._linkID = linkIDn; linkIDn-- ;

    }
  }

  // STATUS ----------------------------------------------------------
  function status(arr, i){
    statusFields('Linking', 'progress', arr, i)
  }

  // AFTER -----------------------------------------------------------
  function after(arr,i){
    status(arr, i); setTimeout(function () {
      fnAfter.call(null, idHasON)
    }, 1);
  }
}


// TIMELINE ALARMS -------------------------------------------------------------// timelineEvents
function timelineEvents(fnAfter, idHasON){

  var cnt = new Distinct(EVENTS.all, ['_var']);  // for alarm counting
  var prodTlSet = []                            // for timeline reference

  // asyncArr(array, fn_arr, fn_dom, fnAfter, context [, time])
  asyncArr(EVENTS.all, itter, status, after, this);

  // ITTER -----------------------------------------------------------
  function itter(arr, i){



      var a = arr[i]

      // set shift for event ------------------------------------
      a._shift = getShift(a._dt)

      // Set PRODUCTION timeline --------------------------------
      // - Only if the positive linkID created a link between the
      //   ON and OFF event
      // - Set the timeline to undefined otherwise
      if (idHasON[a._linkID]) {
        // OFF event is first in array so create the timeline here
        // - store the reference to the timeline with linkID ref
        // ON event is second in array
        // - set timeline to stored reference
        // - this saves time by only creating timeline once
        if (a._state == 0){ // OFF
          a._timeline = new ProdTimeline(a)
          prodTlSet[a._linkID] = a._timeline
        } else { // ON
          a._timeline = prodTlSet[a._linkID]
        }
      } else { a._timeline = undefined } // ACTIVE or OFF without ON

      // Count alarms ------------------------------------------
      // - Create new CountObj when value in distinct obj is 1
      if (cnt._var[a._var] == 1) { cnt._var[a._var] = new CountObj()}

      // Count at OFF event, add reference to ON event
      if (a._state == 0){ // OFF event
        cnt._var[a._var].add(a)
        a._count = cnt._var[a._var]
      } else {
        a._count = cnt._var[a._var]
      }



  }

  // STATUS ----------------------------------------------------------
  function status(arr, i){
    statusFields('Timeline', 'progress', arr, i);
  };

  // AFTER -----------------------------------------------------------
  function after(arr, i){

    // DEBUG: To check dif between total time and timeline total time
    for(i = 0; i < EVENTS.all.length; i++){
      if(EVENTS.all[i]._timeline != undefined){
        if (EVENTS.all[i]._timeline.duration._checkTotalDif != 0){
          console.log('DEBUG: difference between duration and timeline total');
          console.log(EVENTS.all[i]._timeline.duration._checkTotalDif)
          console.log(EVENTS.all[i])
        }
      }
    }

    status(arr, i); setTimeout(function () { fnAfter.call() }, 0);

  }

  // FUNCTIONS -------------------------------------------------------
  // Get shift with give date & time
  function getShift(datetime){

    datetime = new Date(datetime)

    // convert day to 7 for sunday when it's 0
    var day = datetime.getDay(); if (day == 0) { day = 7 }; // 7 = sunday

    // create unified time for the datetime
    var time = uniT(datetime.toTimeString().substr(0,8))

    // Get the shifts for the specified date from the SHIFTS object
    var shfts =  SHIFTS[day]

    // Check in which shift the give time lies
    for (var s in shfts) {
      if (shfts.hasOwnProperty(s)) {

        if (uniT(shfts[s].s) <= time && time <= uniT(shfts[s].e)) {

          // Order of A & B shift depending on week
          var AB = { S1: ['B','A'], S2: ['A','B']}

          // Set A or B depending on week index
          if (s == 'S1' || s == 'S2') { s = AB[s][weekIndex(datetime)]}

          return s.substr(0,1) // return only first letter

        }

      }
    }
  }

  // Create date from time string to compare easily
  function uniT(tStr){
    var arr = tStr.split(':')
    return new Date(2019,0,1,arr[0], arr[1], arr[2])
  }

  // Get weekindex alternating between '1' & '0' from 1/1/2019
  function weekIndex(date){
    var base = new Date(2019,0,1,0,0,0)
    return Math.round((date - base) / (1000 * 60 * 60 * 24 * 7)) % 2
  }

}


// FILTER ALARMS ---------------------------------------------------------------// filterEvents
function filterEvents(fnAfter){

  EVENTS.filtered = [] // reset EVENTS.filtered array

  // asyncArr(array, fn_arr, fn_dom, fnAfter, context [, time])
  asyncArr(EVENTS.all, itter, status, after, this)

  // ITTER -----------------------------------------------------------
  function itter(arr, i){

    var filtered = false
    var typeString = arr[i]._type

    // Filter by button selection
    for (var type in FILTERS) {

      // Itterate over FILTERS object, Don't filter on only and sev
      if (type != 'only' && type != 'sev' ) {
        for (var item in FILTERS[type]) {

          // If filteritem is false
          // - other is in every filtertype, so combine type and other
          //   to check if it has to filtered
          // - if item is found in typeString filtered is true
          if (!FILTERS[type][item] && item != 'other') {
            if (typeString.search(item) > -1) { filtered = true }
          } else if (!FILTERS[type][item] && item == 'other'){
            if (typeString.search(type + ' other') > -1) { filtered = true }
          }

        }
      }
    }

    // Only active filter
    if(FILTERS.only.active && !arr[i]._active) {filtered = true}

    // Fill EVENTS.filtered if item is not filtered
    if (!filtered) { EVENTS.filtered.push(arr[i]) }

  }

  // STATUS ----------------------------------------------------------
  function status(arr, i) {
    statusFields('Filtering', 'progress', arr, i)
  }

  // AFTER -----------------------------------------------------------
  function after(arr,i){
    status(arr, i); setTimeout(function () { fnAfter.call() }, 0);
  }
}


// Distinct events sumary ------------------------------------------------------// distinctEvents
function distinctEvents(fnAfter){

  // distinct object based on filtered alarms
  EVENTS.dist = new DistEvents(EVENTS.filtered);

  // asyncArr(array, fn_arr, fn_dom, fnAfter, context [, time])
  asyncArr(EVENTS.filtered, itter, status, after, this)

  // ITTER -----------------------------------------------------------
  function itter(arr, i){
    EVENTS.dist.add(arr[i])
  }

  // STATUS ----------------------------------------------------------
  function status(arr, i) {
    statusFields('Distinct', 'progress', arr, i)
  }

  // AFTER -----------------------------------------------------------
  function after(arr,i){

    // Order alarms and calculate total/percentages
    EVENTS.dist.order(); EVENTS.dist.calc();

    status(arr, i); setTimeout(function () { fnAfter.call() }, 0);

  }
}


// Group events ----------------------------------------------------------------// groupEvents
function groupEvents(fnAfter){

  var gID = 1 // to increment group number with each new group
  GROUPS.ordered = {} // Reset GROUPS.ordered object

  // to set short g variable for current group
  var g, index

  function currentGroup(a){
    index = GROUPS.ordered[a._zone][a.station].length - 1
    g = GROUPS.ordered[a._zone][a.station][index]
  }

  asyncArr(EVENTS.filtered, itter, status, after, this)


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
      if (GROUPS.ordered[a._zone] == undefined) {
        GROUPS.ordered[a._zone] = {}
      }

      // Create station when not presetn
      if (GROUPS.ordered[a._zone][a.station] == undefined) {
        GROUPS.ordered[a._zone][a.station] = []; newGroup(); // First new group
      }

      currentGroup(a); // set current group object (g)

      if (g.collection == undefined) { newGroup();} // Add new group

      currentGroup(a); // set current group object (g)

      g.collect(a) // collect alarm
      a._group = g // Add reference to alarm

      function newGroup(){

        GROUPS.ordered[a._zone][a.station].push(new Group(gID)); gID++;

        currentGroup(a); // set current group object (g)
        g.time("start", a._start) // set start time of group

      }

      // OFF event +++++++++++++++++++++++++++++++++++++++++++++
    } else if (a._state == 0) {

      if (GROUPS.ordered[a._zone] == undefined) {
        a._group = 'no group' // no group when zone is undefined
      } else if (GROUPS.ordered[a._zone][a.station] == undefined) {
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


    // Count stations present in group object
    GROUPS.ordered._stationcount = 0

    var groupCnt = {count: 0, max: 0} // To show satus
    GROUPS.byID = {} // Rest GROUPS.byID object

    for (var zone in GROUPS.ordered) {
      for (var station in GROUPS.ordered[zone]) {

        GROUPS.ordered._stationcount++

        // Create timelines in the background
        for (var i = 0; i < GROUPS.ordered[zone][station].length; i++) {

          // Fill GROUPS.byID object
          GROUPS.byID[GROUPS.ordered[zone][station][i].ID] = GROUPS.ordered[zone][station][i]

          // count = todo, max = total GROUPS.ordered (for status)
          groupCnt.count++ ; groupCnt.max++ ;

          // Async execution of timeline creation (add to timeline stack)
          timelineStack.push(
            setTimeout(asyncTimeline.bind(null, i, zone, station), 0)
          );

          function asyncTimeline(i, zone, station){
            var current = timelineStack.shift() // Empty timelinestack on exec.
            GROUPS.ordered[zone][station][i].createTimeline(groupCnt)
          }
        }
      }
    }

    // Call next function without timeout!!!!
    // - because group timelines are running in the timeout stack
    fnAfter.call()


  }
}


// Visible events (non async)---------------------------------------------------// visibleEvents
function visibleEvents(){

  // Set limit ------------------------------------------------------
  var eventLimit = 1000

  if (EVENTS.filtered.length < eventLimit) {
    var len = EVENTS.filtered.length
  } else {
    var len = eventLimit
  }

  EVENTS.visible = []; // Reset visible events array

  // Fill visible event array till len (limit or < 1000)
  for (let i = 0; i < len; i++) {
    EVENTS.visible.push(EVENTS.filtered[i])
  }


  // Event parts ----------------------------------------------------
  // - Make parts of 1000 or less events
  EVENTS.parts = [] // Reset parts array

  for (let i = 0; i < EVENTS.filtered.length; i++) {

    partIndex = Math.ceil((i+1)/eventLimit) - 1

    if (EVENTS.parts[partIndex] == undefined) {
      EVENTS.parts[partIndex] = []
    }

    EVENTS.parts[partIndex].push(EVENTS.filtered[i])

  }

  alarmPages(eventLimit);

  // Fill no data item in alarms when there's no data ---------------
  if (EVENTS.filtered.length == 0) {
    EVENTS.visible = [{
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

  function alarmPages(eventLimit){

    // Show pages only when there are
    if(EVENTS.filtered.length > eventLimit){

      var pages = EVENTS.parts.length
      var pageNumMem = 0

      $('#pagepick').addClass('display')
      $('#pages').text('Pages: ' + pages)
      $('#page').attr('max', pages)

      // Page change on input
      $('#pagepick input[type=number]').on('input', pageChange)

      function pageChange() {

        var pageNum = $(this).val() // number value of input

        // Input validation
        if (pageNum > pages) {pageNum = pages}
        if (pageNum < 1 && pageNum != '' ) {pageNum = 1}
        $(this).val(pageNum)

        // If pagenum is integer init pagechange on enter of focusout
        if(!Number.isNaN(parseInt(pageNum))){

          $(this).off('keyup').on('keyup', enter)
          .off('focusout').on('focusout', pageConfirm.bind(null, pageNum))

          function enter(event){
            if (event.keyCode == 13) { pageConfirm(pageNum);}
          }

        }

        // Page confirm: set table, make new filter and adjust
        function pageConfirm(pageNum){
          if(pageNum != pageNumMem){

            // Set visible events to the selected page number
            EVENTS.visible = EVENTS.parts[pageNum - 1]

            setTable();
            responsive();
            tableFilter();

            //remember pagenum so it's only fired on change
            pageNumMem = pageNum

          }
        }
      }
    } else {
      $('#pagepick').removeClass('display')
    }
  }

}





// ASYNC TEMPLATE --------------------------------------------------------------
// function asyncTemplate(fnAfter){
//
//   // asyncArr(array, fn_arr, fn_dom, fnAfter, context [, time])
//   asyncArr(EVENTS.all, itter, status, after, this);
//
//   // ITTER -----------------------------------------------------------
//   function itter(arr, i){
//     var a = arr[i]
//     /* ... some itteration code ... */
//   }
//
//   // STATUS ----------------------------------------------------------
//   function status(arr, i){
//     statusFields('Template', 'progress', arr, i);
//   };
//
//   // AFTER -----------------------------------------------------------
//   function after(arr, i){
//     status(arr, i); setTimeout(function () { fnAfter.call() }, 0);
//   }
// }
