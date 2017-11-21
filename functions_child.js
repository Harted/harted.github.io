// Box proximity enable ---------------------------------------------------------------------------------------------------------------
function BoxProximityEnable(ref, Bool){
  if (ref == 1) {
    BoxProximity_1_enable = Bool;
  } else if (ref == 2) {
    BoxProximity_2_enable = Bool;
  } else if (ref == 3) {
    BoxProximity_3_enable = Bool;
  } else if (ref == 4) {
    BoxProximity_4_enable = Bool;
  };
};

// Set margins of squars based on position --------------------------------------------------------------------------------------------
function SetMargins(ref, SM_hover_size, SM_margin){
  if (ref == 1) {
    var right = SM_hover_size;
    var bottom = SM_hover_size;
    var right_h = SM_hover_size;
    var bottom_h = SM_hover_size;
  } else if (ref == 2) {
    var right = SM_hover_size
    var bottom = SM_margin
    var right_h = SM_hover_size;
    var bottom_h = 0;
  } else if (ref == 3) {
    var right = SM_margin
    var bottom = SM_margin
    var right_h = 0;
    var bottom_h = 0;
  } else if (ref == 4) {
    var right = SM_margin
    var bottom = SM_hover_size
    var right_h = 0;
    var bottom_h = SM_hover_size;
  }
  return [right, bottom, right_h, bottom_h]
}
