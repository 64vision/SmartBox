var config =  require('../config/config');
var mysql = require('mysql');
var md5 = require('md5');
var DBconnect  = config.DBconnect(mysql);


exports.Add = function(res, params) {
	res.setHeader('Content-Type', 'text/plain');
	console.log("Calling addUser ... \n\n");  
	var response = {};
	response.status = 0;
	var password = md5(params.password);
	var sql = "INSERT INTO user (username, password, fullname, contact_number, email, type) VALUES ('"+params.email+"', '"+password+"', '"+params.fullname+"', '"+params.contact_number+"', '"+params.email+"', '"+params.type+"')";
	var check_sql = "SELECT * FROM user WHERE email='"+params.email+"'";
	DBconnect.query(check_sql, function(err, rows) {
		console.log("validating user.. ... \n\n");  
		if(rows.length > 0) {
			response.status = 1;
			response.remarks = "Email already exist!";

			  res.end(JSON.stringify(response, null, 2))
		} else {

			DBconnect.query(sql, function(error, _rows) {
				console.log("saving user.. ... \n\n"); 2
				if(!error) {
						response.status = 1;
						response.remarks = "New user Added!";
						response.user_id = _rows.insertId;
						response.userdata = _rows;
				} else {
					response.remarks = "Can't save user!";

				}
				res.end(JSON.stringify(response, null, 2))	

			});
			
		}

	});
}

exports.Login =function(res, params) {

	res.setHeader('Content-Type', 'text/plain');
	console.log(params);
	var response = {};
	response.status = 0;
	var password = md5(params.password);
	console.log("Pawwsord: " + password);
	var sql = "SELECT * FROM user WHERE username='"+params.username+"' AND password='"+password+"'";
	DBconnect.query(sql, function(error, rows) {
		if(!error) {
			if(rows.length > 0) {
				response.status = 1;
				response.remarks = "Login Successfull!";
				response.token = TokenGen(rows[0]);
				response.userdata = rows;
			} else {

				response.remarks = "User not found!";
			}
		} else {
			console.log(error);
		} 

		res.end(JSON.stringify(response, null, 2))	

	});
	
}

exports.Validate =function(res, params) {

	res.setHeader('Content-Type', 'text/plain');
	var response = {};
	response.status = 0;
	var password = md5(params.password);
	params.password = password;
	var checksql = "SELECT * FROM user WHERE username='"+params.username+"'";
	var loginsql = "SELECT * FROM user WHERE username='"+params.username+"' AND password='"+password+"' AND status=1";
	DBconnect.query(checksql, function(error, rows) {
		if(!error) {
			
			if(rows.length > 0) {
				response.status = 101;
				response.remarks = "User found!";
			} else {
				response.status = 102;
				response.remarks = "Create user!";
			}
			
		} 
		
		res.end(JSON.stringify(response, null, 2));	
	});
	
}


exports.Create =function(res, params) {
	res.setHeader('Content-Type', 'text/plain');
	var response = {};
	response.status = 0;
	var password = md5(params.password);
	params.password = password;
	params.subscription = 1;
	params.type = 1;
	//params.status = 1;
	DBconnect.query('INSERT INTO user SET ?', params, function(error, rows) {
					if(!error) {
						response.status = 1;
						response.remarks = "New registered user";
						response.userdata = rows;
					
					} else {
						console.log(error);

					}
				
		res.end(JSON.stringify(response, null, 2));	
	});
	
}


exports.Storage =function(res, params) {

	res.setHeader('Content-Type', 'text/plain');
	console.log("User Storage ... \n\n");  
	var response = {};
	response.status = 0;

	var get_sql ="SELECT sum(size) as totalsize FROM media WHERE status > 0 AND user_id='"+params.user_id+"'";
	DBconnect.query(get_sql, function(error, _rows) {
		if(!error) {
			response.status = 1;
			response.remarks = "Successful!";
			response.user = _rows;
		} else {
			console.log("Error license validation");
		}
		res.end(JSON.stringify(response, null, 2));
	});

	
}




//
exports.Delete = function() {
	return "Delete User";

}
exports.Update = function() {
	return "Update User";

}

//
function TokenGen(param) {
	var token = md5(new Date() + param.username);
	var sql = "UPDATE user SET token='"+token+"' WHERE  user_id='"+param.user_id+"'";

	DBconnect.query(sql, function(error, rows) {
		if(error) throw error;

		
	});
	return token;
}


//pull details
exports.Get = function(res, params) { 

	res.setHeader('Content-Type', 'text/plain');
	console.log("Pull user ... \n\n");  
	var response = {};
	response.status = 0;
	//validate user token
	var check_sql = "SELECT * FROM user WHERE user_id='"+params.user_id+"' AND token='"+params.token+"' AND type=1";
	var get_sql ="SELECT * FROM user WHERE status > 0";
	DBconnect.query(check_sql, function(err, row) {
		//console.log(row);
		if(!err) {
			if(row.length > 0) {
				response.status = 1;
				//pull companies
				DBconnect.query(get_sql, function(error, _rows) {
					if(!error) {
						response.remarks = "Successfull!";
						response.users = _rows;
					} else {

						console.log("Pull user error");
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

exports.GetSummary = function(res, params) { 

	res.setHeader('Content-Type', 'text/plain');
	console.log("GetSummary ... \n\n");  
	var response = {};
	response.status = 0;
	//validate user token
	var check_sql = "SELECT * FROM user WHERE user_id='"+params.user_id+"' AND token='"+params.token+"'";
	var get_sql ="SELECT count(*) as views, DATE(logdate) as log FROM media_logs l LEFT JOIN media m  ON  m.media_id=l.media_id WHERE m.user_id='"+params.user_id+"'  GROUP BY log";
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

						console.log("Pull user error");
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


