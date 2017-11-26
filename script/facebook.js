function GetFacebookEvents(){
  var events = ["<hr>"];

  FB.init({
    appId: '131918997473097',
    version: 'v2.11' // or v2.1, v2.2, v2.3, ...
  });

  FB.api(
    '/617065351770738/events',
    'GET',
    {
      access_token :'131918997473097|22PNWUBJlserYK4cJuiOpwBLCaw',
      limit: '9999'
    },

    function(response) {
      console.log(response)
      for (n = 0; n < response.data.length; n++){
        date = new Date(response.data[n].start_time)
        console.log(date + " | " + response.data[n].name);
        var dayArray = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
        var monthArray = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
        var day = dayArray[date.getDay()]
        var dayofmonth = date.getDate()
        var month = monthArray[date.getMonth()]
        var year = date.getFullYear()
        if (response.data[n].place.location != undefined){
          console.log(response.data[n].place.location.city)
          var city = response.data[n].place.location.city
        } else {
          console.log("nergens")
          var city = ""
        }
        var deit = day + ' ' + dayofmonth + ' '+ month + ' ' + year
        events.push("<strong><h4>" + deit + "</h4> </strong> <br>" + response.data[n].name + "<br><em>" + response.data[n].place.name + "</em><br><h5>" + city + "</h5><br><hr>")
      };

      $('#events').html(events).css({
        'opacity': 1,
        'transition': "1000ms",
        'margin-bottom': '50px'
      });
    });
  };
