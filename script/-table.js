// TABLE FUNCTION --------------------------------------------------------------
function table(settings, data){


  // FOOLPROOF ------------------------------------------------------------
  // foolproof check for settings object
  if (settings.obj_type != 'table_t') {
    // output the object ant status in console and exit function
    console.log(
      'Settings object' , settings , 'not compatible for function: table()'
    ); return;
  }




  //VARIABLES -------------------------------------------------------------
  var table = '' // table variable to output to html
  var j = 0 // index to calculate max string lenght of th and td
  var th_min_w = [] // to store th min-width
  var td_min_w = [] // to store td min-width

  // HEADER ---------------------------------------------------------------
  // table header, seperate table because of fixed header system
  // otherwise scrolling would be glitchy because the before row heigth is
  // constantly changed by scrolling
  table += '<table class="table-head"><thead>'
  // row before use for fixed header with scrolling
  // table += '<tr class="before"></tr>'
  // visible header ++++
  table += '<tr>'
  // get collumn header names from settings
  for (var col in settings.cols) {
    if (settings.cols.hasOwnProperty(col)) {

      // record string lenght, multiply with font width + arrow space
      th_min_w[j] =(settings.cols[col].length * settings.fontwidth)
      + settings.arrow;j++;

      // caption (text)
      table += '<th><span>' + settings.cols[col] + '</span>'

      // filterbox +++++++++++++++++++++++++++++++++++++++++++++++++++
      table += '<div class="filterbox" id="' + col + '_filter">'
      table += '<div class="filtertext">'

      // make distinct list
      var dis = distinct(data)[col]
      var arr = []

      for (var el in dis) {
        if (dis.hasOwnProperty(el)) {

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
        table += '<div><label for="' + arr[i] + '"><input type="checkbox" id="' + arr[i] + '" checked>'
        table += arr[i] + '</label></div>'
      }

      table += '</div></div>'
      // ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++


      // div overlay+++++++++++++++++++++++++++++++++++++++++++++++++++
      table += '<div class="th-overlay" id="' + col + '_overlay">'
      table += '<div class="arrow">'
      table += '<svg><g><path>'
      table += '</path></g></svg>'
      table += '</div>'
      table += '</div>'
      // ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
      table += '</th>'
    }
  }
  table += '</tr>'
  // close table (header)
  table += '</thead></table>'




  // BODY -----------------------------------------------------------------

  table += '<table class="table-body">'

  this.makeBody = function(d){
    body = []
    body.push('<body>')

    // for every record in array
    for (let i = 0; i < d.length; i++){
      body.push('<tr class="' + d[i].severity + ' ' + d[i]._type + ' ')

      // active
      if (d[i]._active) {
        body.push('active ')
      }

      // title (info on mouse over)
      body.push('" title="')
      body.push('Duration : ' + d[i]._durtxt + '\n')
      body.push('Variable : ' + d[i]._var)

      body.push('" id="linkID_' + d[i]._linkID + '_' + d[i].statetxt)

      body.push('" text="' + d[i]._durtxt)

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
          body.push('<td style="min-width:' + th_min_w[j] + 'px;"> ')
          // text
          body.push('<span>' + d[i][col] + '</span></td>')
        } else {
          // when there's nothing available
          body.push('<td>-n/a-</td>')
        }
        j++
      }
      body.push('</tr>')
    }
    // close table (body)
    body.push('</body>')

    return body
  }

  table += this.makeBody(data).join('')

  table += '</table>'

  // OUTPUT ---------------------------------------------------------------
  var el_id = document.getElementById(settings.id.replace('#',''));
  el_id.innerHTML = table




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
      //
    };
  };


  // FIXED HEADER - the header seems to be fixed because the 'before' row
  // gets the heigth of the top scroll height

  el_id.addEventListener("scroll", function(){
    el_thead[0].style.marginLeft = -el_id.scrollLeft + 'px'
  });




  // HOVER ----------------------------------------------------------------
  var body_tr = $(settings.id + ' tbody tr') // body table row object

  var id // to store id (array) [LinkID_ , n , ON/OFF]
  var id_int // to store id integer ('n' of previous)

  var freeze = false // to set true on click to freeze visual link
  var stored_id, stored_obj // to store id and obj on click

  var last_td // to store last_td obj for duration output
  var txt = [] // to store text

  // Get the line object to output the html
  var lineobj = $(settings.id).prev('.table-overlay').find('#line')


  // ON HOVER --------------------------------------------------------
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
            $(this).next().css('box-shadow', 'none')
            $(this).prev().css('box-shadow', 'none')
          } else {

            freeze = true // freeze is true: disable actions on hover

            // store id & object that has been clicked
            stored_id = $(this).attr('id')
            stored_obj = $(this)

            // box shadow to show it's freezed (clicked in it seems
            $(this).next()
            .css('box-shadow', 'inset 0px 6px 7px -5px rgba(0,0,0,0.5)')

            $(this).prev()
            .css('box-shadow', 'inset 0px -6px 7px -5px rgba(0,0,0,0.5)')

          }
        } else if (stored_id != undefined && freeze) {

          // CLICK ON OTHER OBJECT when freezed
          freeze = false

          // Execute mouseleave on freezed object and mouseenter on this one
          mouseleave(stored_obj); mouseenter($(this));

          // Remove shadow
          stored_obj.next().css('box-shadow', 'none')
          stored_obj.prev().css('box-shadow', 'none')

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


  // MOUSE ENTER -----------------------------------------------------
  function mouseenter(obj){

    // split the id in 3 parts [LinkID_ , n , ON/OFF]
    id = obj.attr('id').split('_');
    id_int = parseInt(id[1]); // parse integer from string

    // If object has an id it has a linked event
    if (id_int >= 0) {

      // DURATION
      // Find last td, store text, set text from custom text attribute
      last_td = obj.find('td').last()
      txt[0] = obj.attr('text')
      txt[1] = last_td.text()
      txt[2] =   last_td.attr('style')
      last_td.find('span').text(txt[0])

      // Give duration a style
      last_td.css({
        'font-size':'12px','font-weight':'bold', 'color':'#F5F5F5',
        'filter':'drop-shadow(0px 0px 1px rgba(0, 0, 0, 1))',
      })

      // LINKED EVENT OPACITY
      // Set objects for the linked events (ON & OFF)
      events = [
        $(settings.id + ' #linkID_' + id_int + '_OFF'),
        $(settings.id + ' #linkID_' + id_int + '_ON'),
      ]

      if (id[2] == 'OFF') {

        // If this event is OFF set ON's middle td's opacity lower
        linked_td = events[1].find('td')
        for (var i = 1; i < linked_td.length - 1; i++) {
          $(linked_td[i]).css('opacity',0.3)
        };

      } else {

        // If this event is ON set OFF's middle td's opacity lower
        linked_td = events[0].find('td')
        for (var i = 1; i < linked_td.length - 1; i++) {
          $(linked_td[i]).css('opacity',0.3)
        };

      }

      // BACKGROUND COLOR
      for (var i = 0; i < events.length; i++) {
        events[i].css({
          'background-color':'#A3C4BC',
        })
      }

      // DRAW CONNECTION LINE
      // - If there's no line to be drawn, don't apply event listeners
      if (drawLine()) {

        el_id.addEventListener('scroll', drawLine)
        window.addEventListener('resize', drawLine)

      } else {

        el_id.removeEventListener('scroll', drawLine)
        window.removeEventListener('resize', drawLine)

        lineobj.css('display','none')

      }

    } else {

      // On single object only change background color
      obj.css({'background-color':'#A3C4BC'});

    };
  }


  // MOUSE LEAVE -----------------------------------------------------
  function mouseleave(obj){

    // Remove eventlistener on mouse leave when it's set on enter
    if (drawLine != undefined) {
      el_id.removeEventListener('scroll', drawLine)
      window.removeEventListener('resize', drawLine)
    }

    // If object has an id it has a linked event
    if (id_int >= 0) {

      // Reset the state text
      last_td.find('span').text(txt[1])
      last_td.attr('style',txt[2])

      // Reset the opacities
      for (let i = 1; i < linked_td.length - 1; i++) {
        $(linked_td[i]).css('opacity',1)
      };

      // Reset to original style
      for (let i = 0; i < events.length; i++) {
        events[i].attr('style','')
      }

      // Display no line
      lineobj.css('display','none')

    } else {

      // Reset style when object has no linkID
      obj.attr('style','')

    }
  }


  function drawLine(){

    // Get trs positions
    // - off event is always above
    // - offset top of bottom off event = ot + oh
    var off_ot = events[0].offset().top
    var off_oh = events[0].outerHeight()
    var on_ot = events[1].offset().top

    // If trs are directly above or below eachother
    // - in this case the position of the OFF bottom is equal to ON top
    // - return false and don't draw a line
    if(off_ot + off_oh >= on_ot){
      return false;
    }

    // Get position fot the line
    // - The offset top of the table overlay
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


// TABLE HEADSIZE --------------------------------------------------------------
function tablesize(){

  //adjust headsize on tables
  for (var table in tables) {
    if (tables.hasOwnProperty(table)) {
      tables[table].headsize()
    }
  }

}
