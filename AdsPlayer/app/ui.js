var UI = (function (obj) {
	obj.ValidationForm = function (action) {
		if(action == "open")
			$("#formModal").modal("show");
		else 
			$("#formModal").modal("hide");
		
	};
	obj.PageLoader = function (action) {
		if(action == "open")
			$("#opener").show();
		else 
			$("#opener").hide();
		
	};
	obj.invalidKeyMessage = function(message) {
		$(".messageAlert").html(message);
		$(".messageAlert").show();
	}
	obj.PopulateZones = function() {
		var obj = Global.templateZones;
		var html;
		$("#isspContent").html("");
		if(obj.length > 0) {
			for(var i = 0; i < obj.length; i++) {
				html = '<div class="zone" id="'+obj[i].unique_id+'" data-width="'+obj[i].zone_width+'" data-height="'+obj[i].zone_height+'" style="width: '+obj[i].zone_width+'px; height: '+obj[i].zone_height+'px; top:'+obj[i].pos_y+'px; left:'+obj[i].pos_x+'px;"></div>';
				$("#isspContent").append(html);
			}
			return true;
		} else {
			return false;
		}
		
	};

	obj.Play = function(index, zonename, data) {
		//console.log("sample");
		var container = $('#'+zonename);
		var v;
		var next = index+1;
		if(index < data.length) {
					var width = container.attr("data-width");
					var height = container.attr("data-height");
				if(data[index].type.search('video') != -1){
					var html = '<video class="animated rotateInDownRight" src="'+data[index].media_name+'" width="'+width+'" height="'+height+'" autoplay/>'
					container.html(html);
					v = $('#'+zonename + " video").get(0);
					$('#'+zonename + " video").bind("ended", function() {
						$('#'+zonename + " video").remove();
							UI.Play(next, zonename, data);
					 });

				} else if(data[index].type.search('image') != -1) {
					var html = '<img class="animated rotateInDownRight" src="'+data[index].media_name+'" width="'+width+'" height="'+height+'" />'
					container.html(html);
					setTimeout(function() {
						$('#'+zonename + " img").remove();
						
						//alert(next);
						UI.Play(next, zonename, data);
					}, UI.getRandomInt());
				}  else if(data[index].type == "inline") {
					var html = '<iframe align="middle" id="_inframe" allowtransparency="true" src="'+data[index].media_name+'" seamless></iframe>'
						console.log(html);
					container.html(html);
					setTimeout(function() {
						$('#'+zonename + " iframe").remove();
						UI.Play(next, zonename, data);
					}, 40000);
				} else if(data[index].type == "crawler") {
					//console.log($('.bottom-crawler').length);
					if($('.bottom-crawler').length == 0) {
						var html = '<div class="bottom-crawler animated bounceInUp"><iframe allowtransparency="true" src="http://inventiv.ph/playerdev/crawler.html?str='+data[index].media_name+'" seamless></iframe></div>';
						$("#isspWidgets").html(html);
					}
					
					UI.Play(next, zonename, data);
					setTimeout(function() {
						$('.bottom-crawler').remove();
					}, 120000);
				} else if(data[index].type == "fullscreen") {
					console.log($('.fullscreen-widget').length);
					if($('.fullscreen-widget').length == 0) {
						var html = '<div class="fullscreen-widget animated zoomIn"><iframe align="middle" allowtransparency="true" src="'+data[index].media_name+'" seamless></iframe></div>';
						$("#isspWidgets").html(html);
					}
					
					setTimeout(function() {
						$('.fullscreen-widget').remove();
						UI.Play(next, zonename, data);
					}, 60000);
				}
				
				UI.Log(data[index]);
				
		} else {
			UI.Play(0, zonename, data);
		}
		
	};
	obj.Log = function(data) {
		//alert("log");
			var params = {};
			params.media_id = data.media_id;
			params.campaign_id = data.campaign_id;
			params.screen_id = Global.screenID;
			params.publisher_id = Global.screenID;
			//console.log(data);
			//$.post('http://localhost/playerDev/log.php', params, function(res) {});
		
			return;
		
	};
	obj.getRandomInt = function() {
			return Math.floor(Math.random() * (15000 - 10000 + 1)) + 10000;
	
		
	};
	return obj;
}(UI || {}));