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

$('').click(function(){



})
