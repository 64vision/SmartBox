var config =  require('../config/config');
var mysql = require('mysql');
var md5 = require('md5');
var DBconnect  = config.DBconnect(mysql);

//pull details
exports.Get = function(res, params) { 

	res.setHeader('Content-Type', 'text/plain');
	console.log("Pull Sites ... \n\n");  
	var response = {};
	response.status = 0;
	//validate user token
	var check_sql = "SELECT * FROM user WHERE user_id='"+params.user_id+"' AND token='"+params.token+"' AND type=1";
	var get_sql ="SELECT * FROM onboard_site WHERE user_id='"+params.user_id+"' AND status > 0";
	DBconnect.query(check_sql, function(err, row) {
		//console.log(row);
		if(!err)  {
			if(row.length > 0) {
				response.status = 1;
				//pull companies
				DBconnect.query(get_sql, function(error, _rows) {
					if(!error) {
						response.remarks = "Successfull!";
						response.sites = _rows;
					} else {

						console.log("Pull Sites");
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


exports.Getsite = function(res, params) { 
	res.setHeader('Content-Type', 'text/plain');
	console.log("Pull Sites ... \n\n");  
	var response = {};
	response.status = 0;
	//validate user token
	var check_sql = "SELECT * FROM user WHERE user_id='"+params.user_id+"' AND token='"+params.token+"' AND type=1";
	var get_sql ="SELECT * FROM onboard_site WHERE site_id='"+params.site_id+"' AND status > 0";
	DBconnect.query(check_sql, function(err, row) {
		//console.log(row);
		if(!err)  {
			if(row.length > 0) {
				response.status = 1;
				//pull companies
				DBconnect.query(get_sql, function(error, _rows) {
					if(!error) {
						response.remarks = "Successfull!";
						response.sites = _rows;
					} else {

						console.log("Pull Sites");
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

exports.GetCategory = function(res, params) { 
	res.setHeader('Content-Type', 'text/plain');
	console.log("Pull Sites ... \n\n");  
	var response = {};
	response.status = 0;
	//validate user token
	var check_sql = "SELECT * FROM user WHERE user_id='"+params.user_id+"' AND token='"+params.token+"' AND type=1";
	var get_sql = 'SELECT c1.cat_id, c1.name, c2.cat_id as sub_id, c2.name as sub_name FROM onboard_category c1 LEFT JOIN  onboard_category c2 ON c2.parent= c1.cat_id WHERE c1.parent= 0 AND c1.site_id=' + params.site_id;
	DBconnect.query(check_sql, function(err, row) {
		//console.log(row);
		if(!err)  {
			if(row.length > 0) {
				response.status = 1;
				//pull companies
				DBconnect.query(get_sql, function(error, _rows) {
					if(!error) {
						response.remarks = "Successfull!";
						response.categories = _rows;
					} else {

						console.log("Pull Sites");
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


exports.SiteCategories = function(res, params) { 
	res.setHeader('Content-Type', 'text/plain');
	console.log("Pull Sites ... \n\n");  
	var response = {};
	response.status = 0;
	var get_sql = 'SELECT oc.* FROM `onboard_category` oc left join onboard_site os on os.site_id = oc.site_id WHERE os.site_key="'+params.site+'"';
	DBconnect.query(get_sql, function(error, _rows) {
					if(!error) {
						response.status = 1;
						response.hash = md5(JSON.stringify(_rows));
						response.remarks = "Successfull!";
						response.categories = _rows;
						//console.log(_rows);
					} else {

						console.log("Pull categories");
					}
					res.end(JSON.stringify(response, null, 2));
	});
}


exports.CatRelation = function(res, params) { 
	res.setHeader('Content-Type', 'text/plain');
	console.log("Pull Sites ... \n\n");  
	var response = {};
	response.status = 0;
	var get_sql = 'SELECT cm.* FROM `onboard_cat_media` cm LEFT JOIN onboard_category oc ON oc.cat_id=cm.cat_id LEFT JOIN onboard_site os ON oc.site_id=os.site_id WHERE os.site_key="'+params.site+'"';
	DBconnect.query(get_sql, function(error, _rows) {
					if(!error) {
						response.status = 1;
						response.hash = md5(JSON.stringify(_rows));
						response.remarks = "Successfull!";
						response.relation = _rows;
						//console.log(_rows);
					} else {

						console.log("Pull categories");
					}
					res.end(JSON.stringify(response, null, 2));
	});
}


exports.SiteMedias = function(res, params) { 
	res.setHeader('Content-Type', 'text/plain');
	console.log("Pull medias ... \n\n");  
	var response = {};
	response.status = 0;
	var get_sql = 'SELECT oc.* FROM `onboard_media` oc left join onboard_site os on os.site_id = oc.site_id WHERE oc.status=1 AND os.site_key="'+params.site+'"';
	DBconnect.query(get_sql, function(error, _rows) {
					if(!error) {
						response.status = 1;
						response.hash = md5(JSON.stringify(_rows));
						response.remarks = "Successfull!";
						response.medias = _rows;
						//console.log(_rows);
					} else {

						console.log("Pull media");
					}
					res.end(JSON.stringify(response, null, 2));
			

	});

}


exports.Add = function(res, params) {
	res.setHeader('Content-Type', 'text/plain');
	console.log("Adding Site t1 ...");  
	var response = {};
	response.status = 0;
	//console.log(params);
	//validate user token
	var check_sql = "SELECT * FROM user WHERE user_id='"+params.user_id+"' AND token='"+params.token+"' AND type=1";
	var screendata =params.site[0];
	screendata.status = 1;
	screendata.user_id = params.user_id;
	console.log(screendata);
	DBconnect.query(check_sql, function(err, row) {
		if(!err) {
			if(row.length > 0) {
				response.status = 1;
				//Insert new company
				DBconnect.query('INSERT INTO onboard_site SET ?', screendata, function(error, _rows) {
					if(!error) {
						response.remarks = "New site was added!";
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


exports.AddLog = function(res, params) {
	res.setHeader('Content-Type', 'text/plain');
	console.log("Adding log ...");  
	var response = {};
	response.status = 0;
	var update_sql = 'UPDATE onboard_media SET views=views+1  WHERE media_id=' + params.media_id;
	DBconnect.query('INSERT INTO onboard_media_logs SET ?', params, function(error, _rows) {
			DBconnect.query(update_sql, function(err, row) {
				
			});
			res.end(JSON.stringify(response, null, 2));
	});
}






exports.Update = function(res, params) {
	res.setHeader('Content-Type', 'text/plain');
	console.log("Update t1 ...");  
	var response = {};
	response.status = 0;
	var data = params.site[0];
	//data.logo =  params.logo;
	console.log(data);
	var check_sql = "SELECT * FROM user WHERE user_id='"+params.user_id+"' AND token='"+params.token+"' AND type=1";
	var update_sql = 'UPDATE onboard_site SET ?  WHERE site_id = ' + params.site_id;
	DBconnect.query(check_sql, function(err, row) {
		if(!err) {
			if(row.length > 0) {
				//response.status = 1;
				//Insert new company
				DBconnect.query(update_sql,  [data], function(error, _rows) {
					if(!error) {
						response.status = 1;
						response.remarks = "updated";
						//console.log("Success screen tempate  update");
						
					} else {
						console.log(error);
						console.log("Error screen update");
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

exports.AddCategory = function(res, params) {
	res.setHeader('Content-Type', 'text/plain');
	console.log("Adding Category t1 ...");  
	var response = {};
	response.status = 0;
	var check_sql = "SELECT * FROM user WHERE user_id='"+params.user_id+"' AND token='"+params.token+"' AND type=1";
	var screendata =params.category[0];
	screendata.status = 1;
	screendata.user_id = params.user_id;
	console.log(screendata);
	DBconnect.query(check_sql, function(err, row) {
		if(!err) {
			if(row.length > 0) {
				
				//Insert new company
				DBconnect.query('INSERT INTO onboard_category SET ?', screendata, function(error, _rows) {
					if(!error) {
						response.status = 1;
						response.remarks = "New category was added!";
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


exports.AddMedia = function(res, params) {
	res.setHeader('Content-Type', 'text/plain');
	console.log("AAddMediat1 ...");  
	var response = {};
	response.status = 0;
	var check_sql = "SELECT * FROM user WHERE user_id='"+params.user_id+"' AND token='"+params.token+"' AND type=1";
	var screendata =params.media[0];
	screendata.status = 1;
	screendata.user_id = params.user_id;
	var categories = screendata.categories;
	DBconnect.query(check_sql, function(err, row) {
		if(!err) {
			if(row.length > 0) {
				
				//Insert new company
				DBconnect.query('INSERT INTO onboard_media SET ?', screendata, function(error, _rows) {
					if(!error) {
						response.status = 1;
						response.remarks = "New media was added!";
						response.media_id = _rows.insertId;
						for(var i=0;i < categories.length;i++) {
								var _data = {};
								_data.media_id = _rows.insertId;
								_data.cat_id = categories[i];
								if(categories[i] > 0)
									assignCat(_data);
						}
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

function assignCat(screendata) {
	DBconnect.query('INSERT INTO onboard_cat_media SET ?', screendata, function(error, _rows) { });
}

exports.UpdateMedia = function(res, params) {
	res.setHeader('Content-Type', 'text/plain');
	console.log("Update t1 ...");  
	var response = {};
	response.status = 0;
	var data = params.media[0];
	//data.logo =  params.logo;
	console.log(data);
	var check_sql = "SELECT * FROM user WHERE user_id='"+params.user_id+"' AND token='"+params.token+"' AND type=1";
	var update_sql = 'UPDATE onboard_media SET ?  WHERE media_id = ' + params.media_id;
	DBconnect.query(check_sql, function(err, row) {
		if(!err) {
			if(row.length > 0) {
				//response.status = 1;
				//Insert new company
				DBconnect.query(update_sql,  [data], function(error, _rows) {
					if(!error) {
						response.status = 1;
						response.remarks = "updated";
						//console.log("Success screen tempate  update");
						
					} else {
						console.log(error);
						console.log("Error screen update");
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

exports.GetMedia = function(res, params) { 
	res.setHeader('Content-Type', 'text/plain');
	console.log("GetMedia Sites ... \n\n");  
	var response = {};
	response.status = 0;
	//validate user token
	var check_sql = "SELECT * FROM user WHERE user_id='"+params.user_id+"' AND token='"+params.token+"' AND type=1";
	var get_sql = 'SELECT * FROM onboard_media WHERE status=1 AND site_id=' + params.site_id;
	DBconnect.query(check_sql, function(err, row) {
		//console.log(row);
		if(!err)  {
			if(row.length > 0) {
				response.status = 1;
				//pull companies
				DBconnect.query(get_sql, function(error, _rows) {
					if(!error) {
						response.remarks = "Successfull!";
						response.media = _rows;
					} else {

						console.log("Pull Sites");
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
