// DISTINCT CLASS --------------------------------------------------------------
class Distinct {

  // Object set with method
  constructor(arr, mode, fnAfter, context) {
    this.set(arr, mode, fnAfter, context)
  }

  // Set method
  set(arr, mode, fnAfter, context){

    // For all alarms
    for (var i = 0; i < arr.length; i++) {

      // Filter only use not underscored properties ------------------
      if (mode == 'filter') {
        for (var col in arr[i]) {
          if (col.search('_') < 0){ // Only filter objects

            // set name of subobject to name of alarmobject (column) once
            if (this[col] == undefined) { this[col] = {} }

            // Set when not set yet
            if (!this[col].hasOwnProperty(arr[i][col])) {
              // set var name in subobject
              this[col][arr[i][col]] = 1
            }
          }
        }

        // Array with chosen object ------------------------------------
      } else if (typeof(mode) == 'object'){
        for (var j = 0; j < mode.length; j++) {

          // set name of subobject to name of alarmobject (column) once
          if (this[mode[j]] == undefined) { this[mode[j]] = {} }

          // Set when not set yet
          if (!this[mode[j]].hasOwnProperty(arr[i][mode[j]])) {
            // set var name in subobject
            this[mode[j]][arr[i][mode[j]]] = 1
          }
        }
      }
    }
  }
}
