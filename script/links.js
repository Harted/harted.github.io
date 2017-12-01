// Deep link ----------------------------------------------------------------------------------------------------------------------------
function DeepLink(web_link, ios_link, android_link) {

	var UA = getUserAgent();
	console.log(UA)

	if (UA == 'iOS') {
		AppSiteFallback(web_link, ios_link);
	} else if (UA == 'Android'){
		AppSiteFallback(web_link, android_link);
	} else {
		window.location = web_link;
	};


	function AppSiteFallback(sitelink, applink){
		setTimeout(function() {
			//window.location = sitelink;
		}, 10);
		//app?
		window.location = applink;
	}
};
