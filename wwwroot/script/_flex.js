// FLEX FORMAT ------------------------------------------------------------
function flex(){ // NOTE: Copy new flex function at work


  var wiH = window.innerHeight

  console.time('----computed height')
  var hh = parseFloat(getComputedStyle(el_head).height)
  var fh = parseFloat(getComputedStyle(el_foot).height)
  console.timeEnd('----computed height')


  console.time('----set height')
  //set container to height between header and footer
  el_fc.style.height = (wiH - hh - fh) + 'px'
  console.timeEnd('----set height')

  console.time('----overflow fix')
  console.time('------calculate width')
  // OVERFLOW FIX ----------------------------------------------------
  // inner width of flex container
  var fc_iw = parseFloat(getComputedStyle(el_fc).width.replace("px", ""))
  // outer width + margin of flex container
  var fc_ow = outerWidth(el_fc)
  // subtract inner from outer to get the total lr margin
  var fc_tot_m = (fc_ow - fc_iw)
  // margin of flex-container and flex-item are the same
  // when only using flex-container input there's no confict setting the
  // max width to the flex-items
  // | fc_m | fi_m |  <flex-item>  | fi_m | fc_m |  (fc_m = fi_m)
  var fi_tar_w = fc_iw - fc_tot_m
  console.timeEnd('------calculate width')



  //NOTE: make funtions
  // set max width
  console.time('------set max width')
  for (let i in el_arr_fi) {
    if (el_arr_fi.hasOwnProperty(i)) {
      el_arr_fi[i].style.maxWidth = fi_tar_w + 'px'
    }
  }

  //IE11 fix (table container has to be set)
  if(userAgent == 'IE11'){
    for (let t in el_arr_tc) {
      if (el_arr_tc.hasOwnProperty(t)) {
        el_arr_tc[t].style.maxWidth = fi_tar_w + 'px'
      }
    }
  }

  console.timeEnd('------set max width')
  console.timeEnd('----overflow fix')

  console.time('----item height')
  // FLEX ITEM HEIGHT ------------------------------------------------

  console.time('------offsetTop')
  var t_ot = el_ft.offsetTop
  var f_ot = el_ff.offsetTop
  console.timeEnd('------offsetTop')


  console.time('------ set')
  //set size to 100% when next to eachother
  if( t_ot > f_ot ){
    // $('.flex-item').css('height', '40%')
    for (let i in el_arr_fi) {
      if (el_arr_fi.hasOwnProperty(i)) {
        if (el_arr_fi[i].style.height != '40%') {
          el_arr_fi[i].style.height = '40%'
        }
      }
    }
    if(el_fh.style.display != 'none'){
      el_fh.style.display = 'none'
    }
  } else {
    for (let i in el_arr_fi) {
      if (el_arr_fi.hasOwnProperty(i)) {
        if (el_arr_fi[i].style.height != '100%') {
          el_arr_fi[i].style.height = '100%'
        }
      }
    }
    if(el_fh.style.display != 'initial'){
      el_fh.style.display = 'initial'
    }
  }
  console.timeEnd('------ set')
  console.timeEnd('----item height')
}



function outerWidth(el) {
  var width = el.offsetWidth;
  var style = getComputedStyle(el);

  width += parseInt(style.marginLeft) + parseInt(style.marginRight);
  return width;
}
