// USER AGENT ------------------------------------------------------------------
var userAgent = getUserAgent();

// Determine user agent --------------------------------------------------------
function getUserAgent() {

  var UA = navigator.userAgent || navigator.vendor || window.opera;

  console.log(UA)

  if (/windows phone/i.test(UA)) {
    return 'WindowsPhone';
  } else if (/android/i.test(UA)) {
    return 'Android';
  } else if (/iPad|iPhone|iPod/.test(UA) && !window.MSStream) {
    return 'iOS';
  } else if (/Chrome/.test(UA)) {
    return 'Chrome';
  } else if (/Safari/.test(UA)) {
    return 'Safari';
  } else if (/Firefox/.test(UA)) {
    return 'Firefox';
  } else if (/Trident\/7/.test(UA)) {
    return 'IE11';
  } else {
    console.log('unknown userAgent: ' + UA);
    return 'unknown';
  };

};

console.log('user agent: ' + userAgent)
