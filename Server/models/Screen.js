var config =  require('../config/config');
var mysql = require('mysql');
var md5 = require('md5');
var DBconnect  = config.DBconnect(mysql);


exports.AddScreen = function(res, params) {
	res.setHeader('Content-Type', 'text/plain');
	console.log("Adding screen ...");  
	var response = {};
	response.status = 0;
	//validate user token
	var check_sql = "SELECT * FROM user WHERE user_id='"+params.user_id+"' AND token='"+params.token+"' AND type=1";
	var screendata =params.items[0];
	screendata.status = 1;
	screendata.template = 1; //set default
	screendata.license_key = licenseGen();
	DBconnect.query(check_sql, function(err, row) {
		if(!err) {
			if(row.length > 0) {
				response.status = 1;
				//Insert new company
				DBconnect.query('INSERT INTO screen SET ?', screendata, function(error, _rows) {
					if(!error) {
						response.remarks = "New screen was added!";
						response.screen_id = _rows.insertId;
						response.screen = screendata;
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


//License
function licenseGen() {
	var chars = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
	var length = 11;
	 var result = '';
    for (var i = length; i > 0; --i) result += chars[Math.round(Math.random() * (chars.length - 1))];
    return result;
}



//
exports.Status = function(res, params) {
	res.setHeader('Content-Type', 'text/plain');
	console.log("screen status ... \n\n");  
	var response = {};
	console.log(params.screen_id);
	response.status = 0;
	var update_sql = 'UPDATE screen SET ?  WHERE screen_id = ' + params.screen_id;
	DBconnect.query(update_sql,  [params], function(error, _rows) {
		if(!error) {
			response.status = 1;
			console.log("Success screen update");
			
		} else {
			console.log(error);
			console.log("Error screen update");
		}
		res.end(JSON.stringify(response, null, 2));
	});

}
exports.Update = function(res, params) {
	res.setHeader('Content-Type', 'text/plain');
	console.log("screen Update ... \n\n");  
	var response = {};
	response.status = 0;
	var data = {};
	data.template =  params.template_id;
	var update_sql = 'UPDATE screen SET ?  WHERE screen_id = ' + params.screen_id;
	DBconnect.query(update_sql,  [data], function(error, _rows) {
		if(!error) {
			response.status = 1;
			console.log("Success screen tempate  update");
			
		} else {
			console.log(error);
			console.log("Error screen update");
		}
		res.end(JSON.stringify(response, null, 2));
	});
}
//Crud Schedule
exports.Schedule = function(res, params) {
	res.setHeader('Content-Type', 'text/plain');
	console.log("Crud screen Schedule ... \n"); 
	var response = {};
	response.status = 0;
	var data = {};
	data.template =  params.template_id;
	data.new_schedule =  params.schedule;
	var update_sql = 'UPDATE screen SET ?  WHERE screen_id = ' + params.screen_id;
	DBconnect.query(update_sql,  [data], function(error, _rows) {
		if(!error) {
			response.status = 1;
			console.log("Success screen schedule  update");
			
		} else {
			console.log(error);
			console.log("Error screen update");
		}
		res.end(JSON.stringify(response, null, 2));
	});

}

//pull details
exports.Get = function(res, params) { 

	res.setHeader('Content-Type', 'text/plain');
	console.log("Pull screens ... \n\n");  
	var response = {};
	response.status = 0;
	//validate user token
	var check_sql = "SELECT * FROM user WHERE user_id='"+params.user_id+"' AND token='"+params.token+"' AND type=1";
	var get_sql ="SELECT * FROM screen WHERE status > 0 AND user_id='"+params.user_id+"'";
	DBconnect.query(check_sql, function(err, row) {
		//console.log(row);
		if(!err) {
			if(row.length > 0) {
				response.status = 1;
				//pull companies
				DBconnect.query(get_sql, function(error, _rows) {
					if(!error) {
						response.remarks = "Successfull!";
						response.screens = _rows;
					} else {

						console.log("Pull screens");
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

exports.ValidateKey = function(res, params) {

	res.setHeader('Content-Type', 'text/plain');
	console.log("Pull screens ..." + params.license_key);  
	var response = {};
	response.status = 0;

	//validate user token

	var get_sql ="SELECT * FROM screen WHERE status > 0 AND license_key='"+params.license_key+"'";
	DBconnect.query(get_sql, function(error, _rows) {
		if(!error) {
			if(_rows.length > 0) {
				response.status = 1;
				response.remarks = "Successful!";
				response.screen = _rows;
			}
		} else {
			console.log("Error license validation");
		}
		res.end(JSON.stringify(response, null, 2));
	});

}

exports.CheckHash = function(screen_id, callback) {

	
	console.log("Check Hash ... \n");  
	/*
	var get_sql ="SELECT * FROM screen WHERE screen_id="+screen_id;
	DBconnect.query(get_sql, function(error, _rows) {
		if(!error) {
			callback("sfsaf");
			return;
		} 
	});*/
	callback("sfsaf");

}

exports.Stream = function(res, params) {

	res.setHeader('Content-Type', 'text/plain');
	console.log("WidgetGetMediaAssets Stream ... \n\n"); 
	var response = {};
	response.status = 0;
	var get_sql ="SELECT m.media_id, m.file, m.type, ci.campaign_id, wi.widget_id, s.schedule_id, s.display_time, c.interval FROM media m LEFT JOIN campaign_item ci ON m.media_id = ci.media_id LEFT JOIN schedule_item si ON ci.campaign_id = si.campaign_id LEFT JOIN widget_item wi ON si.schedule_id = wi.schedule_id LEFT JOIN schedule s ON s.schedule_id=si.schedule_id LEFT JOIN campaign c ON ci.campaign_id = c.campaign_id  WHERE wi.widget_id="+params.wid+" ORDER BY ci.item_id";
	DBconnect.query(get_sql, function(error, _rows) {
		if(!error) {
			response.status = 1;
			response.remarks = "Successfull!";
			response.hash = md5(JSON.stringify(_rows));
			response.widget_id = params.widget_id;
			response.assets = _rows;
		} else {

			console.log("Error WidgetGetMediaAssets");
		}
		res.end(JSON.stringify(response, null, 2));
		

	});

}

exports.ScreenBeat = function() {

	var update_sql = 'UPDATE screen SET status= 3 WHERE status > 3';
	DBconnect.query(update_sql, function(error, _rows) {});
}


exports.AddGroup = function(res, params) {
	res.setHeader('Content-Type', 'text/plain');
	console.log("AddGroup ... \n\n");  
	var response = {};
	response.status = 0;
	//validate user token
	var check_sql = "SELECT * FROM user WHERE user_id='"+params.user_id+"' AND token='"+params.token+"'";
	var groupdata =params.items[0];
	var check_group = "SELECT * FROM screen_group WHERE user_id='"+params.user_id+"' AND name='"+groupdata.name+"'";
	DBconnect.query(check_sql, function(err, row) {
		if(!err) {
			if(row.length > 0) {
				response.status = 1;
				DBconnect.query(check_group, function(error, _rows) {
					console.log(_rows);
					if(_rows.length == 0) {
				
						DBconnect.query('INSERT INTO screen_group SET ?', groupdata, function(_error_, _rows_) {
							console.log("Inserting");
							if(!_error_) {
								response.status = 1;
								response.remarks = "New group was added!";
							} else {
								console.log(_error_);

							}
							res.end(JSON.stringify(response, null, 2));
						});
					} else {
						console.log("exist");
						response.remarks = "Group name is already exist!";
						res.end(JSON.stringify(response, null, 2));
					}
				});

			} else {
				response.remarks = "Invalid token!";
				res.end(JSON.stringify(response, null, 2));
			}

		}

	});
	
}


//pull details
exports.GetGroup = function(res, params) { 

	res.setHeader('Content-Type', 'text/plain');
	console.log("GetGroup ... \n\n");  
	var response = {};
	response.status = 0;
	//validate user token
	var check_sql = "SELECT * FROM user WHERE user_id='"+params.user_id+"' AND token='"+params.token+"' AND type=1";
	var get_sql ="SELECT * FROM screen_group WHERE  user_id='"+params.user_id+"'";
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

exports.ScreenTodo = function(socket, screen_id) { 

	console.log("ScreenTodo ... \n\n");  
	
	var get_sql ="SELECT reset FROM screen WHERE  screen_id='"+screen_id+"'";
	var action = "none";
	DBconnect.query(get_sql, function(error, _rows) {
		if(!error) {
			if(_rows.length > 0) {

				if(_rows[0].reset == 1) {
					action ="reset";
				}

				var update_sql = 'UPDATE screen SET reset=0 WHERE screen_id = ' + screen_id;
						DBconnect.query(update_sql, function(error, _rows) {
							socket.emit('screentodo', { action: action});
						});
				
			}
			
		} else {

			console.log(error);
		}
	
	});
}