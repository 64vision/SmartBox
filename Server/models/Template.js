var config =  require('../config/config');
var mysql = require('mysql');
var md5 = require('md5');
var DBconnect  = config.DBconnect(mysql);

exports.Load = function(res, params) {
	
	res.setHeader('Content-Type', 'text/plain');
	console.log("Load template ... \n\n");  
	var response = {};
	response.status = 0;
	//validate user token
	var check_sql = "SELECT * FROM user WHERE user_id='"+params.user_id+"' AND token='"+params.token+"' AND type=1";
	var get_sql ="SELECT * FROM template WHERE template_id='"+params.template_id+"'";
	var widget_sql = "SELECT * FROM widget WHERE template_id='"+params.template_id+"'";
	DBconnect.query(check_sql, function(err, row) {
		//console.log(row);
		if(!err) {
			if(row.length > 0) {
				response.status = 1;
				//pull companies
				DBconnect.query(get_sql, function(error, _rows) {
					if(!error) {
						response.remarks = "Successfull!";
						response.items = _rows;
						DBconnect.query(widget_sql, function(_error, rows) {
							if(!_error) { 
								response.widgets = rows;
							}
							res.end(JSON.stringify(response, null, 2));	
						});

					} else {

						console.log("Pull schedule items");
					}
				
				});
				

			} else {
				response.remarks = "Invalid token!";
				res.end(JSON.stringify(response, null, 2));
			}

		}

	});

}

exports.AddWidgetItem = function(res, params) {
	res.setHeader('Content-Type', 'text/plain');
	console.log("Adding schedule item ... \n\n");  
	var response = {};
	response.status = 0;
	//validate user token
	var check_sql = "SELECT * FROM user WHERE user_id='"+params.user_id+"' AND token='"+params.token+"' AND type=1";
	var data =params.items[0];
	DBconnect.query(check_sql, function(err, row) {
		if(!err) {
			if(row.length > 0) {
				response.status = 1;
				//Insert new company
				DBconnect.query('INSERT INTO widget_item SET ?', data, function(error, _rows) {
					if(!error) {
						response.remarks = "New item was added!";
						response.item_id = _rows.insertId;
						response.items = data;
					} else {
						console.log(error);
					}
					res.end(JSON.stringify(response, null, 2));
				});
				

			} else {
				response.remarks = "Invalid token!";
				res.end(JSON.stringify(response, null, 2));
			}

		}

	});
	
}


exports.GetItems = function(res, params) { 

	res.setHeader('Content-Type', 'text/plain');
	console.log("Pull schedule items ... \n\n");  
	var response = {};
	response.status = 0;
	//validate user token
	var check_sql = "SELECT * FROM user WHERE user_id='"+params.user_id+"' AND token='"+params.token+"' AND type=1";
	var get_sql ="SELECT * FROM widget_item WHERE widget_id='"+params.widget_id+"' AND screen_id=" + params.screen_id;
	DBconnect.query(check_sql, function(err, row) {
		//console.log(row);
		if(!err) {
			if(row.length > 0) {
				response.status = 1;
				//pull companies
				DBconnect.query(get_sql, function(error, _rows) {
					if(!error) {
						response.remarks = "Successfull!";
						response.items = _rows;
					} else {

						console.log("Pull schedule items");
					}
					res.end(JSON.stringify(response, null, 2));
				});
				

			} else {
				response.remarks = "Invalid token!";
				res.end(JSON.stringify(response, null, 2));
			}

		}

	});

}



exports.RemoveItem = function(res, params) { 

	res.setHeader('Content-Type', 'text/plain');
	console.log("Remove widget item ... \n");  
	var response = {};
	response.status = 0;
	//validate user token
	var check_sql = "SELECT * FROM user WHERE user_id='"+params.user_id+"' AND token='"+params.token+"'";
	var get_sql ="DELETE FROM widget_item WHERE item_id='"+params.item_id+"'";
	DBconnect.query(check_sql, function(err, row) {
		//console.log(row);
		if(!err) {
			if(row.length > 0) {
				response.status = 1;
				//pull companies
				DBconnect.query(get_sql, function(error, _rows) {
					if(!error) {
						response.remarks = "Successfull!";
					} else {

						console.log("Remove widget item");
					}
					res.end(JSON.stringify(response, null, 2));
				});
				

			} else {
				response.remarks = "Invalid token!";
				res.end(JSON.stringify(response, null, 2));
			}

		}

	});

}



exports.getTemplate = function(res, params) { 

	res.setHeader('Content-Type', 'text/plain');
	console.log("getTemplate ...");  
	var response = {};
	response.status = 0;
	console.log("id is: " + params.template_id );
	var get_sql = "SELECT t.template_id as template_id, t.width as template_width, t.height as template_height, w.widget_id as id, w.unique_id as unique_id, w.width as zone_width, w.height as zone_height, w.pos_x as pos_x, w.pos_y as pos_y, w.media_types as type FROM template t LEFT JOIN widget w ON  t.template_id = w.template_id  WHERE t.template_id='" + params.template_id +"'";
	DBconnect.query(get_sql, function(err, tplrow) {
		if(!err) {
			if(tplrow.length > 0) {
					response.status = 1;
					response.remarks = "Successfull!";
					response.zones = tplrow;

			} else {
				response.remarks = "Invalid token!";
			
			}

		} else {

			console.log(err);
		}
		res.end(JSON.stringify(response, null, 2));
	});

}
/*
	SELECT * FROM media m LEFT JOIN campaign_item ci ON m.media_id = ci.media_id LEFT JOIN schedule_item si ON ci.campaign_id = si.campaign_id LEFT JOIN widget_item wi ON si.schedule_id = wi.schedule_id WHERE wi.widget_id=1
*/


exports.WidgetGetMedia =  function(res, params) { 

	res.setHeader('Content-Type', 'text/plain');
	console.log("WidgetGetMediaAssets ..."); 
	var response = {};
	response.status = 0;
	var get_sql ="SELECT m.media_id, m.file, m.type, ci.campaign_id, wi.widget_id, s.schedule_id, s.display_time, c.interval, w.unique_id as unique_id FROM media m LEFT JOIN campaign_item ci ON m.media_id = ci.media_id LEFT JOIN schedule_item si ON ci.campaign_id = si.campaign_id LEFT JOIN widget_item wi ON si.schedule_id = wi.schedule_id LEFT JOIN schedule s ON s.schedule_id=si.schedule_id LEFT JOIN campaign c ON ci.campaign_id = c.campaign_id LEFT JOIN widget w ON wi.widget_id=w.widget_id  WHERE wi.widget_id="+params.widget_id+" ORDER BY ci.item_id";
	DBconnect.query(get_sql, function(error, _rows) {
		if(!error) {
			response.status = 1;
			response.remarks = "Successfull!";
			response.hash = md5(JSON.stringify(_rows));
			response.widget_id = params.widget_id;
			response.assets = _rows;
			//console.log(_rows);
		} else {

			console.log("Error WidgetGetMediaAssets");
		}
		res.end(JSON.stringify(response, null, 2));
		

	});

}

exports.GetAllTemplate =  function(res, params) { 

	res.setHeader('Content-Type', 'text/plain');
	console.log("GetAllTemplate ... \n");  
	var response = {};
	response.status = 0;
	//validate user token
	var check_sql = "SELECT * FROM user WHERE user_id='"+params.user_id+"' AND token='"+params.token+"'";
	var get_sql ="SELECT * FROM template WHERE status=1";
	DBconnect.query(check_sql, function(err, row) {
		//console.log(row);
		if(!err) {
			if(row.length > 0) {
				response.status = 1;
				//pull companies
				DBconnect.query(get_sql, function(error, _rows) {
					if(!error) {
						response.remarks = "Successfull!";
						response.items = _rows;
					} else {
						console.log(error);
					}
					res.end(JSON.stringify(response, null, 2));
				});
				

			} else {
				response.remarks = "Invalid token!";
				res.end(JSON.stringify(response, null, 2));
			}

		}

	});
}