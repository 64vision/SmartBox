var config =  require('../config/config');
var mysql = require('mysql');
var md5 = require('md5');
var DBconnect  = config.DBconnect(mysql);


exports.Add = function(res, params) {
	res.setHeader('Content-Type', 'text/plain');
	console.log("Adding category ... \n\n");  
	var response = {};
	response.status = 0;
	//validate user token
	var check_sql = "SELECT * FROM user WHERE user_id='"+params.user_id+"' AND token='"+params.token+"' AND type=1";
	var newdata =params.category[0];
	DBconnect.query(check_sql, function(err, row) {
		if(!err) {
			if(row.length > 0) {
				response.status = 1;
				//Insert new company
				DBconnect.query('INSERT INTO category SET ?', newdata, function(error, _rows) {
					if(!error) {
						response.remarks = "New category was added!";
						response.category_id = _rows.insertId;
						response.category = newdata;
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
	console.log("Pull category ... \n\n");  
	var response = {};
	response.status = 0;
	//validate user token
	var check_sql = "SELECT * FROM user WHERE user_id='"+params.user_id+"' AND token='"+params.token+"' AND type=1";
	var get_sql ="SELECT * FROM category WHERE company_id="+params.company_id;
	DBconnect.query(check_sql, function(err, row) {
		//console.log(row);
		if(!err) {
			if(row.length > 0) {
				response.status = 1;
				//pull companies
				DBconnect.query(get_sql, function(error, _rows) {
					if(!error) {
						response.remarks = "Successfull!";
						response.categories = _rows;
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
