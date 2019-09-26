

function ready(){
  console.timeEnd('Document ready')

getData_home();
}

// Less finished ---------------------------------------------------------------
less.pageLoadFinished.then(
  function() {
    console.timeEnd('Less ready')
    $('.fade_less').css('opacity', 1);
  }
);

// AJAX ------------------------------------------------------------------------
var data = [];
var tables = [];
var alarms = [];

var stn = ['CLF3037','CLF2028']
var stn_str = stn.join(':')

var sev = ['A','B','C','D']
var sev_str = sev.join(':')

var lbt = '1/48'

function getData(){
  console.time('Data')
  $.ajax({
    url: '/script/ajax.php',
    type: "GET",
    cache: false,
    dataType: "json",
    data: {
      stn: stn_str,
      sev: sev_str,
      lbt: lbt,
    },
  }).done(function(received) {

    console.timeEnd('Data')
    console.time('Processing')
    data = received
    processData(data)
    console.timeEnd('Processing')
    console.timeEnd('----Ready')

  })
  .fail(function() {console.log("Ajax: error");});
}


function getData_home(){

  $.ajax({
    url: 'https://main.xfiddle.com/2efa0c76/alarmdata2.php',
    type: "GET", // or "GET"
    cache: false,
    dataType: "json",
    success: function(received) {

      console.timeEnd('Data')
      console.time('Processing')
      data = received
      processData(data)
      console.timeEnd('Processing')
      console.timeEnd('----Ready')

    }
  });
}


function processData(data) {

  tables = [];
  alarms = [];


  for (let i = 0; i < data.length; i++) {
    alarms.push(new alarm(data[i]).alarm)
  };

  analyze('alarms','_var','_statetxt','_state', '_datetime')


  tables.push(new table(alarmlist_settings, alarms));
  // NOTE: multiple tables are possible but still need some work
  // I will implement when needed
  // Mind good referencing and line height ristrictions to
  // not overlay on the other table

  //set table container size to part of 100% according to the amount of tables
  $('#table-container').css('height', 100/tables.length + '%')

  flex();

  tablesize();

  filterbox();

  initFilter();


  $('.fade').css({'opacity': 1});
  $('.fade_reverse').css({'opacity': 0});

}
