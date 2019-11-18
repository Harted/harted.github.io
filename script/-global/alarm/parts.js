// CREATE ALARMS ---------------------------------------------------------------// createAlarms
function createAlarms(fnAfter, data){

  allAlarms = [];

  // asyncArr(array, fn_arr, fn_dom, fnAfter, context [, time])
  asyncArr(data, itter, status, after, this);

  // ITTER -----------------------------------------------------------
  function itter(arr, i){ allAlarms.push(new Alarm(arr[i], i)) };

  // STATUS ----------------------------------------------------------
  function status(arr, i){
    statusFields('Creating', 'progress', arr, i)
  };

  // AFTER -----------------------------------------------------------
  function after(arr,i){
    status(arr, i); setTimeout( function (){ fnAfter.call() } , 1);
  }
}


// Analyze alarms for active, duration and link --------------------------------// analyzeAlarms
function analyzeAlarms(fnAfter){

  var activeCheck = new Distinct(allAlarms, ['_var']);  // for finding ACTIVE
  var linkStore = copyObj(activeCheck)                 // for linkID storage

  var linkID = 0;         // linkID for ON.OFF events
  var linkIDn = -1;       // linkID for ACTIVE & OFF without ON
  var idHasON = []        // to check if id is given to ON event
  var timeStore = []      // time storage per ID

  // asyncArr(array, fn_arr, fn_dom, fnAfter, context [, time])
  asyncArr(allAlarms, itter, status, after, this);

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
      // Call next function with arguments used in linkAlarms()
      fnAfter.call(null, idHasON, timeStore, linkIDn)
    }, 1);
  }

};


// Link remaining events -------------------------------------------------------// linkAlarms
function linkAlarms(fnAfter, idHasON, timeStore, linkIDn){

  // asyncArr(array, fn_arr, fn_dom, fnAfter, context [, time])
  asyncArr(allAlarms, itter, status, after, this);

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


// TIMELINE ALARMS -------------------------------------------------------------// timelineAlarms
function timelineAlarms(fnAfter, idHasON){

  var cnt = new Distinct(allAlarms, ['_var']);  // for alarm counting
  var prodTlSet = []                            // for timeline reference

  // asyncArr(array, fn_arr, fn_dom, fnAfter, context [, time])
  asyncArr(allAlarms, itter, status, after, this);

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
        // OFF event is first in array so create the timeline
        // - store the reference to the timeline with linkID ref
        // ON event is second in array
        // - set timeline to stored reference
        // - this saves time by only creating timeline once
        if (a._state == 0){
          a._timeline = new ProdTimeline(a)
          prodTlSet[a._linkID] = a._timeline
        } else {
          a._timeline = prodTlSet[a._linkID]
        }
      } else { a._timeline = undefined }

      // Count alarms                                                           // NOTE: Hier ben ik
      if (cnt._var[a._var] == 1) { cnt._var[a._var] = new CountObj()}

      if (a._state == 0){
        cnt._var[a._var].add(a)
        a._count = cnt._var[a._var]
      } else {
        a._count = cnt._var[a._var] // add reference to count obj
      }

  }

  // STATUS ----------------------------------------------------------
  function status(arr, i){
    statusFields('Timeline', 'progress', arr, i);
  };

  // AFTER -----------------------------------------------------------
  function after(arr, i){
    status(arr, i); setTimeout(function () { fnAfter.call() }, 1);
  }
}











// [4] FILTER ALARMS -----------------------------------------------------------
function filterAlarms(fnAfter){

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
      fnAfter.call()
    }, 1);
  }

}




// [5] Distinct events sumary --------------------------------------------------
function distinctAlarms(fnAfter){

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
      fnAfter.call()
    }, 1);
  }


}

// timelineStack to be able to cancel timeline creation
var timelineStack = []

// [6] Group events ------------------------------------------------------------
function groupAlarms(fnAfter){

  // Don't analyze groups in live view
  if (window.location.pathname == '/live.html'){

    statusFields('Done', 'done');
    setTimeout(function () {
      fnAfter.call()
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
    fnAfter.call() // Call next function

  }
}














// TEMPLATE --------------------------------------------------------------------
// function asyncTemplate(fnAfter){
//
//   // asyncArr(array, fn_arr, fn_dom, fnAfter, context [, time])
//   asyncArr(allAlarms, itter, status, after, this);
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
//     status(arr, i); setTimeout(function () { fnAfter.call() }, 1);
//   }
// }
