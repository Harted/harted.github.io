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

    //active
    if (data[i]._active) {
      table += 'active '
    }

    table+= '">'

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

  console.timeEnd('----formatting')

};
