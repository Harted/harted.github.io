function globalReady(){

  loadScripts(

    // Directory
    'script/index/',

    // Scripts array
    [
      'table', 'flex', 'controls', 'filter', 'stations',
      'session', 'overview',

      '-main'
    ],

    // Function name to call after
    'ready'

  )

}
