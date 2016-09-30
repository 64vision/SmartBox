//UCompany controller
var express = require('express');
var Template = require('../models/Template');
var router = express.Router();

router.post('/load', function(req, res) {
		 res.header("Access-Control-Allow-Origin", "*");
		 Template.Load(res, req.body);
});

router.post('/addwidgetitem', function(req, res) {
		res.header("Access-Control-Allow-Origin", "*");
		req.body.items = JSON.parse(req.body.items);
		Template.AddWidgetItem(res, req.body);
});

router.post('/widgetitems', function(req, res) {
		 res.header("Access-Control-Allow-Origin", "*");
		Template.GetItems(res, req.body);
});

router.post('/removeitem', function(req, res) {
		 res.header("Access-Control-Allow-Origin", "*");
		Template.RemoveItem(res, req.body);
});


router.post('/get', function(req, res) {
		 res.header("Access-Control-Allow-Origin", "*");
		 Template.getTemplate(res, req.body);
});

router.post('/getall', function(req, res) {
		 res.header("Access-Control-Allow-Origin", "*");
		 Template.GetAllTemplate(res, req.body);
});


router.post('/widgetgetmedia', function(req, res) {
		 res.header("Access-Control-Allow-Origin", "*");
		 Template.WidgetGetMedia(res, req.body);
});

module.exports=router;


