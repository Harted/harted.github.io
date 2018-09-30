// VARIABLES -----------------------------------------------------------------------------------------------------------------------
// Factors
var anim_speed_factor = 1;
var action_area_corner_offset_factor = 0.1; //(1 = 100%)
var action_area_base_size_factor = 3/2;

// Colors

var color_1 = '#FFFFFF';//'#3E3E3E'
var color_2 = '#FFFFFF';//'#238482';
var color_3 = '#FFFFFF';//'#3BDB83';
var color_4 = '#FFFFFF';//'#F4C700';
var color_back = '#FFFFFF';

// Window width variables
var iW, iH, iMin;

// Responsive
var page = false;
var scr_size = {}
// var scr_size.wX, scr_size.wL, scr_size.wM , scr_size.wS;
// var screen_large_size = 1026; //iPad pro = 1024
// var screen_medium_size = 770; //iPad = 768
// var screen_small_size = 416; //iPhone plus = 414

// Reference box variables
var ref_box_size;
var ref_box_offset_top_center, ref_box_offset_left_center;

// BoxProximity & mousemove variables
var mouse = {
  x: undefined,
  y: undefined
};
var touch = false;
var mousemove_enable = true; // to lower move move event rate

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

// Window data
var userAgent, dPR, iW, iH, iMin

// Global objects
var HL = {}; // header logo

// Soundcloud
var playing_global = false;



//CANVAS
var over = {}
