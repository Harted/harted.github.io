function GetFacebookEvents(){
  var events = [];

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

      for (n = 0; n < response.data.length; n++){
        //console.log(response.data[n])
        var date = String(response.data[n].start_time);
        date = date.replace("T"," ").replace(/-/g, "/");
        date = new Date(date);

        var name = response.data[n].name;
        //console.log(date + " | " + name);



        function DateFormat(date){
          var dayArray = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
          var monthArray = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
          var day = dayArray[date.getDay()];
          var dayofmonth = date.getDate();
          var month = monthArray[date.getMonth()];
          var year = date.getFullYear();
          return [day, dayofmonth, month, year]
        }

        var place_name = response.data[n].place.name;
        //console.log(place_name)
        dateArray = DateFormat(date)

        if (response.data[n].place.location != undefined){
          //console.log(response.data[n].place.location.city)
          var city = response.data[n].place.location.city
        } else {
          //console.log("nergens")
          var city = ""
        }
        var date = String(/*dateArray[0] + ' ' + */dateArray[1] + ' '+ dateArray[2] + ' ' + dateArray[3])
        events.push("<strong><h4>" + date + "</h4> </strong> <br>" + response.data[n].name + "<br><em>" + response.data[n].place.name + "</em><br><h5>" + city + "</h5><br><hr>")
        //events.push({name, date, place_name}) // making a custom array to put in file to edit..


      };
      console.log(events)

      $('#events').html(events).css({
        'opacity': 1,
        'transition': "500ms",
        'margin': header_height,
      });
    });
  };
