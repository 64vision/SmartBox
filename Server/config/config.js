
//Database data
exports.DBconnect = function(mysql) {

	var DBconnect  = mysql.createConnection({
	  host     : 'localhost',
	  user     : 'root',
	  password : 'root',
	  database : 'issp',
	  //socketPath: '/Applications/MAMP/tmp/mysql/mysql.sock'
	});
	return DBconnect;
}

