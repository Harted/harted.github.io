// CONSTANTS -------------------------------------------------------------------
var userAgent = getUserAgent();

// Determine user agent --------------------------------------------------------
function getUserAgent() {

  var UA = navigator.userAgent || navigator.vendor || window.opera;

  if (/windows phone/i.test(UA)) {
    return 'WindowsPhone';
  } else if (/android/i.test(UA)) {
    return 'Android';
  } else if (/iPad|iPhone|iPod/.test(UA) && !window.MSStream) {
    return 'iOS';
  } else if (/Chrome/.test(UA)) {
    return 'Chrome';
  } else if (/Safari/.test(UA)) {
    return 'Safari';
  } else if (/Firefox/.test(UA)) {
    return 'Firefox';
  } else {
    console.log('unknown userAgent: ' + UA);
    return 'unknown';
  };

};

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
    object: 'Object',
    comment: 'Comment',
    severity: 'Sev.',
    state: 'St.'
  },
}

// AJAX ------------------------------------------------------------------------
// NOTE: try to do alarm fetching and table filling independent of eachother
var tables = []
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
    // tables.push(new table(alarmlist2_settings, alarms))
    // tables.push(new table(alarmlist3_settings, alarms))

    setTimeout(function () {
      flex();
      tableformat();


      //SVG arrow ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
      // NOTE: place outside.. or not.. see later, mude.. :p
      const arrow_svg = {
          viewbox : "0 0 100 100",
          down: "M94.33,25.33c2.75,0,3.41,1.59,1.46,3.54L53.54,71.13c-1.94,1.94-5.13"
          +",1.94-7.07,0L4.2,28.87c-1.94-1.94-1.29-3.54,1.46-3.54H94.33z",
          up: "M5.67,74.67c-2.75,0-3.41-1.59-1.46-3.54l42.26-42.26c1.94-1.94,5.13"
          +"-1.94,7.07,0L95.8,71.13c1.94,1.94,1.29,3.54-1.46,3.54H5.67z",
      }

      $('#alarmlist th div svg').attr('viewBox',arrow_svg.viewbox)
      $('#alarmlist th div path').attr('d',arrow_svg.down).addClass('down')
      //click event
      $('.th-overlay').click(function(event){

        //populate object with needed info
        var overlay = {
          table_id : $(this).closest('.table-scroll').attr('id'),
          id : $(this).attr('id'),
        }
        overlay['alarm_obj_id'] = overlay.id.replace('_overlay','') //needed later for filtering
        overlay['path'] = '#' + overlay.table_id + ' #' + overlay.id + ' path'
        overlay['current'] = $(overlay.path).attr('class')

        //change arrow on click -> future show filter div
        if (overlay.current == 'down'){
          $(overlay.path).attr('d',arrow_svg.up)
          .attr('class','up')
        } else {
          $(overlay.path).attr('d',arrow_svg.down)
          .attr('class','down')
        }

        //change all other arrows to down
        var other_ol = $('#' + overlay.table_id + ' .th-overlay')

        for (var i = 0; i < other_ol.length; i++) {
          var id = $(other_ol[i]).attr('id')
          if ( id != overlay.id){
            $('#' + overlay.table_id + ' #' + id + ' path')
            .attr('d',arrow_svg.down).attr('class','down')
          }
        }


      })
      //SVG arrow ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

      $('.fade').css({
        'opacity': 1,
        'transition': '250ms'
      });
    }, 250);
  }
});

//ALARM FUNCTION ---------------------------------------------------------------
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

// TABLE FUNCTION --------------------------------------------------------------
function table(settings, data){

  //FOOLPROOF -------------------------------------------------------------
  //foolproof check for settings object
  if (settings.obj_type != 'table_t') {
    //output the object ant status in console
    console.log(
      'Settings object' , settings , 'not compatible for function: table()'
    )
    //exit function
    return;
  }

  //VARIABLE --------------------------------------------------------------
  //table variable to output to html
  var table = ''

  //HEADER ----------------------------------------------------------------
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
      table += '<th><span>' + settings.cols[col] + '</span>'
      //div overlay+++++++++++++++++++++++++++++++++++++++++++++++++++
      table += '<div class="th-overlay" id="' + col + '_overlay">'
      table += '<div class="arrow">'
      table += '<svg><g><path>'
      table += '</path></g></svg>'
      table += '</div>'
      table += '</div>'
      //++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
      table += '</th>'
    }
  }
  table += '</tr>'
  //close table (header)
  table += '</thead></table>'

  //BODY ------------------------------------------------------------------
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
        table += '<td><span>' + data[i][col] + '</span></td>'
      } else {
        table += '<td>-n/a-</td>'
      }
    }
    table += '</tr>'
  }
  //close table (body)
  table += '</body></table>'

  //OUTPUT ----------------------------------------------------------------
  $(settings.id).html(table)

  //FORMATTING ------------------------------------------------------------
  //td min-width = th min width (before th width = td width)
  for (let i = 0; i < $(settings.id + ' th').length; i++) {
    //find the corresponding td (this will be the first row)
    //size of the other rows is identical to the first because it's a table...
    //set the td min_width to the min width of the th, because the header
    //isn't formated as a table part, otherwise the collumns could be smaller
    //than the header and that's ugly as fuuuucck :p
    $($(settings.id + ' td')[i]).css(
      'min-width', $($(settings.id + ' th')[i]).width() //NOTE: change at work!
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
  // this.headsize(); // NOTE: now triggered outside when all tables are made
  // this is because flex does things to the sizes, so the final size of the
  // tables is only known when all the tables are made.

  //fixed header - the header seems to be fixed because the 'before' row
  // gets the heigth of the top scroll height
  $(settings.id).scroll(function(){
    $(settings.id + ' thead .before')
    .css('height', $(settings.id).scrollTop())
  });

};


//Responsive -------------------------------------------------------------------
$(window).on('resize',function(){
  flex();
  tableformat();
});

// TABLE FORMAT -----------------------------------------------------------
function tableformat(){

  //adjust headsize on tables
  for (var table in tables) {
    if (tables.hasOwnProperty(table)) {
      tables[table].headsize()
    }
  }
  //set table container size to part of 100% according to the amount of tables
  $('.table-container').css('height', 100/tables.length + '%')

}

// FLEX FORMAT ------------------------------------------------------------
function flex(){ // NOTE: Copy new flex function at work

  // FLEX CONTAINER HEIGHT -------------------------------------------
  var wiH = window.innerHeight
  var hcH = $('#header')[0].clientHeight
  var fcH = $('#footer')[0].clientHeight

  //set container to height between header and footer
  $('.flex-container').css('height', wiH - hcH - fcH)


  // OVERFLOW FIX ----------------------------------------------------
  // inner width of flex container
  var fc_iw = $('.flex-container').width()
  // outer width + margin of flex container
  var fc_ow = $('.flex-container').outerWidth(true)
  // subtract inner from outer to get the total lr margin
  var fc_tot_m = (fc_ow - fc_iw)
  // margin of flex-container and flex-item are the same
  // when only using flex-container input there's no confict setting the
  // max width to the flex-items
  // | fc_m | fi_m |  <flex-item>  | fi_m | fc_m |  (fc_m = fi_m)
  var fi_tar_w = fc_iw - fc_tot_m

  // set max width
  $('.flex-item').css('max-width',fi_tar_w)


  // FLEX ITEM HEIGHT ------------------------------------------------
  //get the width of the table space
  var ftsw = $('.flex-table-space').width()

  //set size to 100% when next to eachother
  if($('#flex-table')[0].offsetTop == $('#flex-form')[0].offsetTop){
    $('.flex-item').css('height', '100%')
  } else {
    $('.flex-item').css('height', '40%')
  }


}
