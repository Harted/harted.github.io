// Deep link ----------------------------------------------------------------------------------------------------------------------------
function DeepLink(web_link, ios_link, android_link) {
	var UA_local = getUserAgent();
	console.log(UA_local);

	if (UA_local == 'iOS') {
		AppSiteFallback(web_link, ios_link);
	} else if (UA_local == 'Android'){
		AppSiteFallback(web_link, android_link);
	} else {
		window.location = web_link;
	};

};

// When app then app else site ----------------------------------------------------------------------------------------------------------
function AppSiteFallback(sitelink, applink){
	setTimeout(function() {
		window.location = sitelink;
	}, 10);
	//app?
	window.location = applink;
};
