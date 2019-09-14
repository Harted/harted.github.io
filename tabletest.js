var alarms = [];


$.ajax({
  url: 'https://main.xfiddle.com/2efa0c76/arr.php',
  type: "GET", // or "GET"
  cache: false,
  dataType: "json",
  success: function(data) {
    for (let i = 0; i < data.length; i++) {
      alarms.push(new alarm(data[i]).alarm)
    }
    console.log(alarms)


    var table = '<table>'

    table += '<thead>'
    table += '<tr>'
    table += '<th>DateTime</th>'
    table += '<th>Station</th>'
    table += '<th>Station</th>'
    table += '<th>Station</th>'
    table += '<th>Sev.</th>'
    table += '<th>State</th>'
    table += '</tr>'
    table += '</thead>'

    table += '<body>'
    for (let i = 0; i < alarms.length; i++){
      table += '<tr>'
      for (var obj in alarms[i]) {
        if (alarms[i].hasOwnProperty(obj)) {
          table += '<td>' +alarms[i][obj]+ '</td>';
        }
      }
      table += '</tr>'
    }
    table += '</body>'

    table += '</table>'

    $('#table').html(table)

    for (let i = 0; i < $('th').length; i++) {
      // console.log ($('th')[i].offsetWidth)
      $('body').find($('td')[i]).css(
        'min-width', $('th')[i].offsetWidth
      )
    }

    var hh = $('th')[0].scrollHeight
    $('thead').css('margin-top',-hh);
    $('table').css('margin-top',hh);


    headsize()
    $(window).on('resize',function(){

      headsize()
    })

    $(window).scroll(function(){
      $('thead').css('margin-left',-$('html').scrollLeft())
    })

  }
});

function headsize(){

  for (let i = 0; i < $('th').length; i++) {
      $('body').find($('th')[i]).width($('body').find($('td')[i]).width())
      .css('min-width', $('body').find($('td')[i]).width())
  }

}


function alarm(data) {

  const alarmparts = ['datetime', 'station', 'object', 'comment', 'severity', 'state']

  this.alarm = {}
  for (let i = 0; i < data.length; i++) {
    this.alarm[alarmparts[i]] = data[i]
  }

}
