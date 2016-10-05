
//ISSP Controller
define(function (require) {
	var msg_crawler;
	/*chrome.storage.local.clear(function(res) {
		console.log(res);
	});*/
	//ISSP.check_network_state();

	setTimeout(function() {
		//chrome.storage.local.get('screen_id', function (result) {Global.screenID = result.screen_id; console.log(result.screen_id);});
		//chrome.storage.local.get('license_key', function (result) {Global.licenseKey = result.license_key;});
		//chrome.storage.local.get('template_id', function (result) {Global.templateID = result.template_id;});
		//todoDB.open('assetTable',function() { console.log("open db");});
		setTimeout(function() {
			if(localStorage.Key) {
				ISSP.ValidateKey(localStorage.Key, function(res) { 
					getScreenUpdates();
				});
			
			} else {
				UI.ValidationForm("open");
				UI.PageLoader("close");
			}
		}, 800);
	}, 2000);
var socket = io("http://prod.inventiv.ph",{path: '/server1'});

socket.on('screen', function (data) {
	if(Global.screenID == data.screen_id) {
		location.reload();
	}
});
var _timehide;
socket.on('oncrawler', function (data) {
	if(data.message) {
		$('#maincrawler').show();
		if(_timehide) {
			clearTimeout(_timehide);
		}
		if(msg_crawler != data.message) {
			 $('marquee').html(data.message);
			msg_crawler = data.message;
		}
		_timehide = setTimeout(function() {$('#maincrawler').hide();}, 120000);
	} else {
		//$('#maincrawler').removeClass("animated");
		//$('#maincrawler').removeClass("flipInX");
		$('#maincrawler').hide();
	}
});

	
  //UI Event 
		

  $("#screenkey").on('change', function() { $(".messageAlert").hide(); })
  $("#ValidateKeyBtn").on('click', function() {
  		var key = $("#screenkey").val();
  		$(this).button('loading');

  		if(key) {	
  			ISSP.ValidateKey(key, function(res) { 
  				if(res == true) {
  					getScreenUpdates();
  				} else {
  				
  					UI.invalidKeyMessage(Global.invalidKey);
  				}
  					
  			});
  		} else {
  			UI.invalidKeyMessage(Global.invalidKey);
  		}
  		$(this).button('reset');
  		return false;
		
	});


  function getScreenUpdates() {
  	ISSP.GetZones(function(res) { 
	  					UI.ValidationForm("close"); 
	  					if(UI.PopulateZones()) {
	  						UI.PageLoader("open");
	  						if(ISSP.SaveZones()) {
	  								  ISSP.GetAssets();
	  						}
	  						setTimeout(function() {
										ISSP.ReadAssets();
										UI.PageLoader("close");
									}, 3000);
							
	  					}
  					}); 
  }

});
