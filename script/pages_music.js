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
      'width': '100%',
      'padding': 0,
    }
  } else if (width_medium == true || width_large == true || (width_small == false && article_count < 3 && important == true)) {
    article = {
      'width': '45%',
      'padding': '2.5%',
    }
  } else {
    article = {
      'width': '30%',
      'padding': '1.5%',
    }
  }

  article.margin_bottom = '2em'
  article.img_max_dimension = window_height/2 +'px'

  $(AF_ID + ' .album_container').css({
    'display': 'flex',
    'flex-wrap': 'wrap',
    'justify-content': 'space-between'
  })

  $(AF_ID + ' .album_container article').css({
    'display': 'flex',
    'flex-direction': 'column',
    'width': article.width,
    'margin': '0px ' + article.padding,
    'margin-bottom': article.margin_bottom,
  })

  $(AF_ID + ' .album_container article img').css({
    'max-width': article.img_max_dimension,
    'width': '100%',
    'height': 'auto',
    'align-self': 'center',
    'box-shadow': '0px 0px 2px rgba(0,0,0,0.25)'
  })

  $(AF_ID + ' .album_container::after').css({
    'content': '""',
    'width': parseInt(article.width)+(parseInt(article.padding)*2) + '%',
  })

  console.log(parseInt(article.width)+(parseInt(article.padding)*2))

  $(AF_ID + ' .album_container').addClass('after')

  if (width_medium == false && width_large == false && article_count < 2 ) {
    $(AF_ID + ' .album_container').addClass('fore')
  } else {
    $(AF_ID + ' .album_container').removeClass('fore')
  }

}
