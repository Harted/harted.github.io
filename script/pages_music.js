// Flexbox script for albums ----------------------------------------------------------------------------------------------------------
function AlbumFlex() {

  AlbumFlexByID('#albums', true);
  AlbumFlexByID('#remixes', false);

};
// Album flex by ID -------------------------------------------------------------------------------------------------------------------
function AlbumFlexByID(AF_ID, important) {

  var article = {}
  var article_count = $(AF_ID + ' .album_container > article').length;

  if (width_small == true) {
    article = {
      'width': $('.container_child').width(),
      'padding': 0,
    }
  } else if (width_medium == true || width_large == true || (width_small == false && article_count < 3 && important == true)) {
    article = {
      'width': $('.container_child').width() * 0.45,
      'padding': $('.container_child').width() * 0.025,
    }
  } else {
    article = {
      'width': $('.container_child').width() * 0.30,
      'padding': $('.container_child').width() * 0.015,
    }
  }

  article.margin_bottom = 30
  article.img_max_dimension = window_height/2

  $(AF_ID + ' .album_container').css({
    'display': 'flex',
    'flex-wrap': 'wrap',
    'justify-content': 'space-between'
  })

  $(AF_ID + ' .album_container article').css({
    'display': 'flex',
    'flex-direction': 'column',
    'width': article.width + 'px',
    'margin': '0px ' + article.padding + 'px',
    'margin-bottom': article.margin_bottom + 'px',
  })

  $(AF_ID + ' .album_container article a').css({
    'max-width': article.img_max_dimension + 'px',
    'width': '100%',
    'align-self': 'center',
  })

  $(AF_ID + ' .album_container article img').css({
    'max-width': article.img_max_dimension + 'px',
    'width': '100%',
    'height': 'auto',
    'align-self': 'center',
    'box-shadow': '0px 0px 2px rgba(0,0,0,0.25)',
  })

  $(AF_ID + ' .album_container::after').css({
    'content': '""',
    'width': article.width+(article.padding*2) + 'px',
  })

  $(AF_ID + ' .album_container').addClass('after')

  if (width_medium == false && width_large == false && article_count < 2 ) {
    $(AF_ID + ' .album_container').addClass('fore')
  } else {
    $(AF_ID + ' .album_container').removeClass('fore')
  }

}
