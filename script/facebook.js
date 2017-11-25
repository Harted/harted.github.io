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
      //console.log(response)
      for (n = 0; n < response.data.length; n++){
        date = new Date(response.data[n].start_time)
        console.log(date + " | " + response.data[n].name);
        events.push("<strong>" + date + " </strong> <br>" + response.data[n].name + "<br><hr>")
      };
      $('#events').html(events).css({
        'opacity': 1,
        'transition': "1000ms",
        'margin-bottom': '50px'
      })
    }
  );
}
