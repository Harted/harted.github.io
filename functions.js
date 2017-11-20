//Make squares
function MakeSquare(MS_id, MS_ref, MS_size, MS_href) {
  var MS_margin;
  MS_margin = hover_size - MS_size;
  var MS_top, MS_right, MS_bottom, MS_left, MS_top_h, MS_right_h, MS_bottom_h, MS_left_h
  if (MS_ref == 1) {
    //MS_top = MS_margin;
    MS_right = hover_size;
    MS_bottom = hover_size;
    //MS_left = MS_margin;
    //MS_top_h = 0;
    MS_right_h = hover_size;
    MS_bottom_h = hover_size;
    MS_left_h = 0
  } else if (MS_ref == 2) {
    //MS_top = hover_size
    MS_right = hover_size
    MS_bottom = MS_margin
    //MS_left = MS_margin
    //MS_top_h = hover_size;
    MS_right_h = hover_size;
    MS_bottom_h = 0;
    //MS_left_h = 0;
  } else if (MS_ref == 3) {
    //MS_top = hover_size
    MS_right = MS_margin
    MS_bottom = MS_margin
    //MS_left = hover_size
    //MS_top_h = hover_size;
    MS_right_h = 0;
    MS_bottom_h = 0;
    //MS_left_h = hover_size;
  } else if (MS_ref == 4) {
    //MS_top = MS_margin
    MS_right = MS_margin
    MS_bottom = hover_size
    //MS_left = hover_size
    //MS_top_h = 0;
    MS_right_h = 0;
    MS_bottom_h = hover_size;
    //MS_left_h = hover_size;
  }
  $(MS_id).css({
    'position': 'absolute',
    'width': MS_size,
    'height': MS_size,
    //'top': MS_top,
    //'left': MS_left,
    'right': MS_right,
    'bottom': MS_bottom,

    'background-color': eval("color_" + MS_ref),
    "transition" : (anim_speed * (hover_size - MS_size) * (600/ref_box_size)) + "ms"
  })
  .unbind("mouseenter")

  $(MS_id).mouseenter(function() {
    if (MS_ref == 1) {
      BoxCenter_1_enable = false;
    } else if (MS_ref == 2) {
      BoxCenter_2_enable = false;
    } else if (MS_ref == 3) {
      BoxCenter_3_enable = false;
    } else if (MS_ref == 4) {
      BoxCenter_4_enable = false;
    };

    $(MS_id)
    .css({
      "transition" : (anim_speed * (hover_size - MS_size) * (600/ref_box_size)) + "ms",
      //(acceleration stays the same with different distance between hover and box size)
      //(time stays the same A/B with different refbox sizes)
      'width': hover_size,
      'height': hover_size,
      //'left': MS_left_h,
      //'top': MS_top_h,
      'right': MS_right_h,
      'bottom': MS_bottom_h,
    })
    .unbind('transitionend')
    .one("transitionend", function(){
      $(MS_id).css({ "cursor": "pointer" })
      .click(function(){window.location = MS_href})
    })
    $("#logo").css({
      "fill" : eval("color_" + MS_ref),
      "transition" : (anim_speed * (hover_size - MS_size) * (600/ref_box_size)) + "ms"
    })
  })
  .unbind("mouseleave")
  .mouseleave(function() {
    if (MS_ref == 1) {
      BoxCenter_1_enable = true;
    } else if (MS_ref == 2) {
      BoxCenter_2_enable = true;
    } else if (MS_ref == 3) {
      BoxCenter_3_enable = true;
    } else if (MS_ref == 4) {
      BoxCenter_4_enable = true;
    };
    $(MS_id)
    .off("click")
    .css({
      'width': MS_size,
      'height': MS_size,
      //'left': MS_left,
      //'top': MS_top,
      'right': MS_right,
      'bottom': MS_bottom,

      "transition" : (anim_speed * (hover_size - MS_size) * (600/ref_box_size)) + "ms",
      "cursor" : "initial",
    })
    .unbind('transitionend')
    $("#logo").css({
      "fill" : color_back,
      "transition" : (anim_speed * (hover_size - MS_size) * (600/ref_box_size)) + "ms"
    })
  })
};

function TransitionOff(){
  for (n = 0; n < arguments.length; n++) {
    $(arguments[n]).css("transition", "none");
  }
};


function AffectSquare(MS_id, MS_ref, MS_size) {
  var MS_margin;
  MS_margin = hover_size - MS_size;
  var MS_top, MS_right, MS_bottom, MS_left, MS_top_h, MS_right_h, MS_bottom_h, MS_left_h
  if (MS_ref == 1) {
    //MS_top = MS_margin;
    MS_right = hover_size;
    MS_bottom = hover_size;
    //MS_left = MS_margin;
    //MS_top_h = 0;
    MS_right_h = hover_size;
    MS_bottom_h = hover_size;
    MS_left_h = 0
  } else if (MS_ref == 2) {
    //MS_top = hover_size
    MS_right = hover_size
    MS_bottom = MS_margin
    //MS_left = MS_margin
    //MS_top_h = hover_size;
    MS_right_h = hover_size;
    MS_bottom_h = 0;
    //MS_left_h = 0;
  } else if (MS_ref == 3) {
    //MS_top = hover_size
    MS_right = MS_margin
    MS_bottom = MS_margin
    //MS_left = hover_size
    //MS_top_h = hover_size;
    MS_right_h = 0;
    MS_bottom_h = 0;
    //MS_left_h = hover_size;
  } else if (MS_ref == 4) {
    //MS_top = MS_margin
    MS_right = MS_margin
    MS_bottom = hover_size
    //MS_left = hover_size
    //MS_top_h = 0;
    MS_right_h = 0;
    MS_bottom_h = hover_size;
    //MS_left_h = hover_size;
  }
  $(MS_id).css({
    'position': 'absolute',
    'width': MS_size,
    'height': MS_size,
    //'top': MS_top,
    //'left': MS_left,
    'right': MS_right,
    'bottom': MS_bottom,
  })
};

function BoxCenter(MS_ref, BC_offset_top_center, BC_offset_left_center, BC_proximity_box_size) {
  if (eval("BoxCenter_" + MS_ref + "_enable") == true) {
    //value vert. & hor. from center of window (0: center / >0: out of center)
    var mouse_vertical_from_center = Math.abs(mouse_top - BC_offset_top_center);
    var mouse_horizontal_from_center = Math.abs(mouse_left - BC_offset_left_center);

    var pos_neg_vertical = parseFloat( -(mouse_top - BC_offset_top_center) / mouse_vertical_from_center) || 1 ;
    var pos_neg_horizontal = parseFloat( -(mouse_left - BC_offset_left_center) / mouse_horizontal_from_center) || 1;

    //value to center = half min_window_size, value at border of virtual minimum window size square = 0
    var to_center_vertical_raw = (mouse_vertical_from_center - (BC_proximity_box_size/2));
    var to_center_vertical
    if (to_center_vertical_raw <= 0) {
      to_center_vertical = Math.abs(to_center_vertical_raw);
    } else {
      to_center_vertical = 0
    }

    var to_center_horizontal_raw = (mouse_horizontal_from_center - (BC_proximity_box_size/2));
    var to_center_horizontal;
    if (to_center_horizontal_raw <= 0) {
      to_center_horizontal = Math.abs(to_center_horizontal_raw);
    } else {
      to_center_horizontal = 0;
    }

    var to_center_vertical_uni = pos_neg_vertical * Math.round(10000 * (to_center_vertical / (BC_proximity_box_size/2))) / 10000;
    var to_center_horizontal_uni = pos_neg_horizontal * Math.round(10000 * (to_center_horizontal / (BC_proximity_box_size/2))) / 10000;

    return uni = Math.abs(to_center_vertical_uni * to_center_horizontal_uni)

  }
};
