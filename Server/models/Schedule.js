var config =  require('../config/config');
var mysql = require('mysql');
var md5 = require('md5');
var DBconnect  = config.DBconnect(mysql);


exports.Add = function(res, params) {
	res.setHeader('Content-Type', 'text/plain');
	console.log("Adding schedule item ... \n\n");  
	var response = {};
	response.status = 0;
	//validate user token
	var check_sql = "SELECT * FROM user WHERE user_id='"+params.user_id+"' AND token='"+params.token+"' AND type=1";
	var data =params.schedule[0];
		data.user_id = params.user_id;
	DBconnect.query(check_sql, function(err, row) {
		if(!err) {
			if(row.length > 0) {
				response.status = 1;
				//Insert new company
				DBconnect.query('INSERT INTO schedule SET ?', data, function(error, _rows) {
					if(!error) {
						response.remarks = "New item was added!";
						response.schedule_id = _rows.insertId;
						response.schedule = data;
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

exports.AddItem = function(res, params) {
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
				DBconnect.query('INSERT INTO schedule_item SET ?', data, function(error, _rows) {
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



//
exports.Delete = function() {
	return "Delete User";

}
exports.Update = function() {
	return "Update User";

}

//pull details
exports.Get = function(res, params) { 

	res.setHeader('Content-Type', 'text/plain');
	console.log("Pull schedules ... \n\n");  
	var response = {};
	response.status = 0;
	//validate user token
	var check_sql = "SELECT * FROM user WHERE user_id='"+params.user_id+"' AND token='"+params.token+"' AND type=1";
	var get_sql ="SELECT * FROM schedule WHERE user_id='"+params.user_id+"'";
	DBconnect.query(check_sql, function(err, row) {
		//console.log(row);
		if(!err) {
			if(row.length > 0) {
				response.status = 1;
				//pull companies
				DBconnect.query(get_sql, function(error, _rows) {
					if(!error) {
						response.remarks = "Successfull!";
						response.schedules = _rows;
					} else {

						console.log("errr Pull schedules");
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
	var get_sql ="SELECT * FROM schedule_item WHERE schedule_id='"+params.schedule_id+"'";
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
	console.log("Remove schedule item ... \n");  
	var response = {};
	response.status = 0;
	//validate user token
	var check_sql = "SELECT * FROM user WHERE user_id='"+params.user_id+"' AND token='"+params.token+"' AND type=1";
	var get_sql ="DELETE FROM schedule_item WHERE item_id='"+params.item_id+"'";
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

						console.log("Remove schedule item");
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




