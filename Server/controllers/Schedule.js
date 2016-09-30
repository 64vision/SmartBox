//UCompany controller
var express = require('express');
var Schedule = require('../models/Schedule');
var router = express.Router();


router.post('/add', function(req, res) {
		res.header("Access-Control-Allow-Origin", "*");
		req.body.schedule = JSON.parse(req.body.schedule);
		Schedule.Add(res, req.body);
});

router.post('/get', function(req, res) {
		 res.header("Access-Control-Allow-Origin", "*");
		Schedule.Get(res, req.body);
});

router.post('/items', function(req, res) {
		 res.header("Access-Control-Allow-Origin", "*");
		Schedule.GetItems(res, req.body);
});
router.post('/removeitem', function(req, res) {
		 res.header("Access-Control-Allow-Origin", "*");
		Schedule.RemoveItem(res, req.body);
});

router.post('/additem', function(req, res) {
		res.header("Access-Control-Allow-Origin", "*");
		req.body.items = JSON.parse(req.body.items);
		Schedule.AddItem(res, req.body);
});

module.exports=router;


