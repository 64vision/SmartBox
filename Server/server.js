var express = require('express');
var path = require('path');
var bodyParser = require('body-parser')
var app = express();
var ioserver = require('http').createServer(app);
var io = require('socket.io')(ioserver);

var config =  require('./config/config');
var mysql = require('mysql');
var md5 = require('md5');
var DBconnect  = config.DBconnect(mysql);

var screen = require('./models/Screen');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use('/user', require('./controllers/Users'));
app.use('/company', require('./controllers/Company'));
app.use('/screen', require('./controllers/Screen'));
app.use('/category', require('./controllers/Category'));
app.use('/campaign', require('./controllers/Campaign'));
app.use('/media', require('./controllers/Media'));
app.use('/schedule', require('./controllers/Schedule'));
app.use('/template', require('./controllers/Template'));
app.use('/site', require('./controllers/Site'));


app.listen('8081', function() {
	console.log("ISSP server is now running...");

});

io.on('connection', function (socket) {
  console.log("connect");
  socket.on('update', function (data) {
    console.log(data);
  	 socket.broadcast.emit('screen', data);
  });

   socket.on('updatecrawler', function(data){
		socket.broadcast.emit('oncrawler', data);
	});
 
});
ioserver.listen(8000, function() {

	console.log("Socket server is now running... 3000");

});
