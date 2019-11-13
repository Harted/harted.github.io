// last two args are optional
var el = document.getElementById('ha1')

function asyncArr(array, fn_arr, fn_dom, fnAfter, context) {

    var i = 0
    var len = array.length
    var part = Math.ceil( len / 100 )
    var context = context || window

    console.log('asyncarr: ' , len);

    function itter(){

        var p = part

        while( p-- && i < len) {

            fn_arr.call( context, arr, i )

            i++

        }

        if ( i < len ) {

            fn_dom.call( context, arr, i )

            setTimeout( itter, 1 )

        } else {

            fnAfter.call( context, arr, i )

        }

    }

    itter();

}

// Array ----------------------------------------------------------------

arr = []; for(i = 0; i < 30000000; i++){ arr.push('dinge') }


// Function -------------------------------------------------------------

asyncArr(arr, fn_arr, fn_dom, fnAfter);

function fn_arr( arr, i ) {

    arr[i] = arr[i].replace('dinge','dadde')

}

function fn_dom( arr, i ) {

    var len = arr.length
    var progress = Math.round( i / len * 100 )

    el.textContent = progress + '%'

}

function fnAfter( arr, i ) {

    el.textContent = 100 + '%'

}
