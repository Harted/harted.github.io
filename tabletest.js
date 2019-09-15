//table setting object for table() function
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
    object: 'Object',
    comment: 'Comment',
    severity: 'Sev.',
    state: 'St.'
  },
}

const alarmlist2_settings = {
  obj_type: 'table_t',
  id: '#alarmlist2',
  cols : {
    datetime: 'DateTime',
    station: 'Station',
    // object: 'Object',
    comment: 'Comment',
    severity: 'Sev.',
    // state: 'St.'
  },
}

var tables = []

// ONLY! table() function should be implemented at work
var alarms = [];
$.ajax({
  url: 'https://main.xfiddle.com/2efa0c76/arr.php',
  type: "GET", // or "GET"
  cache: false,
  dataType: "json",
  success: function(data) {
    for (let i = 0; i < data.length; i++) {
      alarms.push(new alarm(data[i]).a)
    };
    //makeTable() function at work
    tables.push(new table(alarmlist_settings, alarms))
    tables.push(new table(alarmlist2_settings, alarms))
    console.log(tables)
  }
});

// DON'settings copy to the script at work!!! alarm() function already present
// Read comments for adjustments to alarm() function there..
function alarm(data) {

  //names of variables inside alarms object
  // NOTE: change array to object returned from server side..
  //then this is not needed. it already returns names for the parts
  //use these names
  //also: change variable names of cols in alarmlist settings
  const alarmparts = [
    'datetime', 'station', 'object', 'comment', 'severity', 'state'
  ]

  // NOTE: with the writings above this should also be changed at work..
  // the alarmparts can be removed but the new names should be kept..
  this.a = {}
  for (let i = 0; i < data.length; i++) {
    this.a[alarmparts[i]] = data[i]
  };
};

// Copy this table function to script at work
function table(settings, data){

  //FOOLPROOF ------------------------------------------------------------------
  //foolproof check for settings object
  if (settings.obj_type != 'table_t') {
    //output the object ant status in console
    console.log(
      'Settings object' , settings , 'not compatible for function: table()'
    )
    //exit function
    return;
  }

  //VARIABLE -------------------------------------------------------------------
  //table variable to output to html
  var table = ''

  //HEADER ---------------------------------------------------------------------
  //table header, seperate table because of fixed header system
  //otherwise scrolling would be glitchy because the before row heigth is
  //constantly changed by scrolling
  table += '<table><thead>'
  //row before use for fixed header with scrolling
  table += '<tr class="before"></tr>'

  //actual header
  table += '<tr>'
  //get collumn header names from settings
  for (var col in settings.cols) {
    if (settings.cols.hasOwnProperty(col)) {
      table += '<th>' + settings.cols[col] + '</th>'
    }
  }
  table += '</tr>'
  //close table (header)
  table += '</thead></table>'

  //BODY -----------------------------------------------------------------------
  //new table for body
  table += '<table><body>'

  //for every record in array
  for (let i = 0; i < data.length; i++){
    table += '<tr>'
    //var names in settings are the names of which variables you want
    //to fetch and place in table. (col = var name)-> so the order of the
    //header and the data is always the same.
    //If there would be a mistake in the var name in the settings object
    //there will be no data in the collumn.
    for (var col in settings.cols) {
      if (data[i].hasOwnProperty(col)) {
        table += '<td>' + data[i][col] + '</td>'
      } else {
        table += '<td>-n/a-</td>'
      }
    }
    table += '</tr>'
  }
  //close table (body)
  table += '</body></table>'

  //OUTPUT ---------------------------------------------------------------------
  $(settings.id).html(table)

  //FORMATTING -----------------------------------------------------------------
  //td min-width = th min width (before th width = td width)
  for (let i = 0; i < $(settings.id + ' th').length; i++) {
    //find the corresponding td (this will be the first row)
    //size of the other rows is identical to the first because it's a table...
    //set the td min_width to the min width of the th, because the header
    //isn't formated as a table part, otherwise the collumns could be smaller
    //than the header and that's ugly as fuuuucck :p

    $($(settings.id + ' td')[i]).css(
      'min-width', $(settings.id + ' th')[i].offsetWidth
    );

  };

  //th width = td width (same size for headers and collumns so they align)
  this.headsize = function(){
    for (let i = 0; i < $(settings.id + ' th').length; i++) {
      $($(settings.id + ' th')[i])
      //to set the with of the headers
      .width($($(settings.id + ' td')[i]).width())
      //to set the min-width of the headers so the headers can't be smaller
      //then the collumns
      .css('min-width', $($(settings.id + ' td')[i]).width())
    };
  };
  //execute on load and on resize
  this.headsize();

  //fixed header - the header seems to be fixed because the 'before' row
  // gets the heigth of the top scroll height
  $(settings.id).scroll(function(){
    $(settings.id + ' thead .before')
    .css('height', $(settings.id).scrollTop())
  });

};


//Responsive -------------------------------------------------------------------
$(window).on('resize',function(){
  //adjust headsize on tables
  for (var table in tables) {
    if (tables.hasOwnProperty(table)) {
      tables[table].headsize()
    }
  }
});
