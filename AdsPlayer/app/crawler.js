$(function() {
var msg_crawler;
var socket = io("http://prod.inventiv.ph",{path: '/server1'});
    var str = getParameterByName('str');
    $('marquee').html(str);


socket.on('oncrawler', function (data) {
	if(msg_crawler != data.message) {
		 $('marquee').html(data.message);
		msg_crawler = data.message;
	}
});



    function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}
});