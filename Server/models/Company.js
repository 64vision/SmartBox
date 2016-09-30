var config =  require('../config/config');
var mysql = require('mysql');
var md5 = require('md5');
var DBconnect  = config.DBconnect(mysql);


exports.Add = function(res, params) {
	res.setHeader('Content-Type', 'text/plain');
	console.log("Adding company ... \n\n");  
	var response = {};
	response.status = 0;
	//validate user token
	var check_sql = "SELECT * FROM user WHERE user_id='"+params.user_id+"' AND token='"+params.token+"' AND type=1";
	var companydata =params.company[0];
	DBconnect.query(check_sql, function(err, row) {
		if(!err) {
			if(row.length > 0) {
				response.status = 1;
				//Insert new company
				DBconnect.query('INSERT INTO company SET ?', companydata, function(error, _rows) {
					if(!error) {
						response.remarks = "New company was added!";
						response.company_id = _rows.insertId;
						response.company = companydata;
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
	console.log("Pull companies ... \n\n");  
	var response = {};
	response.status = 0;
	//validate user token
	var check_sql = "SELECT * FROM user WHERE user_id='"+params.user_id+"' AND token='"+params.token+"' AND type=1";
	var get_sql ="SELECT * FROM company WHERE user_id='"+params.user_id+"' AND status > 0";
	DBconnect.query(check_sql, function(err, row) {
		//console.log(row);
		if(!err) {
			if(row.length > 0) {
				response.status = 1;
				//pull companies
				DBconnect.query(get_sql, function(error, _rows) {
					if(!error) {
						response.remarks = "Successfull!";
						response.companies = _rows;
					} else {

						console.log("Pull companies");
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
