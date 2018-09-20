// Random number from a to b ------------------------------------------------------------------------------------------------------------------------------------
function ranum (a,b) {
  let x = Math.floor(((Math.random() * (b - a)) + a + 0.5))
  return x
}

// distance between two twodimensional points -------------------------------------------------------------------------------------------------------------------
function twoPointDist(x1,x2,y1,y2) {
  return Math.pow((Math.pow(x2-x1,2) + Math.pow(y2-y1,2)),0.5)
}
