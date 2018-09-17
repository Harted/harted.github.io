const deg = Math.PI / 180
const cir = Math.PI * 2

var dPR = window.devicePixelRatio
var iW = window.innerWidth
var iH = window.innerHeight
var iWdPR = window.innerWidth*dPR
var iHdPR = window.innerHeight*dPR

var background = $('#background')[0];
var c_logo = $('#center_logo')[0];
var b = background.getContext('2d');
var cl = c_logo.getContext('2d');

var frame = 0
