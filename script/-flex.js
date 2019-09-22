// FLEX FORMAT ------------------------------------------------------------
function flex(){ // NOTE: Copy new flex function at work

  // get header and footer height
  var hh = parseFloat(getComputedStyle(el_head).height)
  var fh = parseFloat(getComputedStyle(el_foot).height)

  //set container to height between header and footer
  el_fc.style.height = (win.iH - hh - fh) + 'px'


  // OVERFLOW FIX ----------------------------------------------------
  // Set the widht off the flex items so the overflow works correctly
  // with the margins and paddings included

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

  // set max width
  for (let i in el_arr_fi) {
    if (el_arr_fi.hasOwnProperty(i)) {
      el_arr_fi[i].style.maxWidth = fi_tar_w + 'px'
    }
  }


  //IE11 fix (table container has to be set)--------------------------
  if(userAgent == 'IE11'){ el_tc.style.maxWidth = fi_tar_w + 'px'}


  // FLEX ITEM HEIGHT ------------------------------------------------
  var t_ot = el_ft.offsetTop
  var f_ot = el_ff.offsetTop

  if( t_ot > f_ot ){
    //ABOVE EACHOTHER
    // Height of control container shoul be max 40%
    for (let i in el_arr_fi) {
      if (el_arr_fi.hasOwnProperty(i)) {
        if (el_arr_fi[i].style.height != '40%') {
          el_arr_fi[i].style.height = '40%'
        }
      }
    }
    // don't show control header when above eachother
    if(el_ch.style.display != 'none'){
      el_ch.style.display = 'none'
    }
  } else {
    // NEXT TO EACHOTHER
    // Control container can be 100% height
    for (let i in el_arr_fi) {
      if (el_arr_fi.hasOwnProperty(i)) {
        if (el_arr_fi[i].style.height != '100%') {
          el_arr_fi[i].style.height = '100%'
        }
      }
    }
    // show control header when next to eachother
    if(el_ch.style.display != 'initial'){
      el_ch.style.display = 'initial'
    }
  }
}




// OUTER WIDTH with pure javascript function -----------------------------------
function outerWidth(el) {
  var width = el.offsetWidth;
  var style = getComputedStyle(el);
  width += parseInt(style.marginLeft) + parseInt(style.marginRight);
  return width;
}
