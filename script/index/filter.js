// TH filterbox ----------------------------------------------------------------
function tableFilter(){
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

  // Var to store the active/visible filterbox
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

      // Apply filter when al the filterboxes are hidden
      if(aplfltr){applyFilter()};
    }
  });

  initFilter();

};




// GLOBAL VARS -----------------------------------------------------------------
var filtered, fltr, fltr_mem, id_arr, hidden, collapsed

// INIT FILTER  ----------------------------------------------------------------
function initFilter(){

  // clicking on filter chkbox updates filter
  $('.filterbox input').on('click', function(){
    updatefilter(this)
    filter()
  })

  // click on one button selects one
  $('.filterbox #one').on('mousedown', selectpress)
  .on('mouseup', select)

  // clcik on all button selects all
  $('.filterbox #all').on('mousedown', selectpress)
  .on('mouseup', select)

  // make filter and hidden object
  fltr = distinct(alarms, true);
  hidden = distinct(alarms, true)

  // set true/false on filter and hidden object for filter items
  // no items with underscore included (see: setFltrObj() function)
  fltr = setFltrObj(fltr,true)
  hidden = setFltrObj(hidden,false)

  // Remember fltr state to know if filter has changed (see: applyFilter())
  fltr_mem = JSON.stringify(fltr)

  // Disable input when only one visible chkbox is checked (on load)
  dsblInput()
}



// UPDATE FILTER ---------------------------------------------------------------
function updatefilter(target){

  // update filter is triggerd by chkbox and all/one buttons
  target = $(target)

  // Set state of checkbox, text and filtered on give target
  var st = target.prop('checked')
  var txt = target.parent().text();
  var col_id = target.parents().eq(3)
  var col = col_id.attr('id').replace('_filter','')

  // Set the state in the filter object for current clicked checkbox
  fltr[col][txt] = st

};


// FILTER ----------------------------------------------------------------------
function filter(){

  // reset var for filtered alarms
  filtered = []
  collapsed = []

  // FILTER THE ALARMS ----------------------------------------------------
  for (let i = 0; i < alarms.length; i++) {

    // check if all filterable elements in a row are checked
    var all_checked = true
    for (let col in alarms[i]) {
      if (alarms[i].hasOwnProperty(col)){
        // only execute on filter
        if (col.search('_') < 0) {
          // If one is false it's enough to set all_checked true
          if(fltr[col][alarms[i][col]] == false){ all_checked = false; break;}
        }
      }
    }

    // if all are checked push in filtered alarm array
    if (all_checked) {filtered.push(alarms[i])} else {collapsed.push(alarms[i])}

  }

  // fill id array to later apply "visibility: collapse" on itmes not in arr
  id_arr = []
  for (var i = 0; i < filtered.length; i++) {
    id_arr.push('linkID_' + filtered[i]._linkID + '_' + filtered[i].statetxt)
  }


  // HIDE FILTER ITEMS ----------------------------------------------------
  // reset hidden object
  hidden = setFltrObj(hidden, true)


  // Unhide CHECKED filter items who are present in the filtered list
  for (let i = 0; i < filtered.length; i++) {

    for (let o in filtered[i]) {
      if (filtered[i].hasOwnProperty(o)){
        // only check for filtered items in filtered list (not underscored)
        if ( o.search('_') < 0) {

          //
          if (hidden[o].hasOwnProperty(filtered[i][o]) && fltr[o][filtered[i][o]]) {
            hidden[o][filtered[i][o]] = false
          }


        }
      }
    }
  }


  // Unhide UNCHECKED filter items
  for (let o in fltr) {
    if (fltr.hasOwnProperty(o)) {

      for (let item in fltr[o]) {
        if (fltr[o].hasOwnProperty(item)) {

          if (!fltr[o][item]) { hidden[o][item] = false }

        }
      }

    }
  }

  // hide UNCHECKED filter items who don't bring shit back
  for (let o in hidden) {
    if (hidden.hasOwnProperty(o)) {

      for (let item in hidden[o]) {
        if (hidden[o].hasOwnProperty(item)) {

          if (!hidden[o][item] && !fltr[o][item]){

            // suppose item was true, would it bring something back
            fltr[o][item] = true

            var len_check = []

            for (let i = 0; i < collapsed.length; i++) {

              // check if all filterable elements in a row are checked
              var all_checked = true
              for (let col in collapsed[i]) {
                if (collapsed[i].hasOwnProperty(col)){
                  // only execute on filter
                  if (col.search('_') < 0) {
                    // If one is false it's enough to set all_checked false
                    if(fltr[col][collapsed[i][col]] == false){
                      all_checked = false;
                      break;
                    }
                  }
                }
              }

              // if all are checked push in len_check array
              if (all_checked) {len_check.push(alarms[i])}

            }

            // if it brings nothing back hide the unchecked item
            if (len_check == 0) {hidden[o][item] = true}

            // set back to false
            fltr[o][item] = false

          }

        }
      }

    }
  }


  // actual hidding :)
  for (var h in hidden) {
    if (hidden.hasOwnProperty(h)) {

      // only filter elements
      if (h.search('_') < 0) {

        for (var id in hidden[h]) {
          if (hidden[h].hasOwnProperty(id)) {

            // if blank give it '-blanks-' string
            if (id == '') {id = '-blanks-'}

            // convert id to compatible (see: table() function: filterbox)
            var usid = id.replace(/[ \/\\\:\.\-\+\,\?\&\=\(\)]/g,'_')

            // set the jquery object
            var obj = $('#' + h + '_filter #' + usid)

            // Switch between hidden and visible classes
            if (hidden[h][id]) {
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


  // Disable input when only one visible chkbox is checked (on update)
  dsblInput()


  // FILTER STATE VISUALISATION -------------------------------------------
  // Give blue color when filter is active
  for (var list in fltr) {

    // check is one chkbox is false
    if (fltr.hasOwnProperty(list)) {
      for (var chkbx in fltr[list]) {
        if (fltr[list].hasOwnProperty(chkbx)) {
          var onefalse = false
          if (fltr[list][chkbx] == false) { onefalse = true; break;}
        }
      }
    }

    // find the span of the th
    lst_obj = $('#' + list + '_filter').parent().find('span')

    // if one is false apply style
    if (onefalse) {
      lst_obj.addClass('filtered')
    } else {
      lst_obj.removeClass('filtered')
    }
  }

}



// APPLY FILTER ----------------------------------------------------------------
function applyFilter(){

  // Apply filter is filter has changed
  if (JSON.stringify(fltr) != fltr_mem) {

    var tbody_tr = $('tbody tr')

    // Hide if not included in id-arr (visibility:collapse)
    for (var i = 0; i < tbody_tr.length; i++) {
      var id = $(tbody_tr[i]).attr('id')
      var incl = id_arr.includes(id)

      if (!incl) {
        $('#' + id).addClass('hidden')
      } else {
        $('#' + id).removeClass('hidden')
      }

    }

    // Remember to know if filter has changed
    fltr_mem = JSON.stringify(fltr)

    // set clearformat when previously active
    if (tog.format) {$('tr').addClass('clearformat')}


  }

  table.dl(); //Redraw the line

}



// DISABLE INPUT FUNCTION ------------------------------------------------------
// If there's only one true disable input
function dsblInput(){
  for (var l1 in hidden) {
    if (hidden.hasOwnProperty(l1)){

      // only on filter items
      if (l1.search('_') < 0) {

        // Count visible checkboxes
        var viscnt = 0
        for (var l2 in hidden[l1]) {
          if (hidden[l1].hasOwnProperty(l2)) {
            if(hidden[l1][l2] == false && fltr[l1][l2] == true){viscnt++}
          }
        }

        // Set checkbox/input object
        var i_obj = $('#' + l1 + '_filter input')

        // If only one visible and true
        if (viscnt == 1) {
          for (var i = 0; i < i_obj.length; i++) {

            // set single input onject
            s = $(i_obj[i])

            // if it's checked then disable it
            if (s.prop('checked') == true){ s.prop('disabled',true) }

          }

          // if more then one visible and true enable all
        } else { i_obj.prop('disabled',false) }
      }
    }
  }
}



// ONE & ALL BUTTONS -----------------------------------------------------------
// state of button on mousedown
function selectpress(){
  $(this).css({
    "color":"#F5F5F5",
    "box-shadow": 'inset 0px 0px 3px 1px rgba(0,0,0,0.5)'
  })
}

// function for One & All buttons
function select(){

  // target given by click on One or All button
  target = $(this)


  // if id is 'all' select all, otherwise one is true, rest is false
  if (target.attr('id') == 'all') {all = true} else {all = false}


  // find visible inputs
  var p = target.parent('div')
  var vis = $(p).find('.visible').find('input');
  var inputs = $(vis)


  // only execute when there is more than one checkbox visible
  if (inputs.length > 1){
    $(inputs[0]).prop('checked', true); updatefilter(inputs[0])
    for (var i = 1; i < inputs.length; i++) {
      $(inputs[i]).prop('checked', all); updatefilter(inputs[i])
    }
  }

  filter();

  // Reset style of button when complete
  target.attr('style','')

}



// FILTER OBJECT SET (true/false) function -------------------------------------
function setFltrObj(obj, bool){
  // scan first level
  for (var lvl_1 in obj) {
    // only filter elements
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
