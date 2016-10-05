var HTTP = (function (obj) {
	obj.Ping = function(url, callback) {
	  var xhr = new XMLHttpRequest();

	  var noResponseTimer = setTimeout(function() {
	    xhr.abort();
	  }, 1000);

	  xhr.onreadystatechange = function() {
	    if (xhr.readyState != 4) {
	      return;
	    }

	    if (xhr.status == 200) {
	      clearTimeout(noResponseTimer);
	      callback(true);
	    }
	    else {
	        callback(false);
	        return;
	    }
	  };
	  xhr.open("GET", url);
	  xhr.send();
	};


	return obj;
}(HTTP || {}));
/*
	ISSP server Request
*/
var Request = (function (obj) {
	obj.Zones = function(url, callback) {
		var params = {};
		params.template_id = Global.templateID;
		$.post(url, params, function(res) {
			callback(res);
			return;
		});
		
	};

	obj.Validate = function(url, key, callback) {
		var params = {};
		params.license_key = key;
		$.post(url, params, function(res) {
			callback(res);
			return;
		});
		
	};

	obj.Assets = function(url, campaign_id, timeslot, zonename, callback) {
		var params = {};
		params.campaign_id = campaign_id;
		$.post(url, params, function(res) {
			callback(res,timeslot, zonename);
			return;
		});
		
	};
	obj.Pushlog = function(params) {
		console.log('pushlog');
		/*$.post(url, params, function(res) {
			//callback(res,timeslot, zonename);
			//return;
		});*/
		
	};

	obj.ZonePlayTime = function(zone_name, callback) {


		todoDB.searchTodo('assetTable', zone_name, function(res) { 
			callback(res);
		});
		//return "time to play";

	};
	return obj;
}(Request || {}));