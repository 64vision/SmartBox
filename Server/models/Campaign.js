var config =  require('../config/config');
var mysql = require('mysql');
var md5 = require('md5');
var DBconnect  = config.DBconnect(mysql);


exports.Add = function(res, params) {
	res.setHeader('Content-Type', 'text/plain');
	console.log("Adding campaign ... \n\n");  
	var response = {};
	response.status = 0;
	//validate user token
	var check_sql = "SELECT * FROM user WHERE user_id='"+params.user_id+"' AND token='"+params.token+"' AND type=1";
	params.campaign[0].user_id = params.user_id;
	params.campaign[0].status = 1;
	var data =params.campaign[0];
	//console.log(data);
	DBconnect.query(check_sql, function(err, row) {
		if(!err) {
			if(row.length > 0) {
				response.status = 1;
				//Insert new company
				DBconnect.query('INSERT INTO campaign SET ?', data, function(error, _rows) {
					if(!error) {
						response.remarks = "New campaign was added!";
						response.campaign_id = _rows.insertId;
						response.campaign = data;
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
	console.log("Adding campaign item ... \n\n");  
	var response = {};
	response.status = 0;
	//validate user token
	var check_sql = "SELECT * FROM user WHERE user_id='"+params.user_id+"' AND token='"+params.token+"' AND type=1";
	var data =params.campaign[0];
	console.log(data);
	DBconnect.query(check_sql, function(err, row) {
		if(!err) {
			if(row.length > 0) {
				response.status = 1;
				//Insert new company
				DBconnect.query('INSERT INTO campaign_item SET ?', data, function(error, _rows) {
					if(!error) {
						response.remarks = "New item was added!";
						response.campaign_id = _rows.insertId;
						response.campaign = data;
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
	console.log("Pull campaigns ... \n\n");  
	var response = {};
	response.status = 0;
	//validate user token
	var check_sql = "SELECT * FROM user WHERE user_id='"+params.user_id+"' AND token='"+params.token+"' AND type=1";
	var get_sql ="SELECT * FROM campaign WHERE user_id='"+params.user_id+"' AND status > 0";
	DBconnect.query(check_sql, function(err, row) {
		//console.log(row);
		if(!err) {
			if(row.length > 0) {
				response.status = 1;
				//pull companies
				DBconnect.query(get_sql, function(error, _rows) {
					if(!error) {
						response.remarks = "Successfull!";
						response.campaigns = _rows;
					} else {

						console.log("Pull campaigns");
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


exports.Media = function(res, params) { 

	res.setHeader('Content-Type', 'text/plain');
	console.log("Media campaigns items ... \n\n");  
	var response = {};
	response.status = 0;
	//validate user token
	var get_sql = "SELECT c.campaign_id as campaign_id, c.media_id as media_id, c.media_name as media_name, m.type as type  FROM campaign_item c LEFT JOIN media m  ON m.media_id = c.media_id WHERE c.campaign_id='"+params.campaign_id+"'";
	//var get_sql ="SELECT * FROM campaign_item WHERE campaign_id='"+params.campaign_id+"'";
	DBconnect.query(get_sql, function(err, row) {
		//console.log(row);
		if(!err) {
			if(row.length > 0) {
				response.status = 1;
				response.remarks = "Successfull!";
				response.medias = row;
				

			} else {
				response.remarks = "Invalid token!";
				
			}

		} else {
			console.log(err);
		}
		res.end(JSON.stringify(response, null, 2));
	});

}


exports.GetItems = function(res, params) { 

	res.setHeader('Content-Type', 'text/plain');
	console.log("Pull campaigns items ... \n\n");  
	var response = {};
	response.status = 0;
	//validate user token
	var check_sql = "SELECT * FROM user WHERE user_id='"+params.user_id+"' AND token='"+params.token+"' AND type=1";
	var get_sql ="SELECT * FROM campaign_item WHERE campaign_id='"+params.campaign_id+"'";
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

						console.log("Pull campaign items");
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
	console.log("Remove campaigns item ... \n");  
	var response = {};
	response.status = 0;
	//validate user token
	var check_sql = "SELECT * FROM user WHERE user_id='"+params.user_id+"' AND token='"+params.token+"' AND type=1";
	var get_sql ="DELETE FROM campaign_item WHERE item_id='"+params.item_id+"'";
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

						console.log("Remove campaign item");
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




