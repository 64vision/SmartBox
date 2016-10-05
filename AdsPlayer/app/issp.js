var ISSP = (function (obj) {
	obj.check_network_state = function () {
		HTTP.Ping(Global.server, function(res) {
			Global.isOnline = res;
			return res;
		});
	};

	obj.Validate = function () {
		if(Global.screenID)
			return true;
		else 
			return false;
	};

	obj.ValidateKey = function(key, callback) {
		Request.Validate(Global.server + 'screen/validatekey', key, function(res) { 
			//console.log(res);
			var obj = JSON.parse(res);
			if(obj.status > 0) {
				Global.licenseKey = key;
				Global.templateID = obj.screen[0].template;
				Global.screenObj = obj.screen[0];
				Global.screenID =  obj.screen[0].screen_id;
				Global.zoneSchedule = obj.screen[0].new_schedule;
				Global.Hash = md5(obj.screen[0].new_schedule);
				localStorage.Key = Global.licenseKey;
				callback(true);
				 return;
			} else {
				callback(false); 
				return;
			}	
		});
		
	};

	obj.GetZones = function (callback) {
		Request.Zones(Global.server + 'template/get', function(res) {
			var obj = JSON.parse(res);
			//console.log(res);
			Global.templateZones = obj.zones;
			callback(true);
			return;
		});
		
	};

	obj.LoadZones = function (callback) {
		console.log("LoadZones");
		Request.Zones(Global.server + 'template/get', function(res) {
			var obj = JSON.parse(res);
			Global.templateZones = obj.zones;
			callback(true);
			return;
		});
		
	};

	obj.GetAssets = function(callback) {
		var zoneObj = JSON.parse(Global.zoneSchedule);
		Global.ArrZone = [];
		var countID = 0;
	   	for(var z = 0;z < zoneObj.zones.length; z++) {
	   		var zObj = JSON.parse(zoneObj.zones[z]);

	   		if(zObj.timeslot.length > 0) {
   				for(var t = 0;t < zObj.timeslot.length; t++) {
   					var slotObj = JSON.parse(zObj.timeslot[t]);
   					var timeslot = slotObj.time;
   					var zonename = zObj.name;

   					//console.log(Global.ArrZone);

   					Request.Assets(Global.server + 'campaign/media', slotObj.campaigns, timeslot, zonename, function(res, timeslot, zonename) {
						var obj = JSON.parse(res);
						if(obj.medias.length > 0) {
							ISSP.ComposeAsset(zonename, obj.medias);
						}
					});
   				}
	   		}
	   	}
		
	};

	obj.Log = function(params) { 
		console.log(params);
				/*Request.Pushlog(Global.server + 'media/log', params, function() {
				
				});*/
	
	};
	obj.ComposeAsset = function(ZoneName, medias) { 
		for(var i = 0;i < medias.length; i++) {
			medias[i].zonename = ZoneName
			Global.ArrZone.push(medias[i]);
		}
	
	};
	obj.ReadAssets = function() {
		
		var templateZones = Global.templateZones;
		var results = [];
		var zonename;
		for(var i=0; i < templateZones.length; i++) {
			zonename = templateZones[i].unique_id;
			var data = ISSP.genData(zonename);
			//console.log(data);
			if(data.length > 1)
				UI.Play(0, zonename, data);
		}
		
	};

	obj.genData = function(zonename) {
		var zoneData = Global.ArrZone;
		var data = [];
		if(zoneData.length > 0) {
			for(var i = 0;i < zoneData.length; i++) {
				if(zoneData[i].zonename == zonename) {
					data.push(zoneData[i]);
				}

			}
		}
		return data;
	};

	obj.SaveZones = function() {
		/*chrome.storage.local.set({'screen_id': Global.screenID});
	  	chrome.storage.local.set({'license_key': Global.licenseKey});
	   	chrome.storage.local.set({'template_id': Global.templateID});
	   	chrome.storage.local.set({'template_zones': JSON.stringify(Global.templateZones)});
	   	chrome.storage.local.set({'screen_schedule': JSON.stringify(Global.zoneSchedule)});
	   	chrome.storage.local.set({'screen_hash': md5(JSON.stringify(Global.zoneSchedule))});*/

	   	return true;
	};

	return obj;
}(ISSP || {}));