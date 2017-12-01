// Deep link ----------------------------------------------------------------------------------------------------------------------------
function DeepLink(web_link, ios_link, android_link) {

	//redirect web
	setTimeout(function() {
  		//window.location = web_link;
	}, 20);
/*
	//redirect android
	setTimeout(function() {
  		window.location = android_link;
	}, 10);

	//direct ios
	window.location = ios_link;
*/

console.log(getMobileOperatingSystem())

function getMobileOperatingSystem() {
  var userAgent = navigator.userAgent || navigator.vendor || window.opera;

      // Windows Phone must come first because its UA also contains "Android"
    if (/windows phone/i.test(userAgent)) {
        return "Windows Phone";
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
		console.log('userAgent: ' + userAgent)

    return "unknown";
}

};
