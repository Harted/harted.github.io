// TH filterbox ----------------------------------------------------------------
function filterbox(){
  // ARROW SVG ------------------------------------------------------------
  var arrow_svg = {
    viewbox : "0 0 100 100",
    down: "M94.33,25.33c2.75,0,3.41,1.59,1.46,3.54L53.54,71.13c-1.94,1.94-5.13"
    +",1.94-7.07,0L4.2,28.87c-1.94-1.94-1.29-3.54,1.46-3.54H94.33z",
    up: "M5.67,74.67c-2.75,0-3.41-1.59-1.46-3.54l42.26-42.26c1.94-1.94,5.13"
    +"-1.94,7.07,0L95.8,71.13c1.94,1.94,1.29,3.54-1.46,3.54H5.67z",
  }
  // set attributes for top left logo
  $('#alarmlist th div svg').attr('viewBox',arrow_svg.viewbox)
  $('#alarmlist th div path').attr('d',arrow_svg.down).addClass('down')

  // CLICK EVENT ----------------------------------------------------------

  var active = undefined;

  $('.th-overlay').click(function(event){

    // populate object with needed info ------------------------------
    var ol = {
      table_id : '#' + $(this).closest('.table-scroll').attr('id'),
      fb : $(this).parent().find('.filterbox'),
      path : $(this).find('path')
    }
    // - state of the arrow (up/down)
    // - height of the table overlay = max-height filterbox
    ol.state = $(ol.path).attr('class')
    ol.max = $(ol.table_id).parent().find('.table-overlay').css('height')


    // HIDE ACTIVE if there's one when click on other ----------------
    if (active != undefined) { hide(active, false); active = undefined; };


    // TOGGLE --------------------------------------------------------
    if (ol.state == 'down'){                                            // SHOW

      // Change class to up (= state)
      $(ol.path).attr('d',arrow_svg.up).attr('class','up')

      // Set filerbox max height and overflow hidden
      // so the overflow is hidden when the animation happens
      ol.fb.css({'max-height': ol.max, 'overflow':'hidden'})

      // show scrollbar if needed on transition end
      $(this).parent().off('transitionend').one('transitionend', function(){
        ol.fb.css('overflow','auto');
      })

      // store the active filterbox to hide when click on other
      active = {path: ol.path, fb: ol.fb}

    } else { hide(ol, true); active = undefined;};                            // HIDE


    // function to hide the filterbox---------------------------------
    function hide(o, aplfltr){
      // Change class to down (= state)
      $(o.path).attr('d',arrow_svg.down).attr('class','down')
      // Set filerbox max height to 0 and overflow to hidden
      o.fb.css({'max-height': 0, 'overflow':'hidden'})

      // Aplly filter is filter has changed
      if (JSON.stringify(fltr) != fltr_mem && aplfltr) {
        console.time('apply filter')
        applyFilter(filtered);
        flex();
        tablesize();
        console.timeEnd('apply filter')
      }

    }

  });
};


var filtered, fltr, fltr_mem


function filter(alarms){

  $('.filterbox input').on('click', updatefilter)

  fltr = distinct(alarms);
  var hidden = distinct(alarms)

  // set al disinct values true
  for (var obj in fltr) {
    if (fltr.hasOwnProperty(obj)) {
      for (var o in fltr[obj]) {
        if (fltr[obj].hasOwnProperty(o)) {
          fltr[obj][o] = true
        }
      }
    }
  }

  // Remember to know if filter has changed
  fltr_mem = JSON.stringify(fltr)

  function updatefilter(){

    // Set state of checkbox, text and filtered column when click on this
    var st = $(this).prop('checked')
    var txt = $(this).parent().text();
    var col_id = $(this).parents().eq(3)
    var col = col_id.attr('id').replace('_filter','')

    var col_fltrd = {}

    // Set the state in the filter object
    fltr[col][txt] = st

    // check if a collumn is filtered so items can't be hidden (filtertree)
    for (var flt in fltr) {
      if (flt.search('_') < 0) {
        if (fltr.hasOwnProperty(flt)) {
          col_fltrd[flt] = false
          for (var item in fltr[flt]) {
            if (fltr[flt].hasOwnProperty(item)) {
              if (fltr[flt][item] == false) {
                col_fltrd[flt] = true
              }
            }
          }
        }
      }
    }


    console.log(col_fltrd)

    // Where the filtered alarms have to come
    filtered = []

    // Filter the alarms
    for (let i = 0; i < alarms.length; i++) {

      var all_checked = true

      for (let col in alarms[i]) {
        if (alarms[i].hasOwnProperty(col) && col.search('_') < 0) {
          if(fltr[col][alarms[i][col]] == false){ all_checked = false; break;}
        }
      }


      if (all_checked) {filtered.push(alarms[i])}

    }

    // reset hidden all to true
    for (var obj in hidden) {
      if (obj.search('_') < 0) {
        if (hidden.hasOwnProperty(obj)) {
          for (var o in hidden[obj]) {
            if (hidden[obj].hasOwnProperty(o) && col_fltrd[obj] == false) {     //////// HIER BEN IK BEZIG
              hidden[obj][o] = true
            }
          }
        }
      }
    }

    // Hide connected filteritems
    // - Go trough filtered alarms
    for (let i = 0; i < filtered.length; i++) {
      for (let o in filtered[i]) {
        if (o.search('_') < 0) {
          // - If the filtered alarms has the object set hidden to false
          if (hidden.hasOwnProperty(o)) {
            hidden[o][filtered[i][o]] = false
          }
        }
      }
    }

    //console.log(hidden);

    var obj

    var this_id = $(this).parents().eq(3).attr('id').replace('_filter','')

    for (var h in hidden) {
      if (hidden.hasOwnProperty(h)) {
        if (h.search('_') < 0 && h != this_id ) {
          for (var id in hidden[h]) {
            if (hidden[h].hasOwnProperty(id)) {

              if (id == '') {id = '-blanks-'}
              var usid = id.replace(/[ \/\:\.\-\+\,]/g,'')

              var jqstr = '#' + h + '_filter #' + usid

              obj = $(jqstr)

              if (obj.length == 0) {
                console.log('Undefined ID: ',usid, obj)
              }

              if (hidden[h][id]) {
                obj.parent().parent().css({'display':'none','padding':0})
              } else {
                obj.parent().parent().removeAttr('style')
              }
            }
          }
        }
      }
    }
  }
}

function applyFilter(data){

  var newbody = tables[0].makeBody(data)
  var tb = document.getElementsByClassName('table-body')
  tb[0].innerHTML = newbody.join('')

  // Remember to know if filter has changed
  fltr_mem = JSON.stringify(fltr)

}
