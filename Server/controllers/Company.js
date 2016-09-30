//UCompany controller
var express = require('express');
var company = require('../models/Company');
var router = express.Router();


router.post('/add', function(req, res) {
		 res.header("Access-Control-Allow-Origin", "*");
	var param = JSON.parse(req.body.params);
		company.Add(res, param);
});

router.post('/get', function(req, res) {
		 res.header("Access-Control-Allow-Origin", "*");
			company.Get(res, req.body);
});

module.exports=router;


