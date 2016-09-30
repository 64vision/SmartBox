//User Module
var express = require('express');
var User = require('../models/Users');
var router = express.Router();


router.post('/add', function(req, res) {
	User.Add(res, req.body);

});

router.post('/login', function(req, res) {
	 res.header("Access-Control-Allow-Origin", "*");
	 User.Login(res, req.body);
});

router.post('/validate', function(req, res) {
	 res.header("Access-Control-Allow-Origin", "*");
	 User.Validate(res, req.body);

});

router.post('/create', function(req, res) {
	 res.header("Access-Control-Allow-Origin", "*");
	 User.Create(res, req.body);

});


router.post('/get', function(req, res) {
	User.Get(res, req.body);

});

router.post('/getsummary', function(req, res) {
	 res.header("Access-Control-Allow-Origin", "*");
	 User.GetSummary(res, req.body);
});
router.post('/storage', function(req, res) {
	 res.header("Access-Control-Allow-Origin", "*");
	 User.Storage(res, req.body);

});

module.exports=router;


