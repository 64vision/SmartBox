//UCompany controller
var express = require('express');
var Site = require('../models/Site');
var router = express.Router();


router.post('/get', function(req, res) {
		 res.header("Access-Control-Allow-Origin", "*");
		Site.Get(res, req.body);
});
router.post('/getsite', function(req, res) {
		 res.header("Access-Control-Allow-Origin", "*");
		Site.Getsite(res, req.body);
});

router.post('/add', function(req, res) {
		 res.header("Access-Control-Allow-Origin", "*");
		 req.body.site = JSON.parse(req.body.site);
		Site.Add(res, req.body);
});

router.post('/update', function(req, res) {
		 res.header("Access-Control-Allow-Origin", "*");
		 req.body.site = JSON.parse(req.body.site);
		Site.Update(res, req.body);
});

router.post('/addcat', function(req, res) {
		 res.header("Access-Control-Allow-Origin", "*");
		 req.body.category = JSON.parse(req.body.category);
		Site.AddCategory(res, req.body);
});

router.post('/addmedia', function(req, res) {
		 res.header("Access-Control-Allow-Origin", "*");
		 req.body.media = JSON.parse(req.body.media);
		Site.AddMedia(res, req.body);
});

router.post('/addlog', function(req, res) {
		 res.header("Access-Control-Allow-Origin", "*");
		 //console.log(req.body);
		// req.body = JSON.parse(req.body);
		Site.AddLog(res, req.body);
});

router.post('/getmedia', function(req, res) {
		 res.header("Access-Control-Allow-Origin", "*");
		Site.GetMedia(res, req.body);
});

router.post('/updatemedia', function(req, res) {
		 res.header("Access-Control-Allow-Origin", "*");
		 req.body.media = JSON.parse(req.body.media);
		Site.UpdateMedia(res, req.body);
});

router.post('/getcat', function(req, res) {
		 res.header("Access-Control-Allow-Origin", "*");
		Site.GetCategory(res, req.body);
});

router.get('/req_categories', function(req, res) {
		 res.header("Access-Control-Allow-Origin", "*");
		Site.SiteCategories(res, req.query);
});

router.get('/req_medias', function(req, res) {
		 res.header("Access-Control-Allow-Origin", "*");
		Site.SiteMedias(res, req.query);
});

router.get('/req_cat_relation', function(req, res) {
		 res.header("Access-Control-Allow-Origin", "*");
		Site.CatRelation(res, req.query);
});








module.exports=router;
