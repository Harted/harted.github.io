// Index specific onresize -----------------------------------------------------
window.onresize = function(event){
  if(tableready){responsive()};
};


// Responsive on resize --------------------------------------------------------
function responsive(){
  flex();
  table.headsize()
};
