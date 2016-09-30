//UCompany controller
var express = require('express');
var Campaign = require('../models/Campaign');
var router = express.Router();


router.post('/add', function(req, res) {
		res.header("Access-Control-Allow-Origin", "*");
		req.body.campaign = JSON.parse(req.body.campaign);
		Campaign.Add(res, req.body);
});

router.post('/get', function(req, res) {
		 res.header("Access-Control-Allow-Origin", "*");
		Campaign.Get(res, req.body);
});

router.post('/items', function(req, res) {
		 res.header("Access-Control-Allow-Origin", "*");
		Campaign.GetItems(res, req.body);
});


router.post('/media', function(req, res) {
		 res.header("Access-Control-Allow-Origin", "*");
		Campaign.Media(res, req.body);
});


router.post('/removeItem', function(req, res) {
		 res.header("Access-Control-Allow-Origin", "*");
		Campaign.RemoveItem(res, req.body);
});

router.post('/additem', function(req, res) {
		res.header("Access-Control-Allow-Origin", "*");
		req.body.campaign = JSON.parse(req.body.campaign);
		console.log(req.body);
		Campaign.AddItem(res, req.body);
});

module.exports=router;


