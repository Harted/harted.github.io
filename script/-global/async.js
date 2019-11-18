//Async array function ---------------------------------------------------------
var asyncStack = []
function asyncArr(array, fn_arr, fn_dom, fnAfter, context, time) {

  var i = 0
  var len = array.length

  time = time || 150
  var context = context || window

  function itter(){
    var starttime = Date.now() + time

    while(  Date.now() < starttime && i < len) { // array function
      fn_arr.call( context, array, i ) ; i++
    }

    if ( i < len ) { // between parts function
      fn_dom.call( context, array, i )
      asyncStack.push(setTimeout( itter, 1 )) //able to cancel async opperation
    } else { // after itteration
      fnAfter.call( context, array, i )
    }

  }

  itter(); // start itteration

}
