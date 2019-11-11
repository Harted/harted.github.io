function createOverview(sortMode){

  sortMode = sortMode || 'count'
  distAlarms.sort(sortMode)

  var html = ''
  var dist = distAlarms.ordered
  var sevOrder = ['A','B','C','D','E']

  // http://jsbin.com/quhujowota/1/edit?html,js,output



  for (var zone in dist) {

    html += '<div class="zonename"><span>' + zone + '</span></div>'

    for (var stn in dist[zone]) {

      html += '<div class="stationname A "><span>' + stn
      html += ' - ' + TIA_GC[zone][stn].name
      html += '</span></div>'

      html += sevCircle(dist[zone][stn], 'count', sevOrder)

      for (var i = 0; i < sevOrder.length; i++) {

        if (dist[zone][stn].hasOwnProperty(sevOrder[i])){

          var sev = dist[zone][stn][sevOrder[i]]

          html += '<div class="sev-container">'

          html += '<div><div class="sev-letter ' + sevOrder[i] + '">'
          html += '<span>' + sevOrder[i] + '</span></div>'
          html += '</div>'

          html += '<div><table>'

          html += '<thead><tr>'

          html += '<td>Modezone</td>'
          html += '<td>Object</td>'
          html += '<td>Description</td>'
          html += '<td>Comment</td>'

          html += '<td class="clickable ov_count">#</td>'
          html += '<td class="clickable ov_duration">Total</td>'
          html += '<td class="clickable ov_PRODUCTION">Prod</td>'
          html += '<td class="clickable ov_STANDSTILL">Sts</td>'

          html += '</tr></thead>'



          html += '<tbody>'

          for (var j = 0; j < sev.alarms.length; j++) {

            var sv = sev.alarms[j]

            html += '<tr>'

            html += '<td>' + sv.obj[0].zone + '</td>'
            html += '<td>' + sv.obj[0].object + '</td>'
            html += '<td>' + sv.obj[0].description + '</td>'
            html += '<td>' + sv.obj[0].comment + '</td>'

            var times = ['duration', 'PRODUCTION', 'STANDSTILL']

            for (var k = 0; k < times.length; k++) {
              if (sv[times[k]] > 0){
                this[times[k]] = dhms(sv[times[k]])
              } else { this[times[k]] = '-' }
            }

            html += '<td>' + sv.count + '</td>'
            html += '<td>' + this.duration + '</td>'
            html += '<td>' + this.PRODUCTION + '</td>'
            html += '<td>' + this.STANDSTILL + '</td>'

            html += '</tr>'
          }

          html += '</tbody></table>'

          html += '</div></div>'

        }

      }



    }



  }



  $('#overview').html(html)

  //Clickthings
  $('.ov_count').click(ovSortClick)
  $('.ov_duration').click(ovSortClick)
  $('.ov_PRODUCTION').click(ovSortClick)
  $('.ov_STANDSTILL').click(ovSortClick)

  function ovSortClick(){
    var mode = $(this).attr('class').split('_')[1]
    createOverview(mode)
  }



}




function sevCircle(obj, item, order){

  var html = ''

  html += '<div class="sev-circle">'
  html += '<svg viewBox="0 0 100 100" height=100px>'

  var sA = 0
  var eA = 0
  var r = 30

  for (var i = 0; i < order.length; i++) {

    if (obj.hasOwnProperty(order[i])){

      eA = sA + ((obj[order[i]].perc[item] / 100) * 359.99)

      html += '<path d="' + describeArc(50, 50, r, sA, eA)+ '" '
      html += 'class="' + order[i] + '">'
      html += '<title>' + order[i]+ ': ' + obj[order[i]].count + '</title>'
      html += '</path>'

      sA = eA

    }

  }

  var total = obj._total[item]

  // Show K when bigger than 1000
  if (total >= 1000 && total < 10000) { total = roundP(total/1000,1) + 'K'}
  else if (total >= 10000) { total = roundP(total/1000,0) + 'K'}

  html += '<text x=50 y=50>' + total + '</text>'

  html += '</svg></div>'

  return html

}




// Circle function
function polarToCartesian(centerX, centerY, radius, angleInDegrees) {
  var angleInRadians = (angleInDegrees-90) * Math.PI / 180.0;

  return {
    x: centerX + (radius * Math.cos(angleInRadians)),
    y: centerY + (radius * Math.sin(angleInRadians))
  };
}

function describeArc(x, y, radius, startAngle, endAngle){

    var start = polarToCartesian(x, y, radius, endAngle);
    var end = polarToCartesian(x, y, radius, startAngle);

    var largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";

    var d = [
        "M", start.x, start.y,
        "A", radius, radius, 0, largeArcFlag, 0, end.x, end.y
    ].join(" ");

    return d;

}
