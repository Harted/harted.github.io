// ALFA LOGO -------------------------------------------------------------------
function alfaLogo(){
  // svg in object format
  var alfa_svg = {
    viewbox : "0 0 100 100",
    poly:"9.54,100 43.11,0 57.08,0 90.56,99.75 69.26,83.34 80.31,88.74 "
    + "52.72,7 47.47,7 19.96,88.54 29.53,83.69 47.24,27.04 34.55,87.78 "
  }
  // set attributes for top left logo
  $('#alfa_logo svg').attr('viewBox',alfa_svg.viewbox)
  $('#alfa_logo polygon').attr('points',alfa_svg.poly)
}; alfaLogo();


// TH ARROWS -------------------------------------------------------------------
function arrows(){
  // svg in object format
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

  // click event
  $('.th-overlay').click(function(event){

    // populate object with needed info
    var overlay = {
      table_id : $(this).closest('.table-scroll').attr('id'),
      id : $(this).attr('id'),
    }
    overlay['alarm_obj_id'] = overlay.id.replace('_overlay','') //needed later for filtering
    overlay['path'] = '#' + overlay.table_id + ' #' + overlay.id + ' path'
    overlay['current'] = $(overlay.path).attr('class')

    //change arrow on click -> future show filter div
    if (overlay.current == 'down'){
      $(overlay.path).attr('d',arrow_svg.up)
      .attr('class','up')
      $(this).parent().find('.filterbox').css('height','auto');
    } else {
      $(overlay.path).attr('d',arrow_svg.down)
      .attr('class','down')
      $(this).parent().find('.filterbox').css('height','0px');
    };

    //change all other arrows to down
    var other_ol = $('#' + overlay.table_id + ' .th-overlay')

    for (var i = 0; i < other_ol.length; i++) {
      var id = $(other_ol[i]).attr('id')
      if ( id != overlay.id){

        $('#' + overlay.table_id + ' #' + id + ' path')
        .attr('d',arrow_svg.down).attr('class','down')

        $('#' + overlay.table_id + ' #' + id).parent().find('.filterbox').css('height','0px');

      };

    };


    // NOTE: Glithc when scrolling - try to fix header again!!!!!





    $(this).parent().find('.filterbox').mouseenter(function(){
      $(this).mouseleave(function(){
        $(overlay.path).attr('d',arrow_svg.down)
        .attr('class','down')
        $(this).parent().find('.filterbox').css('height','0px');
        $(this).off('mouseleave')
      })
    })





  });
};
