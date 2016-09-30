//UCompany controller
var express = require('express');
var Media = require('../models/Media');
var router = express.Router();


router.post('/add', function(req, res) {
		res.header("Access-Control-Allow-Origin", "*");
			 req.body.media = JSON.parse(req.body.media);
		Media.Add(res, req.body);
});


router.post('/get', function(req, res) {
		 res.header("Access-Control-Allow-Origin", "*");
		Media.Get(res, req.body);
});


router.post('/ads', function(req, res) {
		 res.header("Access-Control-Allow-Origin", "*");
		Media.GetAds(res, req.body);
});


router.post('/getads', function(req, res) {
		 res.header("Access-Control-Allow-Origin", "*");
		Media.MediaAds(res, req.body);
});



router.post('/remove', function(req, res) {
		 res.header("Access-Control-Allow-Origin", "*");
		Media.Remove(res, req.body);
});

router.post('/update', function(req, res) {
		 res.header("Access-Control-Allow-Origin", "*");
		Media.Update(res, req.body);
});

router.post('/pushlog', function(req, res) {
		res.header("Access-Control-Allow-Origin", "*");
		Media.PushLog(res, req.body.logs);
});

router.post('/log', function(req, res) {
		res.header("Access-Control-Allow-Origin", "*");
		Media.Log(res, req.body);
});

router.post('/getcampaign', function(req, res) {
		res.header("Access-Control-Allow-Origin", "*");
		Media.Log(res, req.body);
});

router.post('/getscreen', function(req, res) {
		res.header("Access-Control-Allow-Origin", "*");
		Media.GetScreen(res, req.body);
});
router.post('/getschedule', function(req, res) {
		res.header("Access-Control-Allow-Origin", "*");
		Media.GetSchedule(res, req.body);
});
router.post('/getviews', function(req, res) {
		res.header("Access-Control-Allow-Origin", "*");
		Media.GetViews(res, req.body);
});


router.post('/getstats', function(req, res) {
		res.header("Access-Control-Allow-Origin", "*");
		Media.GetStats(res, req.body);
});

router.post('/savetoken', function(req, res) {
		res.header("Access-Control-Allow-Origin", "*");
		//req.body.media = JSON.parse(req.body.media);
		Media.SaveToken(res, req.body);
		//res.send(req.body);
});

router.post('/gettoken', function(req, res) {
		res.header("Access-Control-Allow-Origin", "*");
		//req.body.media = JSON.parse(req.body.media);
		Media.GetToken(res, req.body);
		//res.send(req.body);
});



module.exports=router;


