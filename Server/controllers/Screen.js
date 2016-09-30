//UCompany controller
var express = require('express');
var screen = require('../models/Screen');
var router = express.Router();


router.post('/add', function(req, res) {
		res.header("Access-Control-Allow-Origin", "*");
		 req.body.items = JSON.parse(req.body.items);
		 console.log(req.body.items);
		 screen.AddScreen(res, req.body);
		
});

router.post('/get', function(req, res) {
		 res.header("Access-Control-Allow-Origin", "*");
		screen.Get(res, req.body);
});

router.post('/status', function(req, res) {
		 res.header("Access-Control-Allow-Origin", "*");
		screen.Status(res, req.body);
});

router.post('/validatekey', function(req, res) {
		 res.header("Access-Control-Allow-Origin", "*");
		screen.ValidateKey(res, req.body);
});

router.post('/addgroup', function(req, res) {
		 res.header("Access-Control-Allow-Origin", "*");
		 req.body.items = JSON.parse(req.body.items);
		 screen.AddGroup(res, req.body);
});
router.post('/getgroup', function(req, res) {
		 res.header("Access-Control-Allow-Origin", "*");
		screen.GetGroup(res, req.body);
});

router.post('/update', function(req, res) {
		 res.header("Access-Control-Allow-Origin", "*");
		// req.body.items = JSON.parse(req.body.items);
		screen.Update(res, req.body);
});

router.post('/schedule', function(req, res) {
		 res.header("Access-Control-Allow-Origin", "*");
		// req.body.items = JSON.parse(req.body.items);
		screen.Schedule(res, req.body);
});




setInterval(function() {

	screen.ScreenBeat();

}, 1200000);


module.exports=router;


