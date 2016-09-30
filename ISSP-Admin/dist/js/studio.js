var textJson = '{"zones":[]}';
var scheduleObject = JSON.parse(textJson); //object

var Studio = {
	server: 'http://localhost:8081/',
	auth: JSON.parse(sessionStorage.Auth),

	GetScreens: function() {
		var obj = this.auth;
		var _params = {};
		_params.token = obj.token;
		_params.user_id = obj.userdata[0].user_id;
		
		$.post(this.server + 'screen/get', _params, function(res) {
			$(".screenlist").html("");
			var obj = JSON.parse(res);
			//console.log(obj);
			if(obj.status == 1) {
			
				if(obj.screens.length > 0) {
					
					for (var i = 0; i < obj.screens.length; i++) {
						var html='<li><a href="#"><span><label><input type="checkbox" data-screenId="'+obj.screens[i].screen_id+'" class="screencheckbox pull-left">'+obj.screens[i].name+'</label></span></a></li>';
	
						$(".screenlist").prepend(html);
					}

				}	
			}

		});
	},
	getTemplates: function() {
			var obj = this.auth;
			var _params = {};
			_params.token = obj.token;
			_params.user_id = obj.userdata[0].user_id;
			$.post(this.server + 'template/getall', _params, function(res) {
				$('#templatelist').html("");
				var obj = JSON.parse(res);
				if(obj.status == 1) {
					if(obj.items.length > 0) {
						for (var i =0; i < obj.items.length; i++) {
							$('#templatelist').prepend('<span data-id="'+obj.items[i].template_id+'" data-preview="'+obj.items[i].thumbnail+'">'+obj.items[i].name.toUpperCase()+'</span>');
						};
					}
				}
				
			});

	},
	LoadTemplate: function(data) {
		active_template=data.attr('data-id');
		$('#templatepreview').html('<img src="../../'+data.attr('data-preview')+'"/>');
		$('#templatename').html(data.html());
		var obj = this.auth;
		var _params = {};
		_params.token = obj.token;
		_params.user_id = obj.userdata[0].user_id;
		_params.template_id = active_template;

		scheduleObject = JSON.parse(textJson); //object
		$.post(this.server + 'template/load', _params, function(res) {
			Timeline.Load();
			var obj = JSON.parse(res);
			if(obj.status == 1) {

				if(obj.widgets.length > 0) {
					//Global_widgets = obj.widgets;
						var zones = []; //array init 
						for (var z = 0; z < obj.widgets.length;z++) {
							//zones.push(obj.widgets[z].unique_id);
							var zonehtml = "<tr id='zoneid-"+z+"'>";
							zonehtml = zonehtml + "<td style='width: 170px'>"+obj.widgets[z].name+"</td>";
							for (var i = 0; i < 1;i++) {
								zonehtml = zonehtml + "<td data-time='"+ ('0' +""+ i).slice(-2) +":00' data-index='"+z+"' id='index-"+i+"-"+z+"' class='campaigndragable'></td>";
							}
							zonehtml = zonehtml + "</tr>";
							$("#timeframeview").append(zonehtml);
								scheduleObject["zones"] .push('{"name":"'+obj.widgets[z].unique_id+'","timeslot":[]}');
						}
						//scheduleObject["zones"] = zones;
						Campaign.intDragable();
						//console.log("schedule");
						//console.log(scheduleObject);
				}
			}

		});

	},
	getMedias: function(filter) {
		var obj = this.auth;
		var _params = {};
		_params.token = obj.token;
		_params.user_id = obj.userdata[0].user_id;
		var popover;
		$.post(this.server + 'media/get', _params, function(res) {
			$("#medialist").html("");
			var obj = JSON.parse(res);
			//console.log(res);
			if(obj.status == 1) {
				
				if(obj.medias.length > 0) {
					
					for (var i = 0; i < obj.medias.length; i++) {

						if(obj.medias[i].size > 0) {
							if(obj.medias[i].type.match("image")) {
							popover = "<img width='100px' src='"+obj.medias[i].file+"'/>";
							} else {
								popover = obj.medias[i].name;
							}
							if(filter == true) {
								if($('#filesearch').val()) {
									if(obj.medias[i].name.match($('#filesearch').val())) {
										$("#medialist").append('<a  data-file="'+obj.medias[i].file+'" data-id="'+obj.medias[i].media_id+'" html="#" rel="tooltip" class="mediadragable" draggable="true" title="'+popover+'">'+obj.medias[i].name+'</a>');
									}
								} else {
									$("#medialist").append('<a data-file="'+obj.medias[i].file+'" data-id="'+obj.medias[i].media_id+'" html="#" rel="tooltip" class="mediadragable" draggable="true" title="'+popover+'">'+obj.medias[i].name+'</a>');
								}
								
							} else {
									$("#medialist").append('<a data-file="'+obj.medias[i].file+'" data-id="'+obj.medias[i].media_id+'" html="#" rel="tooltip" class="mediadragable" draggable="true" title="'+popover+'">'+obj.medias[i].name+'</a>');
							}
						}
						
					}
						Media.intDragable();
				}
			}

		});

	},


	getWidgets: function(filter) {
		var obj = this.auth;
		var _params = {};
		_params.token = obj.token;
		_params.user_id = obj.userdata[0].user_id;
		var popover;
		$.post(this.server + 'media/get', _params, function(res) {
			$("#widgetlist").html("");
			var obj = JSON.parse(res);
			//console.log(res);
			if(obj.status == 1) {
				
				if(obj.medias.length > 0) {
					
					for (var i = 0; i < obj.medias.length; i++) {

						if(obj.medias[i].size == 0) {
							
							if(filter == true) {
								if($('#widgetsearch').val()) {
									if(obj.medias[i].name.match($('#widgetsearch').val())) {
										$("#widgetlist").append('<a  data-file="'+obj.medias[i].file+'" data-id="'+obj.medias[i].media_id+'" html="#" rel="tooltip" class="mediadragable" draggable="true" title="'+popover+'">'+obj.medias[i].name+'</a>');
									}
								} else {
									$("#widgetlist").append('<a data-file="'+obj.medias[i].file+'" data-id="'+obj.medias[i].media_id+'" html="#" rel="tooltip" class="mediadragable" draggable="true" title="'+popover+'">'+obj.medias[i].name+'</a>');
								}
								
							} else {
									$("#widgetlist").append('<a data-file="'+obj.medias[i].file+'" data-id="'+obj.medias[i].media_id+'" html="#" rel="tooltip" class="mediadragable" draggable="true" title="'+popover+'">'+obj.medias[i].name+'</a>');
							}
						}
						
					}
						Media.intDragable();
				}
			}

		});

	},
	AddCampaign: function() {
		var obj = this.auth;
		var _campaign ={};
		_campaign.name = $('#campaign-name').val();
		_campaign.interval = $('#campaign-interval').val();
		var _params = {};
		_params.token = obj.token;
		_params.user_id = obj.userdata[0].user_id;
		_params.campaign = '['+JSON.stringify(_campaign)+']';
		
		$.post(this.server + 'campaign/add', _params, function(res) {
			

			var obj = JSON.parse(res);
			if(obj.status == 1) {
			
				Studio.GetCampaigns();
				$('#NewCampaignModal').modal('hide');
			}

		});
	},
	GetCampaigns: function() {
		var obj = this.auth;
		var _params = {};
		_params.token = obj.token;
		_params.user_id = obj.userdata[0].user_id;
		var html;
		$.post(this.server + 'campaign/get', _params, function(res) {
			//console.log(res);
			var obj = JSON.parse(res);
			if(obj.status == 1) {
			
				if(obj.campaigns.length > 0) {
					
					$("#campaignlist").html("");
					
					for (var i = 0; i < obj.campaigns.length; i++) {
						html = '<div class="box box-widget collapsed-box">'
						+ '<div class="box-header">'
						+ '<h3 class="box-title campaigndragable" data-id="'+obj.campaigns[i].campaign_id+'" draggable="true">'+obj.campaigns[i].name+'</h3>'
						+ '<div class="box-tools pull-right">'
						+ '<button class="btn btn-box-tool" data-widget="collapse">'
						+ '<i class="fa fa-plus"></i>'
						+ ' </button>'
						+ '</div>'
						+ '</div>'
						+ '<div class="box-body">'
						+ '<div data-id="'+obj.campaigns[i].campaign_id+'" id="camp-'+obj.campaigns[i].campaign_id+'" class="mediadragable"></div> '
						+ '</div>'
						+ '</div>';
					
						$("#campaignlist").append(html);
						Studio.GetCampaignItems(obj.campaigns[i].campaign_id);
					}
					Campaign.intDragable();
					Media.intDragable();
				}
			}

		});

	},
	AddCampaignItem: function(_campaign) {
		var obj = this.auth;
		var _params = {};
		_params.token = obj.token;
		_params.user_id = obj.userdata[0].user_id;
		_params.campaign = '['+JSON.stringify(_campaign)+']';


		$.post(this.server + 'campaign/additem', _params, function(res) {
			var obj = JSON.parse(res);
			if(obj.status == 1) {
			
					//ISSP.getCampaignItems();
				//$('#IsspModal4').modal('hide');
			}

		});
	},
	GetCampaignItems: function(campaign_id) {
		var obj = this.auth;
		var _params = {};
		_params.token = obj.token;
		_params.user_id = obj.userdata[0].user_id;
		_params.campaign_id = campaign_id;
		$.post(this.server + 'campaign/items', _params, function(res) {
			var obj = JSON.parse(res);
			if(obj.status == 1) {
				$("#camp-"+campaign_id).html("");
				if(obj.items.length > 0) {
					//console.log(obj.items);
					for (var i = 0; i < obj.items.length; i++) {
						if(obj.items[i].media_name.match('.jpeg') || obj.items[i].media_name.match('.png') || obj.items[i].media_name.match('.jpg') || obj.items[i].media_name.match('.gif')){
							$("#camp-"+campaign_id).append('<span class="btn btn-default btn-xs" data-id="'+obj.items[i].item_id+'"><i class="fa fa-times pull-right" title="Remove" data-camp="'+obj.items[i].campaign_id+'" data-id="'+obj.items[i].item_id+'"></i><img src="' + obj.items[i].media_name + ' "/></span>');
						}
						else if(obj.items[i].media_name.match('.mp4')) {
							$("#camp-"+campaign_id).append('<span class="btn btn-default btn-xs" data-id="'+obj.items[i].item_id+'"><i class="fa fa-times pull-right" title="Remove" data-camp="'+obj.items[i].campaign_id+'" data-id="'+obj.items[i].item_id+'"></i><video src="' + obj.items[i].media_name + ' "/></span>');
						} else {
							$("#camp-"+campaign_id).append('<span class="btn btn-default btn-xs" data-id="'+obj.items[i].item_id+'"><i class="fa fa-times pull-right" title="Remove" data-camp="'+obj.items[i].campaign_id+'" data-id="'+obj.items[i].item_id+'"></i><p>' + obj.items[i].media_name + ' </p></span>');
						}
					}
					
				}
			}

		});

	},

	RemoveCampaignItem: function(item_id, campaign_id) {

		var obj = this.auth;
		var _params = {};
		_params.token = obj.token;
		_params.user_id = obj.userdata[0].user_id;
		_params.item_id = item_id;
		$.post(this.server + 'campaign/removeitem', _params, function(res) {
		
			var obj = JSON.parse(res);
			if(obj.status == 1) 
					Studio.GetCampaignItems(campaign_id);

		});

	},

	ApplyToScreen: function(data) {
			var screenid = data.attr("data-screenId");
			var obj = this.auth;
			var _params = {};
			_params.token = obj.token;
			_params.user_id = obj.userdata[0].user_id;
			_params.template_id = active_template;
			_params.screen_id = screenid;
			_params.schedule = JSON.stringify(scheduleObject);
			$.post(this.server + 'screen/Schedule', _params, function(res) {
				
				socket.emit('screenupdate', { screenid: screenid})
				var obj = JSON.parse(res);
				//console.log(obj);
				if(obj.status == 1) {
					
				}
			
			});
	}

}//Class end here

