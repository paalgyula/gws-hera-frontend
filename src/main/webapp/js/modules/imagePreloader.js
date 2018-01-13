var imageList = ["images/big_bg.png", "images/footer_bg.png", "images/header_bg.png", "images/header_logo.png", "images/kulcs.png", "images/waitanim.gif"];

var cache = new Array();

var args_len = imageList.length;
for (var i = args_len; i--;) {
	var cacheImage = document.createElement('img');
	document.getElementById('loading-msg').innerHTML = 'Loading images ' + (args_len - i + 1) + "/" + args_len;
	cacheImage.src = imageList[i];
	cache.push(cacheImage);
}