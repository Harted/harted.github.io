// VARIABLES -----------------------------------------------------------------------------------------------------------------------
// Factors
var anim_speed_factor = 1;
var action_area_corner_offset_factor = 0.1;
var action_area_base_size_factor = 3/2;

// Colors
var color_1 = "#3C3C3C";
var color_1_dim = '#BFBFBF';
var color_2 = "#238482";
var color_3 = "#3BDB83";
var color_4 = "#EFC700";
var color_back = "#FFFFFF";
var color_back_50 = '#80FFFFFF'


// Window width variables
var window_width, window_height, min_window_size;

// Responsive (minimum sizes)
var screen_large, screen_medium , screen_small;
var screen_large_size = 1026; //iPad pro = 1024
var screen_medium_size = 770; //iPad = 768
var screen_small_size = 416; //iPhone plus = 414

// Reference box variables
var ref_box_size;
var ref_box_offset_top_center, ref_box_offset_left_center;

// BoxProximity & mousemove variables
var mouse_top, mouse_left, touch

var box_corner_offset, proximity_margin;
var box1_proximity, box2_proximity, box3_proximity, box4_proximity;
var box1_proximity_size, box2_proximity_size, box3_proximity_size, box4_proximity_size;
BoxProximity_1_enable = true;
BoxProximity_2_enable = true;
BoxProximity_3_enable = true;
BoxProximity_4_enable = true;

// Square/Box variables
var box1_size, box2_size, box3_size, box4_size;
var hover_size;
var box_title_margin, box_title_font_size;
var box1_offset_top_center, box1_offset_left_center;
var box2_offset_top_center, box2_offset_left_center;
var box3_offset_top_center, box3_offset_left_center;
var box4_offset_top_center, box4_offset_left_center;
var BoxProximity_1_enable, BoxProximity_2_enable, BoxProximity_3_enable, BoxProximity_4_enable;
var MS_animation_speed

// Logo variables
var logo_size, logo_ref_center_tl;

// Header
var header_height = 50;
