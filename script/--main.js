// Body load ready (set on body in index.html) ---------------------------------
function ready(){

  var parray = decodeURIComponent(
    window.location.search.substring(1)
  ).split('&')

  var params = {}

  for (var i = 0; i < parray.length; i++) {
    var p = parray[i].split('=')

    params[p[0]] = p[1].replace(' ','T')

  }

  console.log(params)


  GET(true);


}

// GLOBAL alarms & table variables ---------------------------------------------
var alarms, table

// AJAX SETTINGS ---------------------------------------------------------------
function ajax_s() {
  return {
    url: '/script/ajax.php',
    type: "GET",
    cache: false,
    dataType: "json",
    data: {
      rel: ax.rel,
      stn: ax.stn_str(),
      sev: ax.sev_str(),
      lbt: ax.lbt_str(),
      sta: ax.sta_str(),
      end: ax.end_str(),
    }
  }
}

function ajax_s_home(){
  return {
    url: 'https://www.harted.be/php/alarmdata3.php',
    type: "GET",
    cache: false,
    dataType: "json",
  }
}

var get_busy = false

// INIT Function ---------------------------------------------------------------
function GET(init){

  if(get_busy){ return; }

  get_busy = true

  var timer = new Date()

  updateAX();

  // initial settings
  if (init) {
    ax.rel = true
    ax.stn = []
    ax.sev = ['A','B','C','D']
    ax.lbt = 15
  }

  // AJAX
  $.ajax(ajax_s())

  .fail(function() {                                                  // FAIL

    console.log("Ajax: error")

    history.pushState(1,'','?' + this.url.split('?')[1])

    $('.fade').css({'opacity': 1});
    $('.fade_reverse').css({'opacity': 0});

    style_mu($('#get_data'))
    get_busy = false

  })

  .done(function(data) {                                              // SUCCES

    console.log("Ajax: succes");

    history.pushState(1,'','?' + this.url.split('?')[1])

    setAlarms(data); // fill alarm object
    setTable(); // init table based on alarms
    responsive(); // set table and page sizes
    if (!TIME.rt){ // apply table filer
      tableFilter();
      $('.th-overlay').removeClass('hidden')
    } else {
      $('.th-overlay').addClass('hidden')
    }

    $('.fade').css({'opacity': 1});
    $('.fade_reverse').css({'opacity': 0});

    if (TIME.rt) {
      get_busy = false
      GD.val('GET DATA ('+ (new Date() - timer) + 'ms)')
      .prop('disabled',true)
      GET()
      return;
    }

    style_mu($('#get_data'))
    get_busy = false

  });
}



// AJAX PARAM object -----------------------------------------------------------
var ax = {
  rel: false,
  stn: [], stn_str: function(){ return this.stn.join(':')},
  sev: [], sev_str: function(){ return this.sev.join(':')},
  lbt: 1, lbt_str: function(){ return this.lbt + '/1440'},
  sta: '', sta_str: function(){ return this.sta.replace('T',' ')},
  end: '', end_str: function(){ return this.end.replace('T',' ')},
}


// UPDATE param object
function updateAX(){

  ax.stn = []
  ax.sev = []

  for (var zone in TIA_GC) {
    if (TIA_GC.hasOwnProperty(zone)) {

      for (var stn in TIA_GC[zone]) {
        if (TIA_GC[zone].hasOwnProperty(stn)) {

          if (TIA_GC[zone][stn].sel) {
            ax.stn.push(stn)
          }
        }
      }
    }
  }

  for (var sev in FILTERS.sev) {

    if (FILTERS.sev[sev]) {
      ax.sev.push(sev)
    }
  }

  ax.rel = TIME.rel
  ax.lbt = TIME.lbt();
  ax.sta = TIME.sta();
  ax.end = TIME.end();

}



























// Less finished ---------------------------------------------------------------
less.pageLoadFinished.then(
  function() {

    $('.fade_less').css('opacity', 1);
  }
);
