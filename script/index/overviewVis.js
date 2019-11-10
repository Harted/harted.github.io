function createOverview(sortMode){

  sortMode = sortMode || 'count'
  distAlarms.sort(sortMode)

  var html = ''
  var dist = distAlarms.ordered
  var sevOrder = ['A','B','C','D','E']

  for (var zone in dist) {

    html += '<div class="zonename"><span>' + zone + '</span></div>'

    for (var stn in dist[zone]) {

      html += '<div class="stationname A "><span>' + stn + '</span></div>'

      for (var i = 0; i < sevOrder.length; i++) {

        if (dist[zone][stn].hasOwnProperty(sevOrder[i])){

          var sev = dist[zone][stn][sevOrder[i]]

          html += '<div><span>--- ' + sevOrder[i] + '</span>'
          html += '<span>    Count: ' + sev.count + '</span>'
          html += '<span>    Duration: ' + sev.duration + '</span>'
          html += '<span>    Production: ' + sev.PRODUCTION + '</span>'
          html += '<span>    Standstill: ' + sev.STANDSTILL + '</span>'
          html += '</div>'

          html += '<div><table>'

          html += '<thead>'

          html += '<td>Modezone</td>'
          html += '<td>Object</td>'
          html += '<td>Description</td>'
          html += '<td>Comment</td>'

          html += '<td>Count</td>'
          html += '<td>Total</td>'
          html += '<td>Production</td>'
          html += '<td>Standstill</td>'

          html += '</thead>'



          html += '<tbody>'

          for (var j = 0; j < sev.alarms.length; j++) {
            html += '<tr>'

            html += '<td>' + sev.alarms[j].obj[0].zone + '</td>'
            html += '<td>' + sev.alarms[j].obj[0].object + '</td>'
            html += '<td>' + sev.alarms[j].obj[0].description + '</td>'
            html += '<td>' + sev.alarms[j].obj[0].comment + '</td>'



            html += '<td>' + sev.alarms[j].count + '</td>'
            html += '<td>' + sev.alarms[j].duration + '</td>'
            html += '<td>' + sev.alarms[j].PRODUCTION + '</td>'
            html += '<td>' + sev.alarms[j].STANDSTILL + '</td>'

            html += '</tr>'
          }

          html += '</tbody></table>'

          html += '</div>'

        }

      }



    }



  }



  $('#overview').html(html)




}
