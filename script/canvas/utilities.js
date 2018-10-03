// Random number from a to b ------------------------------------------------------------------------------------------------------------------------------------
function ranum (a,b) {
  let x = Math.floor(((Math.random() * (b - a)) + a + 0.5))
  return x
}

// distance between two twodimensional points -------------------------------------------------------------------------------------------------------------------
function twoPointDist(x1,x2,y1,y2) {
  return Math.pow((Math.pow(x2-x1,2) + Math.pow(y2-y1,2)),0.5)
}

// chance
function chance(percentage){
  var v = Math.random()*100
  if (v < percentage){
    return true
  } else {
    return false
  }
}

//phytagoras
function phyt_a(b,c){
  return Math.pow(Math.pow(b,2)+Math.pow(c,2),1/2)
};




function Test(){
  console.log('ja!')
}

var lala = debounce(function(){Test()},250, false)
