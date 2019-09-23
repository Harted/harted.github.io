function filter(){

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

    // console.log(st,txt,col);
    // console.log(fltr);
    // console.log(alarms);

    var filtered = []

    for (var i = 0; i < alarms.length; i++) {


      var item = alarms[i][col]
      var checked = fltr[col][item]

      console.log(item, checked)

      if (checked) {
        filtered.push(alarms[i])
      }

    }

    var newbody = tables[0].makeBody(filtered)

    console.log (newbody)

    $('.table-body').html(newbody)

    flex();

    tablesize();

  }


}
