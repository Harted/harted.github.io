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


  //VARIABLES -------------------------------------------------------------
  var table = '' //table variable to output to html
  var j = 0 //index to calculate max string lenght of th and td
  var th_min_w = [] //to store th min-width
  var td_min_w = [] //to store td min-width

  console.time('----header')
  //HEADER ----------------------------------------------------------------
  //table header, seperate table because of fixed header system
  //otherwise scrolling would be glitchy because the before row heigth is
  //constantly changed by scrolling
  table += '<table><thead>'
  //row before use for fixed header with scrolling
  table += '<tr class="before"></tr>'
  //visible header ++++
  table += '<tr>'
  //get collumn header names from settings
  for (var col in settings.cols) {
    if (settings.cols.hasOwnProperty(col)) {

      //record string lenght, multiply with font width + arrow space
      th_min_w[j] =(settings.cols[col].length * settings.fontwidth)
      + settings.arrow;j++;

      // caption (text)
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

  console.timeEnd('----header')
  console.time('----body')

  //BODY ------------------------------------------------------------------
  //new table for body
  table += '<table><body>'

  //for every record in array
  for (let i = 0; i < data.length; i++){
    table += '<tr class="' + data[i].severity + ' ' + data[i]._type + ' '
    table += 'linkID_' + data[i]._linkID + ' '
    table += data[i].statetxt + ' '

    //active
    if (data[i]._active) {
      table += 'active '
    }

    //title (info on mouse over)
    table += '" title="'
    table += 'Duration : ' + data[i]._durtxt + '\n'
    table += 'Variable : ' + data[i]._var

    table += '" id="linkID_' + data[i]._linkID + '_' + data[i].statetxt

    table += '" text="' + data[i]._durtxt

    table += '">'

    //var names in settings are the names of which variables you want
    //to fetch and place in table. (col = var name)-> so the order of the
    //header and the data is always the same.
    //If there would be a mistake in the var name in the settings object
    //there will be no data in the collumn.

    j = 0 // reset index for getting th maximum string lenght

    for (var col in settings.cols) {
      if (data[i].hasOwnProperty(col)) {
        // min-width based on th string length
        table += '<td style="min-width:' + th_min_w[j] + 'px;" '
        // text
        table += '<span>' + data[i][col] + '</span></td>'
      } else {
        // when there's nothing available
        table += '<td>-n/a-</td>'
      }
      j++
    }
    table += '</tr>'
  }
  //close table (body)
  table += '</body></table>'

  console.timeEnd('----body')

  console.time('----output')

  var el_id = document.getElementById(settings.id.replace('#',''));

  //OUTPUT ----------------------------------------------------------------
  el_id.innerHTML = table

  console.timeEnd('----output')
  console.time('----formatting')

  var el_td = el_id.getElementsByTagName('td');
  var el_th = el_id.getElementsByTagName('th');

  //FORMAT ----------------------------------------------------------------
  //th min-width = td width (same size for headers and collumns so they align)

  this.headsize = function(){
    var td_width = 0

    for (let i = 0; i < $(settings.id + ' th').length; i++) {

      // console.time('------headsize: ' + i)
      //get td widht
      td_width = getComputedStyle(el_td[i]).width
      //set th min-widht
      el_th[i].style.minWidth = td_width
      // console.timeEnd('------headsize: ' + i)
    };
  };

  //fixed header - the header seems to be fixed because the 'before' row
  // gets the heigth of the top scroll height
  var el_before = el_id.getElementsByClassName('before')[0]

  el_id.addEventListener("scroll", function(){
    el_before.style.height = el_id.scrollTop + 'px'
  });

  var id, bc = [], companion, text = [], td, id_int, freeze = false

  var body_tr = $(settings.id + ' tbody tr')

  var color, store_id

  var dl

  // Hover functions
  body_tr.hover(
    function(){

      $(this).on('click', onclick)

      function onclick(){
        if (store_id == undefined || store_id == $(this).attr('id')) {
          if(freeze){
            store_id = undefined
            freeze=false
            $(this).css('box-shadow', 'inset 0 0 0px rgba(0,0,0,.7)')
          }else{
            freeze=true
            store_id = $(this).attr('id')
            $(this).css('box-shadow', 'inset 0 0 6px rgba(0,0,0,.7)')
          }
        }
      }

      if (freeze) {return;}

      id = $(this).attr('id').split('_');
      id_int = parseInt(id[1]);

      if (id_int >= 0) {

        td = $(this).find('td').last()
        text[0] = $(this).attr('text')
        text[1] = td.text()
        td.text(text[0])

        events = [
          $(settings.id + ' #linkID_' + id_int + '_OFF'),
          $(settings.id + ' #linkID_' + id_int + '_ON'),
        ]

        switch (id[2]) {
          case 'OFF':
          linked_td = events[1].find('td')
          for (var i = 1; i < linked_td.length - 1; i++) {
            $(linked_td[i]).css('opacity',0)
          }; break;
          case 'ON':
          linked_td = events[0].find('td')
          for (var i = 1; i < linked_td.length - 1; i++) {
            $(linked_td[i]).css('opacity',0)
          }; break;
          default: return;
        }

        for (var i = 0; i < events.length; i++) {
          bc[i] = events[i].css('background-color')
          events[i].css('background-color','#A3C4BC')
        }




        // drawLine(el_th)

        dl = function(){return drawLine(el_th)}

        if (dl()) {

          el_id.addEventListener('scroll', dl)
          window.addEventListener('resize', dl)

        } else {

          el_id.removeEventListener('scroll', dl)
          window.removeEventListener('resize', dl)

          $('#line').css('display','none')

        }

      } else {

        bc[0] = $(this).css('background-color')
        $(this).css('background-color','#A3C4BC');

      };


    },
    function(){
      $(this).off('click')

      if (freeze) {return;}

      if (dl != undefined) {
        el_id.removeEventListener('scroll', dl)
        window.removeEventListener('resize', dl)
      }

      if (id_int >= 0) {

        td.text(text[1])

        for (let i = 1; i < linked_td.length - 1; i++) {
          $(linked_td[i]).css('opacity',1)
        };

        for (let i = 0; i < events.length; i++) {
          events[i].css('background-color', bc[i])
        }

        $('#line').css('display','none')

      } else {
        $(this).css('background-color',bc[0]);
      }
    }
  )


  console.timeEnd('----formatting')

};

function drawLine(el_th){

  var off_ot = events[0].offset().top
  var off_oh = events[0].outerHeight()
  var on_ot = events[1].offset().top

  if(off_ot + off_oh >= on_ot){
    return (off_ot + off_oh < on_ot);
  }

  var sh_ot = $('.shadow').offset().top
  var l = el_th[1].offsetLeft - 6;
  var t = off_ot - sh_ot + off_oh
  var b = on_ot - sh_ot
  var h = b - t

  line(h, l , t, b)

  return true;

}


function line(h, osl, t, b){

  var l = '<svg viewBox="0 0 12 ' + h + '">'
  l += '<line x1="6" y1="0" x2="6" y2="' + h + '" style="stroke-width:3" />'
  l += '<circle cx="6" cy="' + h + '" r="4" />'
  l += '<circle cx="6" cy="0" r="4"/>'
  l += ' <polygon points="6,' + ((h/2)-5) + ' 1,' + ((h/2)+5) + ' 11,' + ((h/2)+5) + '" /></svg>'

  $('#line').html(l)
  $('#line').css({
    'display': 'block',
    'height': h,
    'left': osl,
    'top': t,
    'bottom': b,
  })

}




// value between min max -------------------------------------------------------
function valBetween(v, min, max) {
  return Math.min(max, Math.max(min, v));
};



if (!Array.prototype.last){
  Array.prototype.last = function(){
    return this[this.length - 1];
  };
};
