// last two args are optional

function asyncArr(array, fn_arr, fn_dom, fn_after) {

    var i = 0  
    var len = array.length
    var part = Math.ceil( len / 100 )
    
    function itter(){
    
        var p = part
    
        while( p-- && i < len) {
            
            fn_arr.call( window, arr, i )
            
            i++
            
        }
        
        if ( i < len ) { 
        
            fn_dom.call( window, arr, i )
        
            setTimeout( itter, 1 ) 
            
        } else {
        
            fn_after.call( window, arr, i )
        
        }
    
    }
    
    itter();

}




function processLargeArrayAsync(array, fn, maxTimePerChunk, context) {

    context = context || window;
    
    maxTimePerChunk = maxTimePerChunk || 200;
    
    var index = 0;



    function now() {
    
        return new Date().getTime();
        
    }

    function doChunk() {
    
        var startTime = now();
        
        while (index < array.length && (now() - startTime) <= maxTimePerChunk) {
        
            // callback called with args (value, index, array)
            fn.call(context, array[index], index, array);
            ++index;
            
        }
        
        if (index < array.length) {
        
            // set Timeout for async iteration
            setTimeout(doChunk, 1);
            
        }
    }
        
    doChunk();
        
}


// Array ----------------------------------------------------------------

arr = []; for(i = 0; i < 3000000; i++){ arr.push('dinge') }


// Function -------------------------------------------------------------

asyncArr(arr, fn_arr, fn_dom, fn_after);

function fn_arr( arr, i ) {
    
    arr[i] = arr[i].replace('dinge','dadde')
    
}

function fn_dom( arr, i ) {

    var len = arr.length
    var progress = Math.round( i / len * 100 )
    
    console.log( progress )

}

function fn_after( arr, i ) {

    console.log( arr , 'done')

}