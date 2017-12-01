// Deep link ----------------------------------------------------------------------------------------------------------------------------
function DeepLink(web_link, ios_link, android_link) {

	var UA = getMobileOperatingSystem();

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

	function getMobileOperatingSystem() {
		var userAgent = navigator.userAgent || navigator.vendor || window.opera;

		// Windows Phone must come first because its UA also contains "Android"
		if (/windows phone/i.test(userAgent)) {
			return "WindowsPhone";
		}
		if (/android/i.test(userAgent)) {
			return "Android";
		}
		// iOS detection from: http://stackoverflow.com/a/9039885/177710
		if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) {
			return "iOS";
		}
		if (/Chrome/.test(userAgent)) {
			return "Chrome";
		}
		if (/Safari/.test(userAgent)) {
			return "Safari";
		}
		if (/Firefox/.test(userAgent)) {
			return "Firefox"
		}
		console.log('OTHER userAgent: ' + userAgent)
		return "unknown";
	}

};
