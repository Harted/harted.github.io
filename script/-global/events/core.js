// LOAD SCRIPTS ----------------------------------------------------------------
loadScripts(

  // Directory
  'script/-global/events/',

  // Scripts array
  [
    'class/event', 'class/count', 'class/dist',
    'class/distevent', 'class/group', 'class/hdlow',
    'class/timeline',

    'parts'
  ],

)

// DEBUG:
// - Switching from realtime causes error because in middle of itterations
//    the sequence can go to the non realtime path

// GLOBAL var ------------------------------------------------------------------
var EVENTS = {
  all: [],
  filtered: [],
  visible: [],
  parts: [],
  dist: {},
}

var GROUPS = {
  ordered: {},
  byID: {}
}

// timelineStack to be able to cancel timeline creation
var timelineStack = []


// MASTER EVENTS FUNCTION ------------------------------------------------------
function Events(data, fnAfter, timer, init, context){

  var liveView = window.location.pathname == '/live.html' || TIME.rt

  // Create events --------------------------------------------------------     // createEvents
  // - Creating collumns from database data
  // - Create a date integer value
  // - Set shift & ON/OFF text
  // - Set zone and station (from TIA_GC object)
  // - Parse alarm parts (modezone, object, description)
  // - Parse alarm type with regular expressions
  createEvents(createEvents_after, data)

  // Analyze events -------------------------------------------------------     // analyzeEvents
  // - Set linkID, ACTIVE, start, end & ON event duration
  function createEvents_after(){ analyzeEvents(analyzeEvents_after) };

  // Link events ----------------------------------------------------------
  // - Set OFF event duration (complete the link)
  function analyzeEvents_after(idHasON, timeStore, linkIDn){
    // TEMP: liveView should be in next itteration (timeline)
    linkEvents(linkEvents_after, idHasON, timeStore, linkIDn)
  }

  // Timeline events || filter events -------------------------------------
  function linkEvents_after(idHasON) {
    if (liveView) {
      // - Filter alarms (in liveView or realtime)
      filterEvents(filterEvents_after);
    } else {
      // - Create HDLOWB timeline for event
      timelineEvents(timelineEvents_after, idHasON);
    }
  }

  // filter events --------------------------------------------------------
  function timelineEvents_after(){
    filterEvents(filterEvents_after);
  }

  // create event summary || Finish ---------------------------------------
  function filterEvents_after(){
    if (liveView) {
      groupEvents_after();
    } else {
      // - Count, sort and order alarms for overview
      distinctEvents(distinctEvents_after);
    }
  }

  // group events ---------------------------------------------------------
  function distinctEvents_after(){
    groupEvents(groupEvents_after);
  }

  // finish ---------------------------------------------------------------
  function groupEvents_after() {
    visibleEvents(); // (non async)
    fnAfter.call(context, timer, init)
  }

}
