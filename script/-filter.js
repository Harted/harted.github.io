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


    // HIDE ACTIVE if there's one ------------------------------------
    if (active != undefined) { hide(active); active = undefined; };


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

    } else { hide(ol); active = undefined;};                            // HIDE


    // function to hide the filterbox---------------------------------
    function hide(o){
      // Change class to down (= state)
      $(o.path).attr('d',arrow_svg.down).attr('class','down')
      // Set filerbox max height to 0 and overflow to hidden
      o.fb.css({'max-height': 0, 'overflow':'hidden'})

      console.log('active: ', filteractive);

      if ((filteractive || filteractive == false && fa_mem == true )&& active == undefined) {
        console.log('execute');
        console.time('apply filter')
        applyFilter(filtered);
        flex();
        tablesize();
        fa_mem = filteractive
        console.timeEnd('apply filter')

        // NEXT :::: change filterbox content when applying filters

      }

    }

  });
};




var filtered
var filteractive
var fa_mem = false




function filter(alarms){

  $('.filterbox input').on('click', updatefilter)

  var fltr = distinct(alarms)

  // set al disinct valuus true
  for (var obj in fltr) {
    if (fltr.hasOwnProperty(obj)) {
      for (var o in fltr[obj]) {
        if (fltr[obj].hasOwnProperty(o)) {
          fltr[obj][o] = true
        }
      }
    }
  }

  function updatefilter(){


    var st = $(this).prop('checked')
    var txt = $(this).parent().text();
    var col = $(this).parents().eq(3).attr('id').replace('_filter','')



    fltr[col][txt] = st

    filtered = []



    for (var i = 0; i < alarms.length; i++) {


      var item = alarms[i][col]
      var checked = fltr[col][item]

      if (checked) {filtered.push(alarms[i])}

    }

    filteractive = false

    for (var obj in fltr) {
      if (fltr.hasOwnProperty(obj)) {
        for (var o in fltr[obj]) {
          if (fltr[obj].hasOwnProperty(o)) {
            if(fltr[obj][o] == false){
              filteractive = true
            }
          }
        }
      }
    }
    console.log('filter active: ',filteractive)

  }
}

function applyFilter(data){

  var newbody = tables[0].makeBody(data)
  var tb = document.getElementsByClassName('table-body')
  tb[0].innerHTML = newbody.join('')

}
