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


// MASTER ALARMS FUNCTION ------------------------------------------------------
function Events(data, fnAfter, timer, init, context){

  var liveView = window.location.pathname == '/live.html' || TIME.rt

  // Create alarms --------------------------------------------------------
  // - Creating collumns from database data
  // - Create a date integer value
  // - Set shift & ON/OFF text
  // - Set zone and station (from TIA_GC object)
  // - Parse alarm parts (modezone, object, description)
  // - Parse alarm type with regular expressions
  createEvents(createAlarms_after, data)

  // Analyze alarms -------------------------------------------------------
  // - Set linkID, ACTIVE, start, end & ON event duration
  function createAlarms_after(){ analyzeEvents(analyzeAlarms_after) };

  // Link alarms ----------------------------------------------------------
  // - Set OFF event duration (complete the link)
  function analyzeAlarms_after(idHasON, timeStore, linkIDn){
    // TEMP: liveView should be in next itteration (timeline)
    linkEvents(linkAlarms_after, idHasON, timeStore, linkIDn)
  }

  // Timeline alarms || filterAlarms --------------------------------------
  function linkAlarms_after(idHasON) {
    if (liveView) {
      // - Filter alarms (in liveView or realtime)
      filterEvents(filterAlarms_after);
    } else {
      // - Create HDLOWB timeline for event
      timelineEvents(timelineAlarms_after, idHasON);
    }
  }

  // filterAlarms ---------------------------------------------------------
  function timelineAlarms_after(){
    filterEvents(filterAlarms_after);
  }

  // create event summary || Finish ---------------------------------------
  function filterAlarms_after(){
    if (liveView) {
      groupAlarms_after();
    } else {
      // - Count sort and order alarms for overview
      distinctEvents(distinctAlarms_after);
    }
  }

  function distinctAlarms_after(){
    groupEvents(groupAlarms_after);
  }

  //// NOTE: CLEANUP this part
  function groupAlarms_after() {

    var alarmLimit = 1000

    // Alarm limit -----------------------------------------------------
    var len

    if (EVENTS.filtered.length < alarmLimit) {
      len = EVENTS.filtered.length
    } else {
      len = alarmLimit
    }

    EVENTS.visible = [];

    for (let i = 0; i < len; i++) {
      EVENTS.visible.push(EVENTS.filtered[i])
    }


    // Alarm parts ----------------------------------------------------
    EVENTS.parts = []

    for (let i = 0; i < EVENTS.filtered.length; i++) {

      p = Math.ceil((i+1)/alarmLimit) - 1

      if (EVENTS.parts[p] == undefined) {
        EVENTS.parts[p] = []
      }

      EVENTS.parts[p].push(EVENTS.filtered[i])

    }

    alarmPages(alarmLimit);

    // Fill no data item in alarms when there's no data ---------------
    if (EVENTS.filtered.length == 0) {
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

    fnAfter.call(context, timer, init)

  }

}








function alarmPages(alarmLimit){

  if(EVENTS.filtered.length > alarmLimit){

    var pages = EVENTS.parts.length
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

          EVENTS.visible = EVENTS.parts[v - 1]

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
