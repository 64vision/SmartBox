//UCompany controller
var express = require('express');
var category = require('../models/Category');
var router = express.Router();


router.post('/add', function(req, res) {
		category.Add(res, req.body);
});

router.post('/get', function(req, res) {
		category.Get(res, req.body);
});

module.exports=router;


