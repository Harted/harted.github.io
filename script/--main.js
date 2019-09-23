//table setting object for table() function ------------------------------------
const alarmlist_settings = {
  //fool proof check for object to be compatible with table() function
  obj_type: 'table_t',
  //div id to output table
  id: '#alarmlist',
  //variable names should be object names in the data array
  //order of variables is also order of collumns in table
  //strings are header captions
  cols : {
    datetime: 'DateTime',
    station: 'Station',
    zone: 'Zone',
    object: 'Object',
    description: 'Description',
    comment: 'Comment',
    severity: 'Sev.',
    statetxt: 'State',
  },
  fontwidth: 6,
  arrow: 14,
}

function ready(){
  console.timeEnd('Document ready')
  console.time('Data')
  getData()
}

// Less finished ---------------------------------------------------------------
less.pageLoadFinished.then(
  function() {
    console.timeEnd('Less ready')
    $('.fade_less').css('opacity', 1);
  }
);

// AJAX ------------------------------------------------------------------------
var base_data = [];
var tables = [];
var alarms = [];

function getData(){

  $.ajax({
    url: '/script/ajax.php',
    type: "GET", // or "GET"
    data: 'stn=CLF3037&sev=A:B:C:D&lbt=1/24',
    cache: false,
    dataType: "json",
    success: function(data) {

      console.timeEnd('Data')
      console.time('Processing')
      base_data = data
      processData(base_data)
      console.timeEnd('Processing')
      console.timeEnd('----Ready')


      //getData()
    }
  });
}

function getData_home(){

  $.ajax({
    url: 'https://main.xfiddle.com/2efa0c76/alarmdata.php',
    type: "GET", // or "GET"
    cache: false,
    dataType: "json",
    success: function(data) {

      console.timeEnd('Data')
      console.time('Processing')
      base_data = data
      processData(base_data)
      console.timeEnd('Processing')
      console.timeEnd('----Ready')

      //getData()
    }
  });
}




function processData(data) {

  tables = [];
  alarms = [];


  for (let i = 0; i < data.length; i++) {
    alarms.push(new alarm(data[i]).alarm)
  };

  analyze('alarms','_var','statetxt','_state', 'datetime')


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

  filter();


  $('.fade').css({'opacity': 1});
  $('.fade_reverse').css({'opacity': 0});

}
