//GLOBAL TABLE var -------------------------------------------------------------
var table

//SETTINGS object for table() function -----------------------------------------
const alarmlist_settings = {
  //fool proof check for object to be compatible with table() function
  obj_type: 'table_t',
  //div id to output table
  id: '#alarmlist',
  //variable names should be object names in the data array
  //order of variables is also order of collumns in table
  //strings are header captions
  cols : {
    _datetime: 'DateTime', // _ = don't apply filter
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

// INIT TABLE
function setTable(){
  table = new makeTable(alarmlist_settings, alarms);
  table.dl() // Reset line
}

var tableready = false

// tbl +FUNCTION --------------------------------------------------------------
function makeTable(settings, data){


  // FOOLPROOF ------------------------------------------------------------
  // foolproof check for settings object
  if (settings.obj_type != 'table_t') {
    // output the object ant status in console and exit function
    console.log(
      'Settings object' , settings , 'not compatible for function: table()'
    ); return;
  }


  //VARIABLES -------------------------------------------------------------
  var tbl = '' // tbl +variable to output to html
  var j = 0 // index to calculate max string lenght of th and td
  var th_min_w = [] // to store th min-width
  var td_min_w = [] // to store td min-width

  // HEADER ---------------------------------------------------------------
  // tbl +header, seperate tbl +because of fixed header system
  // otherwise scrolling would be glitchy because the before row heigth is
  // constantly changed by scrolling
  tbl += '<table class="table-head"><thead>'

  // row before use for fixed header with scrolling
  // tbl += '<tr class="before"></tr>'
  // visible header ++++
  tbl += '<tr>'

  //prepare distinct data for filter
  var dist_f = distinct(data)

  // get collumn header names from settings
  for (var col in settings.cols) {
    if (settings.cols.hasOwnProperty(col)) {

      // record string lenght, multiply with font width + arrow space
      th_min_w[j] =(settings.cols[col].length * settings.fontwidth)
      + settings.arrow;j++;

      // caption (text)
      tbl += '<th><span>' + settings.cols[col] + '</span>'

      // filterbox +++++++++++++++++++++++++++++++++++++++++++++++++++
      tbl += '<div class="filterbox" id="' + col + '_filter">'

      // only add filter items on collumns without an underscore
      if(col.search('_') < 0) {

        // One & All buttons
        tbl += '<div class="fltrbtn" id="one">One</div>'
        tbl += '<div class="fltrbtn" id="all">All</div>'

        // Filter checkboxes
        tbl += '<div class="filtertext">'

        // make distinct list
        var elements = dist_f[col]
        var arr = []

        // fill array to sort
        for (var el in elements) {
          if (elements.hasOwnProperty(el)) {

            // replace blanks with '-blanks-'
            if (el == '') {el = '-blanks-'}
            // fill an array
            arr.push(el)
          }
        }

        // Sort the array
        arr.sort()

        // make the filterlist
        for (var i = 0; i < arr.length; i++) {

          //give conpatible id (no spaces and weird signs)
          var usid = arr[i].replace(/[ \/\\\:\.\-\+\,\?\&\=\(\)]/g,'_')

          //set input id, text and the label link
          //label link needed for click on text to toggle
          tbl += '<div class="visible"><label for="' + usid + '">'
          tbl += '<input type="checkbox" id="' + usid + '" checked>'
          tbl += arr[i] + '</label></div>'

        }

        tbl += '</div>'
      }

      tbl += '</div>'
      // ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++


      // div overlay+++++++++++++++++++++++++++++++++++++++++++++++++++
      tbl += '<div class="th-overlay" id="' + col + '_overlay">'
      tbl += '<div class="arrow">'
      tbl += '<svg><g><path>'
      tbl += '</path></g></svg>'
      tbl += '</div>'
      tbl += '</div>'
      // ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
      tbl += '</th>'
    }
  }
  tbl += '</tr>'
  // close tbl +(header)
  tbl += '</thead></table>'




  // BODY -----------------------------------------------------------------
  // Made internal function to access from outside (not use atm)

  tbl += '<table class="table-body">'

  this.makeBody = function(d){
    body = []
    body.push('<body>')

    // for every record in array
    for (let i = 0; i < d.length; i++){
      body.push('<tr class="' + d[i].severity + ' ' + d[i]._type + ' ')

      // active
      if (d[i]._active) {
        body.push('active ')
        if (TIME.rt) { body.push('duration ') }
      }

      // title (info on mouse over)
      body.push('" title="')
      body.push(d[i]._zone + ' - ')
      body.push(d[i]._stntxt + '\n')

      body.push('Variable : ' + d[i]._var + '\n')
      body.push('Duration : ' + d[i]._durtxt)

      body.push('" id="linkID_' + d[i]._linkID + '_' + d[i].statetxt)

      body.push('">')

      // var names in settings are the names of which variables you want
      // to fetch and place in table. (col = var name)-> so the order of the
      // header and the data is always the same.
      // If there would be a mistake in the var name in the settings object
      // there will be no data in the collumn.

      j = 0 // reset index for getting th maximum string lenght

      for (var col in settings.cols) {
        if (d[i].hasOwnProperty(col)) {
          // min-width based on th string length
          body.push('<td ')

          // Add duration text to duration col td
          if (col == 'statetxt') {body.push(' text="' + d[i]._durtxt + '"')}

          // Min-width for td = th min width
          body.push(' style="min-width:' + th_min_w[j] + 'px;"> ')

          // text
          body.push('<span>' + d[i][col] + '</span></td>')
        } else {
          // when there's nothing available
          body.push('<td>n/a</td>')
        }
        j++
      }
      body.push('</tr>')

      // Event limit
      if (i == alarmlimit - 1) {
        body.push('<tr id="linkID_">')
        body.push('<td><span>' + alarmlimit + ' events limit reached..</span></td>')
        body.push('<td></td><td></td><td></td><td></td><td></td><td></td><td></td>')
        body.push('</tr>')
      }

    }
    // close tbl +(body)
    body.push('</body>')

    return body
  }

  tbl += this.makeBody(data).join('')

  tbl += '</table>'

  // OUTPUT ---------------------------------------------------------------
  var el_id = document.getElementById(settings.id.replace('#',''));
  el_id.innerHTML = tbl

  if(!tableready){tableready = true}

  // FORMAT ---------------------------------------------------------------
  // th min-width = td width (align headers with content)

  var el_td = el_id.getElementsByTagName('td');
  var el_th = el_id.getElementsByTagName('th');
  var el_thead = el_id.getElementsByTagName('thead');

  this.headsize = function(){
    var td_width = 0

    for (let i = 0; i < $(settings.id + ' th').length; i++) {

      //get td widht
      td_width = getComputedStyle(el_td[i]).width

      //set th min-widht
      el_th[i].style.minWidth = td_width

      //keep th left position always (also on realtime)
      th_lpos()

    };
  };


  // FIXED HEADER - the header seems to be fixed because the 'before' row
  // gets the heigth of the top scroll height
  el_id.addEventListener("scroll", th_lpos)
  function th_lpos(){
    el_thead[0].style.marginLeft = -el_id.scrollLeft + 'px'
  }


  // HOVER ----------------------------------------------------------------
  var body_tr // body tbl +row object

  var id // to store id (array) [LinkID_ , n , ON/OFF]
  var id_int // to store id integer ('n' of previous)

  var freeze // to set true on click to freeze visual link
  var stored_id, stored_obj // to store id and obj on click

  // line object to output the html
  var lineobj = $(settings.id).prev('.table-overlay').find('#line')

  // ON HOVER --------------------------------------------------------
  this.setHover = function(external){

    // when triggerd from filter and if one is fixed when applying filter
    // set stored_id to false, therwise freezing doesn't work
    // also hide the link =)
    if (external) {stored_id = undefined;lineobj.css('display','none')}

    body_tr = $(settings.id + ' tbody tr')
    freeze = false

    body_tr.hover(
      function(){

        // add click event on mouseenter
        $(this).on('click', onclick)

        // FREEZE ON CLICK (disable the mouseenter event on other tr's)
        function onclick(){

          if (stored_id == undefined || stored_id == $(this).attr('id')) {
            if(freeze){

              // CLICK ON THIS OBJECT when freezed
              // reset stored id & object, set freeze to false, remove shadow
              stored_id = undefined ; stored_obj = undefined ; freeze = false;
              $(this).removeClass('freeze')

            } else {

              freeze = true // freeze is true: disable actions on hover

              // store id & object that has been clicked
              stored_id = $(this).attr('id')
              stored_obj = $(this)

              // box shadow to show it's freezed
              $(this).addClass('freeze')

            }
          } else if (stored_id != undefined && freeze) {

            // CLICK ON OTHER OBJECT when freezed
            freeze = false

            // Execute mouseleave on freezed object and mouseenter on this one
            mouseleave(stored_obj); mouseenter($(this));

            // Remove shadow
            stored_obj.removeClass('freeze')

            // reset stored id & object
            stored_id = undefined; stored_obj = undefined

          };
        };

        // DON'T execute actions when freeze = true
        if (freeze) {return;}

        mouseenter($(this)) // ++++++++++MOUSE ENTER++++++++++++

      },
      function(){

        // remover click event on mouseleave
        // (otherwise there are new ones on each hover.. )
        $(this).off('click')

        // DON'T execute actions when freeze = true
        if (freeze) {return;}

        mouseleave($(this)) // ++++++++++MOUSE LEAVE++++++++++++

      }
    );
  };

  if(!TIME.rt) {this.setHover(false);} // disable on realtime

  var events = []

  // MOUSE ENTER -----------------------------------------------------
  function mouseenter(obj){

    // split the id in 3 parts [LinkID_ , n , ON/OFF]
    id = obj.attr('id').split('_');
    id_int = parseInt(id[1]); // parse integer from string

    // DURATION
    obj.addClass('duration')
    table.headsize()

    // If object has an id it has a linked event
    if (id_int >= 0) {

      // LINKED EVENT OPACITY
      // Set objects for the linked events (ON & OFF)
      events = [
        $(settings.id + ' #linkID_' + id_int + '_OFF'),
        $(settings.id + ' #linkID_' + id_int + '_ON'),
      ]

      // Set opacity of linked event low
      if (id[2] == 'OFF') {
        events[1].addClass('linked_td')
      } else {
        events[0].addClass('linked_td')
      }

      // BACKGROUND COLOR
      for (var i = 0; i < events.length; i++) {
        events[i].addClass('hover')
      }

      // DRAW CONNECTION LINE
      // - If there's no line to be drawn, don't apply event listeners
      if (drawLine()) {

        el_id.addEventListener('scroll', drawLine)
        window.addEventListener('resize', drawLine)

      } else {

        el_id.removeEventListener('scroll', drawLine)
        window.removeEventListener('resize', drawLine)

      }

    } else {

      // On single object only change background color
      obj.addClass('hover');

    };
  }


  // MOUSE LEAVE -----------------------------------------------------
  function mouseleave(obj){

    // Remove duration
    obj.removeClass('duration')
    table.headsize()

    // Remove eventlistener on mouse leave when it's set on enter
    if (drawLine != undefined) {
      el_id.removeEventListener('scroll', drawLine)
      window.removeEventListener('resize', drawLine)
    }

    // If object has an id it has a linked event
    if (id_int >= 0) {

      // Reset to original style
      for (let i = 0; i < events.length; i++) {
        events[i].removeClass('hover linked_td')
      }

      // Display no line
      lineobj.css('display','none')

    } else {

      // Reset style when object has no linkID
      obj.removeClass('hover')

    }

    // Reset events object
    events = []

  }

  this.dl = function (){drawLine()}

  function drawLine(){

    // always hide line upfront
    lineobj.css('display','none')

    // no events -> don't draw line
    if (events.length == 0) {return false}

    // if one or more is hidden don't draw line
    if (events[0].hasClass('hidden') || events[1].hasClass('hidden')){
      return false;
    }

    // if off event at end of 1000 events
    if (events[1].length == 0) {return false}

    // Get trs positions
    // - off event is always above
    // - offset top of bottom off event = ot + oh
    var off_ot = events[0].offset().top
    var off_oh = events[0].outerHeight()
    var on_ot = events[1].offset().top

    // If trs are directly above or below eachother
    // - in this case the position of the OFF bottom is equal to ON top
    // - return false and don't draw a line
    if(off_ot + off_oh >= on_ot){ return false; }

    // Get position fot the line
    // - The offset top of the tbl +overlay
    // - The offset left of the second td (-6 = half the div width)
    var sh_ot = $(settings.id).prev('.table-overlay').offset().top
    var l = el_th[1].offsetLeft - 6;

    // Calculater line t(op) Y, b(ottom) Y and h(eight)
    var t = off_ot - sh_ot + off_oh
    var b = on_ot - sh_ot
    var h = b - t

    // Draw the line
    line(h, l , t, b)

    // Return true for the event listeners to apply
    return true;

  };


  function line(h, osl, t, b){

    // Prepare the string for the svg
    var l = '<svg viewBox="0 0 12 ' + h + '">'
    l += '<line x1="6" y1="0" x2="6" y2="' + h + '" />'
    l += '<circle cx="6" cy="' + h + '" r="4" />'
    l += '<circle cx="6" cy="0" r="4"/>'
    l += ' <polygon points="6,' + ((h/2)-4) + ' 2,'
    l += ((h/2)+4) + ' 10,' + ((h/2)+4) + '" />'
    l += '</svg>'

    // Output the html and set the div style for positioning
    lineobj.html(l)
    lineobj.css({
      'display': 'block',
      'height': h,
      'left': osl,
      'top': t,
      'bottom': b,
    });
  };
};
