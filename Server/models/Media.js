var config =  require('../config/config');
var mysql = require('mysql');
var md5 = require('md5');
var DBconnect  = config.DBconnect(mysql);


exports.Add = function(res, params) {
	res.setHeader('Content-Type', 'text/plain');
	console.log("Adding Media ... \n\n");  
	var response = {};
	response.status = 0;
	//validate user token
	var check_sql = "SELECT * FROM user WHERE user_id='"+params.user_id+"' AND token='"+params.token+"' AND type=1";
	params.media[0].user_id = params.user_id;
	params.media[0].status = 1;
	var newdata =params.media[0];
	DBconnect.query(check_sql, function(err, row) {
		if(!err) {
			if(row.length > 0) {
				response.status = 1;
				//Insert new company
				DBconnect.query('INSERT INTO media SET ?', newdata, function(error, _rows) {
					if(!error) {
						response.remarks = "New media was added!";
						response.media_id = _rows.insertId;
						response.media = newdata;
						console.log("New media added...");
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

exports.PushLog = function(res, params) { 
	res.setHeader('Content-Type', 'text/plain');
	console.log("Push log ... \n\n"); 
	var response = {};
	response.status = 1;
		var logdata  = params.split(','); 

		if(logdata.length > 0) {
				for (var i = 0; i < logdata.length; i++ ) {
					var log = logdata[i].split('/');
					var newdata = {};

					if(log.length == 5) {
						newdata.media_id = log[0];
						newdata.schedule_id = log[1];
						newdata.campaign_id = log[2];
						newdata.screen_id = log[3];
						newdata.logdate = log[4];
						DBconnect.query('INSERT INTO media_logs SET ?', newdata, function(error, _rows) {
							if(!error) {
								response.remarks = "New log was added!";
								response.media_id = _rows.insertId;
								response.media = newdata;
								console.log("New log added...");
							} else {
								console.log(error);

							}
						
						});
					}

				}
		}
	res.end(JSON.stringify(response, null, 2));
}


exports.Log = function(res, params) { 
	res.setHeader('Content-Type', 'text/plain');
	console.log("Push log ..."); 
	var response = {};

	DBconnect.query('INSERT INTO media_logs SET ?', params, function(error, _rows) {});
	res.end(JSON.stringify(response, null, 2));
}



//
exports.GetCampaign = function(res, params) {
	res.setHeader('Content-Type', 'text/plain');
	console.log("GetOverAll  ... \n\n"); 
	var response = {};
	response.status = 0;
	var check_sql = "SELECT * FROM user WHERE user_id='"+params.user_id+"' AND token='"+params.token+"' AND type=1";
	var get_sql ="SELECT m.media_id, m.campaign_id, c.name FROM media_logs m LEFT JOIN campaign c ON m.campaign_id=c.campaign_id WHERE m.media_id='"+params.media_id+"' GROUP BY m.campaign_id";
	DBconnect.query(check_sql, function(err, row) {
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

exports.GetScreen = function(res, params) {
	res.setHeader('Content-Type', 'text/plain');
	console.log("GetScreen  ... \n"); 
	var response = {};
	response.status = 0;
	var check_sql = "SELECT * FROM user WHERE user_id='"+params.user_id+"' AND token='"+params.token+"' AND type=1";
	var get_sql ="SELECT m.media_id, m.screen_id, s.name FROM media_logs m LEFT JOIN screen s ON m.screen_id=s.screen_id WHERE m.media_id='"+params.media_id+"' GROUP BY m.screen_id";
	DBconnect.query(check_sql, function(err, row) {
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


exports.GetSchedule = function(res, params) {
	res.setHeader('Content-Type', 'text/plain');
	console.log("GetSchedule  ... \n"); 
	var response = {};
	response.status = 0;
	var check_sql = "SELECT * FROM user WHERE user_id='"+params.user_id+"' AND token='"+params.token+"' AND type=1";
	var get_sql ="SELECT m.media_id, m.schedule_id, s.name FROM media_logs m LEFT JOIN schedule s ON m.schedule_id=s.schedule_id WHERE m.media_id='"+params.media_id+"' GROUP BY m.schedule_id";
	DBconnect.query(check_sql, function(err, row) {
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



exports.GetViews = function(res, params) {
	res.setHeader('Content-Type', 'text/plain');
	console.log("GetViews  ... \n"); 
	var response = {};
	response.status = 0;
	var check_sql = "SELECT * FROM user WHERE user_id='"+params.user_id+"' AND token='"+params.token+"' AND type=1";
	var get_sql ="SELECT count(*) as views FROM media_logs WHERE media_id='"+params.media_id+"'";
	DBconnect.query(check_sql, function(err, row) {
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


exports.GetStats = function(res, params) {
	res.setHeader('Content-Type', 'text/plain');
	console.log("GetStats  ... \n"); 
	var response = {};
	response.status = 0;
	var check_sql = "SELECT * FROM user WHERE user_id='"+params.user_id+"' AND token='"+params.token+"' AND type=1";
	var get_sql ="SELECT count(*) as views, DATE(logdate) as log FROM media_logs WHERE media_id='"+params.media_id+"' GROUP BY log";
	DBconnect.query(check_sql, function(err, row) {
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

exports.Remove = function(res, params) {
	res.setHeader('Content-Type', 'text/plain');
	console.log("Removing Media... \n\n");  
	var response = {};
	response.status = 0;

	var data = {};
	data.status =  0;// removed status
	var update_sql = 'UPDATE media SET ?  WHERE media_id = ' + params.item_id;
	DBconnect.query(update_sql,  [data], function(error, _rows) {
		if(!error) {
			response.status = 1;
			console.log("Successfull media remove");
			
		} else {
			console.log(error);
			console.log("Error screen update");
		}
		res.end(JSON.stringify(response, null, 2));
	});

}

exports.Update = function(res, params) {
	res.setHeader('Content-Type', 'text/plain');
	console.log("Updating Media... \n\n");  
	var response = {};
	response.status = 0;
	var check_sql = "SELECT * FROM user WHERE user_id='"+params.user_id+"' AND token='"+params.token+"' AND type=1";
	
	DBconnect.query(check_sql, function(err, row) {
		if(err) {
			response.remarks = "Invalid token!";
			res.end(JSON.stringify(response, null, 2));
		}

	});
	var newdata =params.media[0];
	var update_sql = 'UPDATE media SET ?  WHERE media_id = ' + params.item_id;
	DBconnect.query(update_sql,  newdata, function(error, _rows) {
		if(!error) {
			response.status = 1;
			console.log("Successfull media updated");
			
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
	console.log("Pull medias 123... \n\n");  
	var response = {};
	response.status = 0;
	//validate user token
	var check_sql = "SELECT * FROM user WHERE user_id='"+params.user_id+"' AND token='"+params.token+"' AND type=1";
	var get_sql ="SELECT * FROM media WHERE status=1 AND user_id="+params.user_id ;
	DBconnect.query(check_sql, function(err, row) {
		//console.log(row);
		if(!err) {
			if(row.length > 0) {
				response.status = 1;
				//pull companies
				DBconnect.query(get_sql, function(error, _rows) {
					if(!error) {
						response.remarks = "Successfull!";
						response.medias = _rows;
					} else {

						console.log("ERROR Pull medias");
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



exports.GetAds = function(res, params) { 

	res.setHeader('Content-Type', 'text/plain');
	console.log("Pull medias 123... \n\n");  
	var response = {};
	response.status = 0;
	//validate user token
	//var check_sql = "SELECT * FROM user WHERE user_id='"+params.user_id+"' AND token='"+params.token+"' AND type=1";
	var get_sql ="SELECT * FROM media WHERE status=1 AND user_id="+params.user_id ;
	DBconnect.query(get_sql, function(error, _rows) {
		if(!error) {
			response.remarks = "Successfull!";
			response.medias = _rows;
		} else {

			console.log("ERROR Pull medias");
		}
		res.end(JSON.stringify(response, null, 2));
	});

}

exports.MediaAds = function(res, params) { 

	res.setHeader('Content-Type', 'text/plain');
	console.log("Pull MediaAds..");  
	var response = {};
	response.status = 0;
	//console.log(params.user_id);
	//validate user token
	//var check_sql = "SELECT * FROM user WHERE user_id='"+params.user_id+"' AND token='"+params.token+"' AND type=1";
	var get_sql ="SELECT * FROM media WHERE status=1 AND type='videoads' AND user_id="+params.user_id ;
	DBconnect.query(get_sql, function(error, _rows) {
		if(!error) {
			response.status = 1;
			response.remarks = "Successfull!";
			response.medias = _rows;
		} else {

			console.log("ERROR Pull medias");
		}
		res.end(JSON.stringify(response, null, 2));
	});

}

exports.SaveToken = function(res, params) {
	res.setHeader('Content-Type', 'text/plain');
	console.log("Adding stream token ... \n\n");  
	var response = {};
	response.status = 0;
	//validate user token
	var newdata =params;
	DBconnect.query('INSERT INTO streamtoken SET ?', newdata, function(error, _rows) {
			if(!error) {
				response.remarks = "New stream init was added!";
				response.media_id = _rows.insertId;
				response.media = newdata;
				console.log("New media added...");
			} else {
				console.log(error);

			}
			res.end(JSON.stringify(response, null, 2));	
	});
	
}

exports.GetToken = function(res, params) { 

	res.setHeader('Content-Type', 'text/plain');
	console.log("GetToken ... \n\n");  
	var response = {};
	response.status = 0;
	//validate user token
	//var check_sql = "SELECT * FROM user WHERE user_id='"+params.user_id+"' AND token='"+params.token+"' AND type=1";
	var get_sql ="SELECT * FROM streamtoken ORDER BY id DESC LIMIT 1 ";
	DBconnect.query(get_sql, function(error, _rows) {
		if(!error) {
			response.remarks = "Successfull!";
			response.stream = _rows;
		} else {

			console.log("Pull medias");
		}
		res.end(JSON.stringify(response, null, 2));
	});

}