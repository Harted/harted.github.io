// GLOBAL alarms var -----------------------------------------------------------
var alarms
var allAlarms, filteredAlarms
var alarmParts
var groups = {}
var groupsByID = {}

var distAlarms


// TODO:
// - replace 'alarms' by 'visibleAlarms'




// MASTER ALARMS FUNCTION ------------------------------------------------------
function Alarms(data, fnAfter, timer, init, context){

  var liveView = window.location.pathname == '/live.html' || TIME.rt

  // Create alarms --------------------------------------------------------
  // - Creating collumns from database data
  // - Create a date integer value
  // - Set shift & ON/OFF text
  // - Set zone and station (from TIA_GC object)
  // - Parse alarm parts (modezone, object, description)
  // - Parse alarm type with regular expressions
  createAlarms(createAlarms_after, data)


  // Analyze alarms -------------------------------------------------------
  // - Set linkID, ACTIVE, start, end & ON event duration
  function createAlarms_after(){ analyzeAlarms(analyzeAlarms_after) };


  // Link alarms ----------------------------------------------------------
  // - Set OFF event duration (complete the link)
  function analyzeAlarms_after(idHasON, timeStore, linkIDn){
    // TEMP: liveView should be in next itteration (timeline)
    linkAlarms(linkAlarms_after, idHasON, timeStore, linkIDn)
  }

  // Timeline alarms || filterAlarms --------------------------------------
  function linkAlarms_after(idHasON) {
    if (liveView) {
      filterAlarms(filterAlarms_after);
    } else {
      timelineAlarms(timelineAlarms_after, idHasON);

      // DEBUG: : To check dif between total time and timeline total time
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
  }


  function timelineAlarms_after(){
    filterAlarms(filterAlarms_after);
  }

  function filterAlarms_after(){
    if (liveView) {
      groupAlarms_after();
    } else {
      distinctAlarms(distinctAlarms_after);
    }

  }

  function distinctAlarms_after(){
    groupAlarms(groupAlarms_after);
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

    fnAfter.call(context, timer, init)

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
