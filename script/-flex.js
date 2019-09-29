// FLEX FORMAT ------------------------------------------------------------
function flex(){ // NOTE: Copy new flex function at work

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
    el_ft.classList.add('above')
    el_ff.classList.add('above')

    el_ch.addEventListener('click', exp_c)

  } else {
    // NEXT TO EACHOTHER
    el_ft.classList.remove('above', 'exp_tr', 'expand')
    el_ff.classList.remove('above', 'exp_tr', 'expand')

    el_ch.removeEventListener('click', exp_c)

  }
}

function exp_c(){

  if(el_ft.classList.value.search('expand') > 0){
    el_ft.classList.remove('expand')
    el_ff.classList.remove('expand')
    el_ch.addEventListener('transitionend', exp_c_tr)
  } else {
    el_ft.classList.add('expand','exp_tr')
    el_ff.classList.add('expand','exp_tr')
  };

  function exp_c_tr(){
    el_ft.classList.remove('exp_tr')
    el_ff.classList.remove('exp_tr')
    el_ch.removeEventListener('transitionend', exp_c_tr)
  }

}


// OUTER WIDTH with pure javascript function -----------------------------------
function outerWidth(el) {
  var width = el.offsetWidth;
  var style = getComputedStyle(el);
  width += parseInt(style.marginLeft) + parseInt(style.marginRight);
  return width;
}
