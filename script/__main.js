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
    _duration: 'Comment',
    _linkID: 'Sev.',
    statetxt: 'State',
  },
  fontwidth: 6,
  arrow: 14,
}

// AJAX ------------------------------------------------------------------------
var base_data = [];
var tables = [];
var alarms = [];

function getData(){
  console.time('get data')
  $.ajax({
    url: '/script/ajax.php',
    type: "GET", // or "GET"
    data: 'stn=CLF3037:CMP310:CMP311:CMP305&sev=A:B:C:D&lbt=8/24',
    cache: false,
    dataType: "json",
    success: function(data) {
      console.timeEnd('get data')
      console.time('process')
      base_data = data
      processData(base_data)
      console.timeEnd('process')
      //getData()
    }
  });
}

function getData_home(){
  console.time('get data')
$.ajax({
  url: 'https://main.xfiddle.com/2efa0c76/alarmdata.php',
  type: "GET", // or "GET"
  cache: false,
  dataType: "json",
  success: function(data) {
    console.timeEnd('get data')
    console.time('process')
    base_data = data
    processData(base_data)
    console.timeEnd('process')
    //getData()
  }
});
}


getData_home()
// processData(base_data)

function processData(data) {

  tables = [];
  alarms = [];

  console.time('--push alarms');
  for (let i = 0; i < data.length; i++) {
    alarms.push(new alarm(data[i]).alarm)
  }; console.timeEnd('--push alarms');

  active('alarms','_var','statetxt','_state', 'datetime')

  console.time('--push tables');
  tables.push(new table(alarmlist_settings, alarms));
  console.timeEnd('--push tables');

  console.time('--flex');
  flex();
  console.timeEnd('--flex');

  console.time('--tableformat');
  tableformat();
  console.timeEnd('--tableformat');

  console.time('--arrows');
  arrows();
  console.timeEnd('--arrows');

  $('.fade').css({'opacity': 1});
  $('.fade_reverse').css({'opacity': 0});

}


//Responsive -------------------------------------------------------------------
$(window).on('resize',function(){
  flex();
  tableformat();
});
