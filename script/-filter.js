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

    } else { hide(ol, true); active = undefined;};                      // HIDE


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
        //restore hover
        tables[0].setHover(true)
        console.timeEnd('apply filter')
      }

    }

  });
};


var filtered, fltr, fltr_mem

// FILTER FUNCTION -------------------------------------------------------------
function filter(alarms){

  $('.filterbox input').on('click', function(){updatefilter(this)})
  $('.filterbox #one').on('mousedown', selectpress)
  .on('mouseup', function(){select(this, false)})
  $('.filterbox #all').on('mousedown', selectpress)
  .on('mouseup', function(){select(this, true)})

  fltr = distinct(alarms);
  var hidden = distinct(alarms)

  fltr = setFltrObj(fltr,true)
  hidden = setFltrObj(hidden,false)

  // Remember to know if filter has changed
  fltr_mem = JSON.stringify(fltr)


  dsblInput(hidden)

  // Disable input function -----------------------------------------------
  // If there's only one true disable input
  function dsblInput(obj){
    for (var l1 in obj) {
      if (obj.hasOwnProperty(l1) && l1.search('_') < 0) {
        var viscnt = 0
        for (var l2 in obj[l1]) {
          if (obj[l1].hasOwnProperty(l2)) {
            if(obj[l1][l2] == false){viscnt++}
          }
        }

        var i_obj = $('#' + l1 + '_filter input')

        if (viscnt == 1) {
          for (var i = 0; i < i_obj.length; i++) {
            s_i_obj = $(i_obj[i])

            if (s_i_obj.prop('checked') == true){
              s_i_obj.prop('disabled',true)
            } else {
              s_i_obj.prop('disabled',false)
            }

          }
        } else {
          i_obj.prop('disabled',false)
        }
      }
    }
  }

  // Update filer function ------------------------------------------------
  function updatefilter(target){

    target = $(target)

    // Set state of checkbox, text and filtered column when click on this
    var st = target.prop('checked')
    var txt = target.parent().text();
    var col_id = target.parents().eq(3)
    var col = col_id.attr('id').replace('_filter','')

    // Set the state in the filter object for current clikced checkbox
    fltr[col][txt] = st

    // var for filtered alarms
    filtered = []

    // Filter the alarms ---------------------------------------------
    for (let i = 0; i < alarms.length; i++) {

      // check if all filterable elements in a row are checked
      var all_checked = true
      for (let col in alarms[i]) {
        if (alarms[i].hasOwnProperty(col) && col.search('_') < 0) {
          // If one is false it's enough to set all_checked true
          if(fltr[col][alarms[i][col]] == false){ all_checked = false; break;}
        }
      }

      // if all are checked push in filtered alarm array
      if (all_checked) {filtered.push(alarms[i])}

    }

    hidden = setFltrObj(hidden,true)

    // Hide connected filteritems
    // - Go trough filtered alarms
    for (let i = 0; i < filtered.length; i++) {
      for (let o in filtered[i]) {
        if (filtered[i].hasOwnProperty(o) && o.search('_') < 0) {

          if (hidden[o].hasOwnProperty(filtered[i][o])) {

            if (hidden[o][filtered[i][o]]) {
              hidden[o][filtered[i][o]] = false
            }

          }
        }
      }
    }


    var obj

    for (var h in hidden) {
      if (hidden.hasOwnProperty(h)) {
        if (h.search('_') < 0 && h) {


          for (var id in hidden[h]) {
            if (hidden[h].hasOwnProperty(id)) {

              if (id == '') {id = '-blanks-'}
              var usid = id.replace(/[ \/\:\.\-\+\,\?\&]/g,'_')

              var jqstr = '#' + h + '_filter #' + usid

              obj = $(jqstr)

              if (obj.length == 0) {
                console.log('Undefined ID: ',usid, obj)
              }

              if (hidden[h][id] && fltr[h][id]) {
                obj.parent().parent().addClass('hidden')
                obj.parent().parent().removeClass('visible')


              } else {
                obj.parent().parent().addClass('visible')
                obj.parent().parent().removeClass('hidden')
              }

            }
          }
        }
      }
    }

    dsblInput(hidden)

    // Give blue color when filter is active
    for (var list in fltr) {
      if (fltr.hasOwnProperty(list)) {
        for (var chkbx in fltr[list]) {
          if (fltr[list].hasOwnProperty(chkbx)) {
            var onefalse = false
            if (fltr[list][chkbx] == false) { onefalse = true; break;}
          }
        }
      }

      lst_obj = $('#' + list + '_filter').parent().find('span')

      if (onefalse) {
        lst_obj.addClass('filtered')
      } else {
        lst_obj.removeClass('filtered')
      }
    }


  }

  var fltrbtn_css = {
    "color":"#F5F5F5",
    "box-shadow": 'inset 0px 0px 3px 1px rgba(0,0,0,0.5)'
  }

  function selectpress(){$(this).css(fltrbtn_css)}

  function select(target, all){

    target = $(target)

    var p = target.parent('div')
    var p_id = p.attr('id')
    var vis = $(p).find('.visible').find('input');

    var inputs = $(vis)

    console.log(inputs)

    // Note: ge moogt enke de visible inputs aanzetten!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

    if (inputs.length > 1){
      $(inputs[0]).prop('checked', true); updatefilter(inputs[0])
      for (var i = 1; i < inputs.length; i++) {
        $(inputs[i]).prop('checked', all); updatefilter(inputs[i])
      }
    }

    // Reset style of button
    target.attr('style','')

  }
}

function applyFilter(data){

  var newbody = tables[0].makeBody(data)
  var tb = document.getElementsByClassName('table-body')
  tb[0].innerHTML = newbody.join('')

  // Remember to know if filter has changed
  fltr_mem = JSON.stringify(fltr)

  // set clearformat when previously active
  if (c.f) {$('tr').addClass('clearformat')}

}

function setFltrObj(obj, bool){
  // scan first level
  for (var lvl_1 in obj) {
    // filter non filter elements
    if (lvl_1.search('_') < 0) {
      // if property is present
      if (obj.hasOwnProperty(lvl_1)) {
        // scan level 2
        for (var lvl_2 in obj[lvl_1]) {
          // if property is present
          if (obj[lvl_1].hasOwnProperty(lvl_2)) {
            // set objects with bool value
            obj[lvl_1][lvl_2] = bool
          }
        }
      }
    }
  }
  return obj
}
