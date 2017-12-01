// Deep link ----------------------------------------------------------------------------------------------------------------------------
function DeepLink(web_link, ios_link, android_link) {

	//redirect web
	setTimeout(function() {
  		window.location = web_link;
	}, 20);

	//redirect android
	setTimeout(function() {
  		window.location = android_link;
	}, 10);

	//direct ios
	window.location = ios_link;

};
