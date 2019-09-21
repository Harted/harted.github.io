// TABLE FORMAT -----------------------------------------------------------
function tableformat(){

  //adjust headsize on tables
  for (var table in tables) {
    if (tables.hasOwnProperty(table)) {
      tables[table].headsize()
    }
  }
  //set table container size to part of 100% according to the amount of tables
  $('.table-container').css('height', 100/tables.length + '%')

}

$('#clearformat').click(function(){
  var trclass_obj = $('tbody tr');
  var trclass;

  for (var i = 0; i < trclass_obj.length; i++) {

    trclass = $(trclass_obj[i]).attr('class')

    if((/clearformat/).test(trclass)){
      $(trclass_obj[i]).attr('class',trclass.replace('clearformat',''))
    } else {
      $(trclass_obj[i]).attr('class',trclass + ' clearformat')
    }

  }


})
