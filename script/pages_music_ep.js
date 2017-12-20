// Flexbox script for albums ----------------------------------------------------------------------------------------------------------
function EpHeader(header_color, link_color){

  var width_larger_then_large = valBetween(window_width - screen_large_size,0,1024);
  var em_add = Math.round(width_larger_then_large/10.24/4)/100;
  var base_em = 1 + em_add;

  var ep = {
    'display': 'flex',
    'flex_direction': 'row',
    'margin_bottom': header_height,
    'color': header_color,
    'font_size': base_em + 'em',
    text_holder: {
      'display': 'flex',
      'width': '33%'
    },
    text: {
      //flex
      'display': 'flex',
      'flex_direction': 'column',
      'justify_content': 'space-between',
      //layout
      'width': '100%',
      'padding_top': HL.center_right() + 'px',
      'padding_right': '0px',
      'padding_bottom': HL.center_right() + 'px',
      'padding_left': HL.center_right() + 'px',
      header: {
        'margin_bottom': '50px', //automate??
        title: {
          'margin': '0 0 0.25em 0',
          'font_size': '1.6em',
          'font_weight': '400',
          'text_align': 'left',
          'text_transform': 'uppercase',
          'opacity': '1'
        },
        label: {
          'margin': '0',
          'font_size': '0.8em',
          'font_weight': '400',
          'text_align': 'left',
          'text_transform': 'uppercase',
          'opacity': '0.5',
          'color': link_color,
        }
      },
      tracks: {
        //flex
        'display': 'flex',
        'flex_direction': 'column',
        //layout
        'bottom': '0',
        'white_space': 'nowrap',
        //text style
        'font_size': '0.9em',
        'font_weight': '300',
        'line_height': '1.9em',
        code: {
          'opacity': '0.5',
          'font_size': '0.8em', //of tracks font-size
          'margin_bottom': '0.5em',
          'text_transform': 'uppercase',
        },
        track: {
          title: {},
          time: {
            'float': 'right',
            'font_size': '0.8em',
            'padding_left': '0.2em',
          },
          remix: {
            'opacity': '0.5',
            'font_size': '0.8em' //of tracks font-size
          },
          duration: {
            'opacity': '0.5',
          },
        },
      }
    },
    img: {
      //flex
      'display': 'flex',
      'width': '66.66%',
      //layout
      'align_items': 'center',
      '_img': { 'width' : '100%' },
    },
  }

  // width small & medium changes
  if (width_small == true || width_medium == true) {
    ep.flex_direction = 'column-reverse'
    ep.text_holder.width = '100%'
    ep.img.width = '100%'
    ep.text.padding_top = 0 + 'px'
    ep.text.padding_right = HL.center_right() + 'px'
    if (window_height - header_height < window_width/3*2){ //ep banner image is 2/3 ratio
      // precentage left of window height 2/3 of witdht make banner fit iphone landscape
      ep.img._img.width = Math.round((window_height - header_height) / (window_width/3*2) * 100) + '%'
    }
  }

  $('.ep_container').css({
    'display': ep.display,
    'flex-direction': ep.flex_direction,
    'background-color': ep.color,
    'font-size': ep.font_size,
    'margin-bottom': ep.margin_bottom,
  });
  $('.text_holder').css({
    'display': ep.text_holder.display,
    'width': ep.text_holder.width,
  });
  $('.ep_text').css({
    'display' : ep.text.display,
    'flex-direction' : ep.text.flex_direction,
    'justify-content' : ep.text.justify_content,
    'width' : ep.text.width,
    'padding-top' : ep.text.padding_top,
    'padding-right' : ep.text.padding_right,
    'padding-bottom' : ep.text.padding_bottom,
    'padding-left' : ep.text.padding_left,
  });
  $('.ep_header_text').css({
    'margin-bottom': ep.text.header.margin_bottom,
  });
  $('.ep_title').css({
    'margin': ep.text.header.title.margin,
    'font-size': ep.text.header.title.font_size,
    'font-weight': ep.text.header.title.font_weight,
    'text-align': ep.text.header.title.text_align,
    'text-transform': ep.text.header.title.text_transform,
    'opacity': ep.text.header.title.opacity,
  });
  $('.ep_label').css({
    'margin': ep.text.header.label.margin,
    'font-size': ep.text.header.label.font_size,
    'font-weight': ep.text.header.label.font_weight,
    'text-align': ep.text.header.label.text_align,
    'text-transform': ep.text.header.label.text_transform,
    'opacity': ep.text.header.label.opacity,
    'color': ep.text.header.label.color,
  });
  $('.ep_tracks_text').css({
    'display': ep.text.tracks.display,
    'flex-direction': ep.text.tracks.flex_direction,
    'font-size': ep.text.tracks.font_size,
    'font-weight': ep.text.tracks.font_weight,
    'bottom': ep.text.tracks.bottom,
    'line-height': ep.text.tracks.line_height,
    //'white-space': ep.text.tracks.white_space, doesn't have the disired outcome in firefox
  });
  $('.ep_code').css({
    'opacity': ep.text.tracks.code.opacity,
    'font-size': ep.text.tracks.code.font_size,
    'margin-bottom': ep.text.tracks.code.margin_bottom,
    'text-transform': ep.text.tracks.code.text_transform,
  });
  $('.track_time').css({
    'float': ep.text.tracks.track.time.float,
    'font-size': ep.text.tracks.track.time.font_size,
    'padding-left': ep.text.tracks.track.time.padding_left,
  });
  $('.track_duration').css({
    'float': ep.text.tracks.track.time.float,
    'font-size': ep.text.tracks.track.time.font_size,
    'opacity': ep.text.tracks.track.duration.opacity,
  });
  $('.track_remix').css({
    'opacity': ep.text.tracks.track.remix.opacity,
    'font-size': ep.text.tracks.track.remix.font_size
  });
  $('.ep_img').css({
    'display': ep.img.display,
    'width': ep.img.width,
    'align-items': ep.img.align_items,
    'justify-content': ep.img.align_items,
  });
  $('.ep_img > img').css({
    'width' : ep.img._img.width,
  });

};

// General soundcloud player generating etc -------------------------------------------------------------------------------------------
function Soundcloud(info, color){

  //console.log(info)

  $('.play').css('fill', color).attr({
    'width':'9',
    'height':'9',
  }) //height needed for IE because use svg is not showing

  //soundcloud logo right cutoff
  $('.sc_player_holder').css({
    'overflow': 'hidden',
    'position': 'fixed',
    'visibility': 'hidden',
    'transition': '100ms',
    'opacity': 1,
    'bottom': header_height - 10,
    'padding-top': '10px',
    //'background': color_back
  });
  $('.sc_player').css({
    'margin-right': '-110px',
    'margin-left': '-30px',
  });

  for (key in info) {
  	console.log(info[key])
    SCMiniTrackPlayer(info[key].id, info[key].sc_id, color, info[key].inverse, info[key].auto_play, info[key].show_user);
  }

  //SCMiniTrackPlayer('#polysemy', '290042835', color, false, false, false);
  //SCMiniTrackPlayer('#garden', '290042833', color, false, false, false);
  //SCMiniTrackPlayer('#dew', '290042831', color, false, false, false);
  //SCMiniTrackPlayer('#astray', '290042830', color, false, false, false);

};
function scRefresh(){
  $('.sc_player_holder').css({
    'width': window_width + 'px',
  });
}

// Make mini track player -------------------------------------------------------------------------------------------------------------
function SCMiniTrackPlayer(iframe_id, track_id, color, inverse_bool, auto_play_bool, show_user_bool){

  color = color.replace('#','%23')
  var playing = false;
  var time;
  //var test;

  //link making
  var link =
  'https://w.soundcloud.com/player/' +
  '?url=' +
  'https%3A//api.soundcloud.com/tracks/' + track_id +
  '&amp;color=' + color +
  '&amp;inverse=' + inverse_bool +
  '&amp;auto_play=' + auto_play_bool +
  '&amp;show_user=' + show_user_bool;

  $(iframe_id).attr('src' , link)

  //playing
  var id_name = iframe_id.replace('#','')

  eval(id_name + '= SC.Widget(id_name)');
  eval(id_name).bind(SC.Widget.Events.READY, function() {
    $(iframe_id + '_track').on('click', function(){
      if (playing == true){
        eval(id_name).pause()
      } else {
        eval(id_name).play()
      }
    }).on('mouseover', function(){
      $(this).css('cursor', 'pointer')
    }).on('mouseout', function(){
      $(this).css('cursor', 'initial')
    })
    eval(id_name).bind(SC.Widget.Events.PLAY_PROGRESS, function(){
      this.getPosition(function(val){time = val})
      $(iframe_id + '_track .track_duration').html(msToTime(time || 0) + ' /');
    }).bind(SC.Widget.Events.PLAY, function() {
      playing = true
      $(iframe_id + '_track .play use').attr('xlink:href','/svg/playpause.svg#pause')
      $(iframe_id + '_track .track_duration').css('visibility', 'visible')
      $(iframe_id + '_holder').css('visibility', 'visible')
    }).bind(SC.Widget.Events.PAUSE, function() {
      playing = false
      $(iframe_id + '_track .play use').attr('xlink:href','/svg/playpause.svg#play')
      $(iframe_id + '_track .track_duration').css('visibility', 'hidden')
      $(iframe_id + '_holder').css('visibility', 'hidden')
    })
  })
};

function msToTime(ms){

  var hour = Math.floor(ms/3600000)
  var min = Math.floor(ms/60000) - (Math.floor(ms/3600000)*60)
  var sec = Math.floor((ms/1000) - (Math.floor(ms/60000)*60))
  if (sec < 10) {sec = '0' + sec}
  if (hour > 0) {
    if (min < 10) {min = '0' + min}
    var time = hour + ':' + min + ':' + sec
  } else {
    var time = min + ':' + sec
  }

  return time

}
