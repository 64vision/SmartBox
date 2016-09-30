var ISSP = {
	server: 'http://localhost:8081/',
	auth: JSON.parse(sessionStorage.Auth),
	getScreens: function() {
		var obj = this.auth;
		var _params = {};
		_params.token = obj.token;
		_params.user_id = obj.userdata[0].user_id;
		console.log(_params);
		$.post(this.server + 'screen/get', _params, function(res) {
			$("#screentable").html("");
			var obj = JSON.parse(res);
			if(obj.status == 1) {
			
				if(obj.screens.length > 0) {
					$(".sumscreen").html(obj.screens.length);
					Global_screens = obj.screens;
					for (var i = 0; i < obj.screens.length; i++) {
						var html = '<tr>';
						html = html + '<td><i class="fa fa-desktop status-'+obj.screens[i].status+'"></i></td>';
						html = html + '<td><strong>'+obj.screens[i].name+'</strong> <br/><small>License Key: '+obj.screens[i].license_key+'</small></td>';
						html = html +  '<td><button class="btn btn-xs btn-info linkbtn" data-href="#singlescreen" data-index="'+i+'"><i class="fa fa-arrow-circle-right"></i></button>';
						html = html + '</td></tr>';
						$("#screentable").prepend(html);
					}

					isspElement.SingleScreen('.linkbtn');
				}
			}

		});
	},
	filterScreen: function(group_id) {
			$("#screentable").html("");

			var obj = Global_screens;
			console.log(obj);
			for (var i = 0; i < obj.length; i++) {
				if(obj[i].group_id == group_id || group_id == 0) {

					var html = '<tr>';
					html = html + '<td><i class="fa fa-desktop status-'+obj[i].status+'"></i></td>';
					html = html + '<td><strong>'+obj[i].name+'</strong> <br/><small>License Key: '+obj[i].license_key+'</small></td>';
					html = html +  '<td><button class="btn btn-xs btn-info linkbtn" data-href="#singlescreen" data-index="'+i+'"><i class="fa fa-arrow-circle-right"></i></button>';
					html = html + '</td></tr>';
					$("#screentable").prepend(html);
				}
			}

	},
	addMedia: function() {
		var obj = this.auth;

		var _media ={};
		_media.name = $('#media-name').val();
		_media.file = $('#media-file').val();
		_media.type = $('#media-type').val();
		var _params = {};
		_params.token = obj.token;
		_params.user_id = obj.userdata[0].user_id;
		_params.media = '['+JSON.stringify(_media)+']';
		
		$.post(this.server + 'media/add', _params, function(res) {
		
			var obj = JSON.parse(res);
			if(obj.status == 1) {
				ISSP.getMedias();
				$('#IsspModal3').modal('hide');
			}

		});
	},


	addWidget: function(_media) {
		var obj = this.auth;
		var _params = {};
		_params.token = obj.token;
		_params.user_id = obj.userdata[0].user_id;
		_params.media = '['+JSON.stringify(_media)+']';
		
		$.post(this.server + 'media/add', _params, function(res) {
		
			var obj = JSON.parse(res);
			//alert(obj.status);
			if(obj.status == 1) {
				//ISSP.getMedias();
				//$('#IsspModal3').modal('hide');
			}

		});
	},

	uploadMedia: function(file) {
		var obj = this.auth;
		var _media ={};
		_media.name = file.name;
		_media.file = file.location;
		_media.type =file.type;
		_media.size =file.size;
		//_media.advertiser_id=file.advertiser_id;
		_media.auth_id =fbUserId;
		var _params = {};
		_params.token = obj.token;
		_params.user_id = obj.userdata[0].user_id;
		_params.media = '['+JSON.stringify(_media)+']';
		
		$.post(this.server + 'media/add', _params, function(res) {
		
			var obj = JSON.parse(res);
			if(obj.status == 1) {
				//ISSP.getMedias();
				//$('#IsspModal3').modal('hide');
				console.log("Save!");
			} else {
				console.log("Not Save!");
			}

		});
	},

	getMedias: function() {
		var obj = this.auth;
		var _params = {};
		_params.token = obj.token;
		_params.user_id = obj.userdata[0].user_id;
		
		$.post(this.server + 'media/get', _params, function(res) {
			//console.log(res);
			var obj = JSON.parse(res);
			if(obj.status == 1) {
			
				if(obj.medias.length > 0) {
					$(".summedia").html(obj.medias.length);
					$("#mediatable").html("");
					$(".cma").html("");
					Global_medias = obj.medias;
					for (var i = 0; i < obj.medias.length; i++) {
						var html = '<tr>';
					
						html = html + '<td>'+obj.medias[i].name+'</td>';
						html = html + '<td>'+obj.medias[i].type+'</td>';
						html = html + '<td>'+moment(obj.medias[i].added).format('L')+'</td><td>';
						html = html +  '<button title="Edit" class="btn btn-xs btn-warning editBtn" data-type="media" data-index="'+i+'"><i class="fa fa-edit"></i></button> ';
						html = html +  '<button title="Remove" class="btn btn-xs btn-danger trashBtn" data-type="media" data-index="'+i+'"><i class="fa fa-trash"></i></button> ';
						html = html + ' <button class="btn btn-xs btn-success linkbtn4" data-href="#SingleMedia" data-index="'+i+'"><i class="fa fa-arrow-circle-right"></i></button></td></tr>';
						$("#mediatable").prepend(html);
						//this update all media display in the admin
						$(".cma").prepend('<div class="alert alert-info cma_item" role="alert" data-id="'+obj.medias[i].media_id+'">'+obj.medias[i].name+' <br/><small>'+obj.medias[i].type+'</small></div>');
					}

					isspElement.SingleMedia('.linkbtn4'); //add action

					isspElement.mediaAction('.cma_item'); //add action 
				}
			}

		});

	},


	getAdsMedia: function() {
		var obj = this.auth;
		var _params = {};
		_params.token = obj.token;
		_params.user_id = obj.userdata[0].user_id;
		
		$.post(this.server + 'media/getads', _params, function(res) {
			console.log(res);
			var obj = JSON.parse(res);
			if(obj.status == 1) {
			
				if(obj.medias.length > 0) {
					$(".summedia").html(obj.medias.length);
					$("#mediatable").html("");
					$(".cma").html("");
					Global_medias = obj.medias;
					for (var i = 0; i < obj.medias.length; i++) {
						var html = '<tr>';
					
						html = html + '<td>'+obj.medias[i].name+'</td>';
						html = html + '<td>'+obj.medias[i].type+'</td>';
						html = html + '<td>'+moment(obj.medias[i].added).format('L')+'</td><td>';
						html = html +  '<button title="Edit" class="btn btn-xs btn-warning editBtn" data-type="media" data-index="'+i+'"><i class="fa fa-edit"></i></button> ';
						html = html +  '<button title="Remove" class="btn btn-xs btn-danger trashBtn" data-type="media" data-index="'+i+'"><i class="fa fa-trash"></i></button> ';
						html = html + ' <button class="btn btn-xs btn-success linkbtn4" data-href="#SingleMedia" data-index="'+i+'"><i class="fa fa-arrow-circle-right"></i></button></td></tr>';
						$("#mediatable").prepend(html);
						//this update all media display in the admin
						$(".cma").prepend('<div class="alert alert-info cma_item" role="alert" data-id="'+obj.medias[i].media_id+'">'+obj.medias[i].name+' <br/><small>'+obj.medias[i].type+'</small></div>');
					}

					isspElement.SingleMedia('.linkbtn4'); //add action

					isspElement.mediaAction('.cma_item'); //add action 
				}
			}

		});

	},


	addCampaignItem: function() {
		var obj = this.auth;

		var _campaign ={};
		_campaign.campaign_id = Global_active_campaign;
		_campaign.media_id = Global_active_media;
		_campaign.media_name = Global_active_medianame;
		var _params = {};
		_params.token = obj.token;
		_params.user_id = obj.userdata[0].user_id;
		_params.campaign = '['+JSON.stringify(_campaign)+']';


		$.post(this.server + 'campaign/additem', _params, function(res) {
			var obj = JSON.parse(res);
			if(obj.status == 1) {
			
					ISSP.getCampaignItems();
				$('#IsspModal4').modal('hide');
			}

		});
	},

	getCampaignItems: function() {
		var obj = this.auth;
		var _params = {};
		_params.token = obj.token;
		_params.user_id = obj.userdata[0].user_id;
		_params.campaign_id = Global_active_campaign;
		$.post(this.server + 'campaign/items', _params, function(res) {
			var obj = JSON.parse(res);
			if(obj.status == 1) {
				$("#campaign_items").html("");
				if(obj.items.length > 0) {
				
					for (var i = 0; i < obj.items.length; i++) {
						var html = '<div class="alert alert-info campaign_item" data-id="'+obj.items[i].item_id+'">'+obj.items[i].media_name+'</div>';
						$("#campaign_items").prepend(html);
					}
					isspElement.mediaItemAction('.campaign_item', 'campaign');
				}
			}

		});

	},
	removeCampaignItem: function(item_id) {

		var obj = this.auth;
		var _params = {};
		_params.token = obj.token;
		_params.user_id = obj.userdata[0].user_id;
		_params.item_id = item_id;
		$.post(this.server + 'campaign/removeitem', _params, function(res) {
		
			var obj = JSON.parse(res);
			if(obj.status == 1) {
					ISSP.getCampaignItems();
			}

		});

	},
	addCampaign: function() {
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
			
				ISSP.getCampaigns();
				$('#IsspModal').modal('hide');
			}

		});
	},
	getCampaigns: function() {
		var obj = this.auth;
		var _params = {};
		_params.token = obj.token;
		_params.user_id = obj.userdata[0].user_id;
		
		$.post(this.server + 'campaign/get', _params, function(res) {
			//console.log(res);
			var obj = JSON.parse(res);
			_Campaigns = obj;
			$(".sca").html("");
			if(obj.status == 1) {
			
				if(obj.campaigns.length > 0) {
					$(".sumcampaign").html(obj.campaigns.length);
					$("#campaigntable").html("");
					Global_campaigns = obj.campaigns;
					for (var i = 0; i < obj.campaigns.length; i++) {
						var html = '<tr>';
					
						html = html + '<td>'+obj.campaigns[i].name+'</td></tr>';
						//html = html + '<td>'+obj.campaigns[i].interval+' sec</td>';
						//html = html +  '<td><button class="btn btn-xs btn-info linkbtn viewCamp" data-index="'+i+'"><i class="fa fa-arrow-circle-right"></i></button>';
						html = html + '</td></tr>';
						$("#campaigntable").prepend(html);
						$(".sca").prepend('<div class="alert alert-info sca_item" role="alert" data-id="'+obj.campaigns[i].campaign_id+'">'+obj.campaigns[i].name+'</div>');
					}

					isspElement.SingleCampaign('.linkbtn');
					isspElement.campaignAction('.sca_item');
				}
			}

		});

	},
	addSchedule: function() {
		var obj = this.auth;

		var _schedule ={};
		_schedule.name = $('#schedule-name').val();
		_schedule.display_time = $('#schedule-time').val();
		var _params = {};
		_params.token = obj.token;
		_params.user_id = obj.userdata[0].user_id;
		_params.schedule = '['+JSON.stringify(_schedule)+']';
		
		$.post(this.server + 'schedule/add', _params, function(res) {
			
			var obj = JSON.parse(res);
			if(obj.status == 1) {
			
				ISSP.getSchedules();
				$('#IsspModal5').modal('hide');
			}

		});
	},
	getSchedules: function() {
		var obj = this.auth;
		var _params = {};
		_params.token = obj.token;
		_params.user_id = obj.userdata[0].user_id;
		
		$.post(this.server + 'schedule/get', _params, function(res) {
			$(".wsa").html("");
			var obj = JSON.parse(res);
			if(obj.status == 1) {
			
				if(obj.schedules.length > 0) {
					$("#scheduletable").html("");
					Global_schedules = obj.schedules;
					for (var i = 0; i < obj.schedules.length; i++) {
						var html = '<tr>';
					
						html = html + '<td>'+obj.schedules[i].name+'</td>';
						html = html + '<td>'+obj.schedules[i].display_time+'</td>';
						//html = html + '<td>'+obj.campaigns[i].media_assets+'</td>';
						//html = html + '<td>'+obj.campaigns[i].created+'</td>';
						html = html +  '<td><button class="btn btn-xs btn-info linkbtn2" data-index="'+i+'"><i class="fa fa-arrow-circle-right"></i></button>';
						html = html + '</td></tr>';
						$("#scheduletable").prepend(html);
						$(".wsa").prepend('<div class="alert alert-info wsa_item" role="alert" data-id="'+obj.schedules[i].schedule_id+'">'+obj.schedules[i].name+'<br /><small>'+obj.schedules[i].display_time+'</small></div>');
					}

					isspElement.SingleSchedule('.linkbtn2');
					isspElement.WidgetAction('.wsa_item');
				}
			}

		});

	},
	getScheduleItems: function() {
		var obj = this.auth;
		var _params = {};
		_params.token = obj.token;
		_params.user_id = obj.userdata[0].user_id;
		_params.schedule_id = Global_active_schedule;
		$.post(this.server + 'schedule/items', _params, function(res) {
			var obj = JSON.parse(res);
			console.log(res);
			if(obj.status == 1) {
				$("#schedule_items").html(" ");
				if(obj.items.length > 0) {
					console.log(obj.items.length);
					for (var i = 0; i < obj.items.length; i++) {
						var html = '<div class="alert alert-info schedule_item" data-id="'+obj.items[i].item_id+'">'+obj.items[i].campaign_name+'</div>';
						$("#schedule_items").prepend(html);
					}
					isspElement.mediaItemAction('.schedule_item', 'schedule');
				}
			}

		});

	},
	addScheduleItem: function() {
		var obj = this.auth;

		var _schedule ={};
		_schedule.schedule_id = Global_active_schedule
		_schedule.campaign_id = Global_active_campaign;
		_schedule.campaign_name = Global_active_campaignname;
		var _params = {};
		_params.token = obj.token;
		_params.user_id = obj.userdata[0].user_id;
		_params.items = '['+JSON.stringify(_schedule)+']';


		$.post(this.server + 'schedule/additem', _params, function(res) {
			var obj = JSON.parse(res);
			if(obj.status == 1) {
			
				ISSP.getScheduleItems();
				$('#IsspModal6').modal('hide');
			}

		});
	},

	removeScheduleItem: function(item_id) {
		var obj = this.auth;
		var _params = {};
		_params.token = obj.token;
		_params.user_id = obj.userdata[0].user_id;
		_params.item_id = item_id;
		$.post(this.server + 'schedule/removeitem', _params, function(res) {
		
			var obj = JSON.parse(res);
			if(obj.status == 1) {
					ISSP.getScheduleItems();
			}

		});

	},

	Remove: function(data) {
		var obj = this.auth;
		var serverMethod;
		var _params = {};
		_params.token = obj.token;
		_params.user_id = obj.userdata[0].user_id;
		if(data.attr("data-type") == "media") {
			var mobj = Global_medias[data.attr('data-index')];
			_params.item_id = mobj.media_id
			serverMethod = this.server + 'media/remove';
		}
		$.post(serverMethod, _params, function(res) {
		
			var obj = JSON.parse(res);
			if(obj.status == 1) {
					ISSP.getMedias();
			}

		});

	},

	editMedia: function(data) {
		var obj = this.auth;
		var mobj = Global_medias[data.attr('data-index')];
		var _media ={};
		_media.media_id = mobj.media_id
		_media.name = $('#media-name').val();
		_media.file = $('#media-file').val();
		_media.type = $('#media-type').val();
		var _params = {};
		_params.token = obj.token;
		_params.user_id = obj.userdata[0].user_id;
		_params.media = '['+JSON.stringify(_media)+']';
		
		$.post(this.server + 'media/update', _params, function(res) {
		
			var obj = JSON.parse(res);
			if(obj.status == 1) {
				ISSP.getMedias();
				$('#IsspModal3').modal('hide');
			}

		});
	},

	loadTemplate:function(template_id, zoneObj) {
		console.log(zoneObj);
		var obj = this.auth;
		var _params = {};
		_params.token = obj.token;
		_params.user_id = obj.userdata[0].user_id;
		_params.template_id = template_id;
		$("#widget_items").html("");
		$("#widgettable").html("");
		$.post(this.server + 'template/load', _params, function(res) {
			var obj = JSON.parse(res);
			var zonehtml;
			if(obj.status == 1) {
				if(obj.items.length > 0) {
					for (var i = 0; i < obj.items.length; i++) {
						$(".templatePreview").attr('src', obj.items[0].thumbnail);
						$(".templatename").html(obj.items[0].name);
						$(".templatedescription").html(obj.items[0].description);
					}
					//isspElement.mediaItemAction('.schedule_item', 'schedule');
				} 

				if(obj.widgets.length > 0) {
					Global_widgets = obj.widgets;
					for (var d = 0; d < obj.widgets.length; d++) {
						var html = '<tr>';
						zonehtml = '';
						
						var zObj = JSON.parse(zoneObj.zones[d]);
						//
						
						
						html = html + '<td>'+obj.widgets[d].name+ '</td>';
						if(zObj.timeslot.length > 0) {
							var campObj = zObj.timeslot;
							
							for(var z = 0; z< campObj.length; z++) {
								var _cObj = JSON.parse(campObj[z]);
								//console.log(_cObj.campaigns);
								if(obj.widgets[d].unique_id == zObj.name) {
									for (var i = 0; i < _Campaigns.campaigns.length; i++) {
										if(_Campaigns.campaigns[i].campaign_id == _cObj.campaigns) {
											zonehtml = zonehtml + '<span class="label label-info">' + _Campaigns.campaigns[i].name + '</span>';
										}
											
									}
								}
							}
								
						}
							
								
						html = html + '<td>'+zonehtml+'</td></tr>';
						$("#widgettable").prepend(html);
					}
						isspElement.SingleWidget('.linkbtn3');
				}
			}

		});
	},

	addWidgetItem: function() {
		var obj = this.auth;

		var _widget ={};
		_widget.screen_id = Global_active_screen;
		_widget.widget_id = Global_active_widget
		_widget.schedule_id = Global_active_schedule;
		_widget.schedule_name = Global_active_schedulename;
		var _params = {};
		_params.token = obj.token;
		_params.user_id = obj.userdata[0].user_id;
		_params.items = '['+JSON.stringify(_widget)+']';
		console.log('new item');
		console.log(_widget);

		$.post(this.server + 'template/addwidgetitem', _params, function(res) {
			var obj = JSON.parse(res);
			if(obj.status == 1) {
			
				ISSP.getWidgetItems();
				$('#IsspModal7').modal('hide');
			}

		});
	},

	getWidgetItems: function() {
		var obj = this.auth;
		var _params = {};
		_params.token = obj.token;
		_params.user_id = obj.userdata[0].user_id;
		_params.widget_id = Global_active_widget;
		_params.screen_id = Global_active_screen;
		$("#widget_items").html(" ");
		$.post(this.server + 'template/widgetitems', _params, function(res) {
			var obj = JSON.parse(res);
			console.log(res);
			if(obj.status == 1) {
				
				if(obj.items.length > 0) {
					console.log(obj.items.length);
					for (var i = 0; i < obj.items.length; i++) {
						var html = '<div class="alert alert-info widget_item" data-id="'+obj.items[i].item_id+'">'+obj.items[i].schedule_name+'</div>';
						$("#widget_items").prepend(html);
					}
					isspElement.mediaItemAction('.widget_item', 'widget');
				} else {
						$("#widget_items").html("No schedule yet! ");

				}
			}

		});

	},
	removeWidgetItem: function(item_id) {
		var obj = this.auth;
		var _params = {};
		_params.token = obj.token;
		_params.user_id = obj.userdata[0].user_id;
		_params.item_id = item_id;
		$.post(this.server + 'template/removeitem', _params, function(res) {
		
			var obj = JSON.parse(res);
			if(obj.status == 1) {
					ISSP.getWidgetItems();
			}

		});
		
	},
	addNewGroup: function() {
		var obj = this.auth;
		var _groupdata ={};
		_groupdata.name = $("#newGroupName").val();
		_groupdata.user_id = obj.userdata[0].user_id;
		var _params = {};
		_params.token = obj.token;
		_params.user_id = obj.userdata[0].user_id;
		_params.items = '['+JSON.stringify(_groupdata)+']';
		$.post(this.server + 'screen/addgroup', _params, function(res) {
			var obj = JSON.parse(res);
			if(obj.status == 1) {
				ISSP.getGroup();
				
			} else {
				alert(obj.remarks);
			}

		});
	},

	screenRequest: function() {
		var obj = this.auth;
		var _item ={};
		_item.name = $("#newscreenname").val();
		_item.group_id = $("#newscreengroup").val();
		_item.user_id = obj.userdata[0].user_id;
		var _params = {};
		_params.token = obj.token;
		_params.user_id = obj.userdata[0].user_id;
		_params.items = '['+JSON.stringify(_item)+']';
		$.post(this.server + 'screen/add', _params, function(res) {
			var obj = JSON.parse(res);
			if(obj.status == 1) {
				ISSP.getScreens();
				$('#IsspModal8').modal('hide');
				$("#newscreengroup, #newscreenname").val("");
			} else {
				alert(obj.remarks);
			}

		});
	},
	getGroup: function() {
			var obj = this.auth;
			var _params = {};
			_params.token = obj.token;
			_params.user_id = obj.userdata[0].user_id;
			$.post(this.server + 'screen/getgroup', _params, function(res) {
				$('#newscreengroup').html("");
				$('#viewscreengroup').html('<option value="0">---All Groups--</option>');
				var obj = JSON.parse(res);
				if(obj.status == 1) {
					if(obj.items.length > 0) {
						for (var i =0; i < obj.items.length; i++) {
							$('#newscreengroup').prepend('<option value="'+obj.items[i].group_id+'">'+obj.items[i].name+'</option>');
							$('#viewscreengroup').prepend('<option value="'+obj.items[i].group_id+'">'+obj.items[i].name+'</option>');
						};
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
				$('.selecttemplate').html("");
				var obj = JSON.parse(res);
				if(obj.status == 1) {
					if(obj.items.length > 0) {
						for (var i =0; i < obj.items.length; i++) {
							$('.selecttemplate').prepend('<div class="template-item" data-id="'+obj.items[i].template_id+'"><img src="'+obj.items[i].thumbnail+'" width="100%" />'+obj.items[i].name+'</div>');
						};
					}
				}
				isspElement.SelectTemplate('.template-item');

			});

	},
	UpdateScreen: function(data) {

		var obj = this.auth;
			var _params = {};
			_params.token = obj.token;
			_params.user_id = obj.userdata[0].user_id;
			_params.template_id = data;
			_params.screen_id = Global_active_screen;
			$.post(this.server + 'screen/update', _params, function(res) {
				
				var obj = JSON.parse(res);
				if(obj.status == 1) {
					ISSP.getScreens();
					setTimeout(function() {ISSP.loadTemplate(_params.template_id);}, 1000);
					$('#IsspModal9').modal('hide');
				}
			
			});
	}

}//class end here