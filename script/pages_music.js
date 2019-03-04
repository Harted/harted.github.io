// Flexbox script for albums ----------------------------------------------------------------------------------------------------------
function AlbumFlex() {

  var albumtext = {
    margin: {
      title: '1em 0 0.2em 0',
      year: '0.2em 0 1em 0',
    },
    font_size: {
      title: '1em',
      year: '0.8em',
    },
    font_weight: {
      title: '400',
      year: '200',
    },
    text_align: {
      title: 'center',
      year: 'center',
    },
    text_transform: {
      title: 'capitalize',
      year: 'capitalize',
    },
  }


  $('.album_title').css({
  	'text-align' : albumtext.text_align.title,
  	'text-transform' : albumtext.text_transform.title,
  	'margin' : albumtext.margin.title,
  	'font-size' : albumtext.font_size.title,
  	'font-weight' : albumtext.font_weight.title,
  });

  $('.album_year').css({
    'text-align' : albumtext.text_align.year,
  	'text-transform' : albumtext.text_transform.year,
  	'margin' : albumtext.margin.year,
  	'font-size' : albumtext.font_size.year,
  	'font-weight' : albumtext.font_weight.year,
  });

  AlbumFlexByID('#albums', true);
  AlbumFlexByID('#remixes', false);

};
// Album flex by ID -------------------------------------------------------------------------------------------------------------------
function AlbumFlexByID(AF_ID, important) {

  var article = {}
  var article_count = $(AF_ID + ' .album_container > article').length;

  if (win.width_b.S == true) {
    article = {
      'width': $('.container_child').width(),
      'padding': 0,
    }
  } else if (win.width_b.M == true || win.width_b.L == true || (win.width_b.S == false && article_count < 3 && important == true)) {
    article = {
      'width': $('.container_child').width() * 0.45,
      'padding': $('.container_child').width() * 0.024, // -0.001 for firefox (otherwise album gets wrapped)
    }
  } else {
    article = {
      'width': $('.container_child').width() * 0.30,
      'padding': $('.container_child').width() * 0.015,
    }
  }

  article.margin_bottom = 30
  article.img_max_dimension = win.iH/2

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
    'box-shadow': '0px 0px 1px rgba(0,0,0,0.25)',
    'vertical-align': 'middle',
  })

  $(AF_ID + ' .album_container::after').css({
    'content': '""',
    'width': article.width+(article.padding*2) + 'px',
  })

  $(AF_ID + ' .album_container').addClass('after')

  if (win.width_b.M == false && win.width_b.L == false && article_count < 2 ) {
    $(AF_ID + ' .album_container').addClass('fore')
  } else {
    $(AF_ID + ' .album_container').removeClass('fore')
  }

}
