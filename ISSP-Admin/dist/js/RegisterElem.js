//Global varibles
var Global_screens;
var Global_campaigns;
var Global_medias;
var Global_schedules;
var Global_widgets;
var Global_active_screen;
var Global_active_campaign;
var Global_active_media;
var Global_active_medianame;
var Global_active_schedule;
var Global_active_campaignname;
var Global_active_widget;
var Global_active_schedulename;

var isspElement = {
	SingleScreen: function(selector) {
		$(selector).on('click', function() {
			var clickID = $(this).attr('data-href');
			var obj = Global_screens[$(this).attr('data-index')];
			$('.viewpanel').hide('slide', {direction: 'right'}, 300);
			$('.viewpanel').removeClass('showviewpanel');
			$(''+clickID+'').addClass('showviewpanel');
			Global_active_screen = obj.screen_id;
			Global_active_widget = 0;
			setTimeout(function() {
				//console.log(obj.new_schedule);
				var campaigns = JSON.parse(obj.new_schedule);
				ISSP.loadTemplate(obj.template, campaigns);
				$('.pageTitle').html(obj.name);
				$('.screendetails').html(obj.details);
				$(''+clickID+'').show('slide', {direction: 'left'}, 300);	
					
			}, 300);
		});

	},
	SingleCampaign: function(selector) {

			$(selector).on('click', function() {
				$('.SelectCampaignBox').show('slide', {direction: 'left'}, 300);
				var obj = Global_campaigns[$(this).attr('data-index')];
				Global_active_campaign = obj.campaign_id;
				$('.campaignName').html(obj.name + ' <small>items</small>');
				setTimeout(function() {ISSP.getCampaignItems();}, 100);
				
			});
		
	},
	SingleMedia: function(selector) {
		$(selector).on('click', function() { 
		
			var clickID = $(this).attr('data-href');
			var obj = Global_medias[$(this).attr('data-index')];
			$('.viewpanel').hide('slide', {direction: 'right'}, 300);
			$('.viewpanel').removeClass('showviewpanel');
			
			Global_active_media = obj.media_id;
			setTimeout(function() {
				$('.pageTitle').html(obj.name);
				$('.media_name').html(obj.name);
				$('.media_type').html(obj.type);
				$('.media_file').html(obj.file);
				if(obj.type.match("image")) {
					$('.media_preview').html('<img src="'+obj.file+'" style="max-width: 100%"//>');
				} else if(obj.type.match("video")) {
					$('.media_preview').html('<video src="'+obj.file+'" controls style="width: 100%"/>');
				}
				Report.GetCampaign(obj.media_id);
				Report.GetScreen(obj.media_id);
				Report.GetSchedule(obj.media_id);
				Report.GetViews(obj.media_id);
				Report.GetStats(obj.media_id, 'daily');
				$(''+clickID+'').addClass('showviewpanel');
				$(''+clickID+'').show('slide', {direction: 'left'}, 300);	
				
			}, 300);
		});
	
	},
	SingleSchedule: function(selector) {
		$(selector).on('click', function() {
					$('.SelectScheduleBox').show('slide', {direction: 'left'}, 300);
				if(Global_schedules) {
					var obj = Global_schedules[$(this).attr('data-index')];
					console.log(obj);
					Global_active_schedule = obj.schedule_id;
					$('.scheduleName').html(obj.name + ' <small>items</small>');
					setTimeout(function() {ISSP.getScheduleItems();}, 100);
				}
				
			});

	},
	mediaAction: function(selector) {

			$(selector).on('click', function() {

				Global_active_media = $(this).attr('data-id');
				Global_active_medianame = $(this).html();
				ISSP.addCampaignItem();
			});
		
	},

	campaignAction: function(selector) {

			$(selector).on('click', function() {

				Global_active_campaign = $(this).attr('data-id');
				Global_active_campaignname = $(this).html();
				ISSP.addScheduleItem();
				//alert("ok");
			});
		
	},
	mediaItemAction: function(selector, module) {

			$(selector).on('click', function() {
					if(module == "campaign") {
							ISSP.removeCampaignItem($(this).attr('data-id'));
					} else if (module == "schedule") {
							ISSP.removeScheduleItem($(this).attr('data-id'));
					} else if(module == "widget") {
							ISSP.removeWidgetItem($(this).attr('data-id'));
					}
					
			});
		
	},
	SingleWidget:function(selector) {

		$(selector).on('click', function() {
				$("#widget_items").html(" ");
					var obj = Global_widgets[$(this).attr('data-index')];
					Global_active_widget = obj.widget_id;
					$('.widgetName').html(obj.name + ' <small>items</small>');
					setTimeout(function() {ISSP.getWidgetItems();}, 100);
				
			});
	},
	WidgetAction: function(selector) {

		$(selector).on('click', function() {
			if(Global_active_widget) {
				Global_active_schedule = $(this).attr('data-id');
				Global_active_schedulename = $(this).html();
				ISSP.addWidgetItem();
			} else {

				alert('Select a widget!');
			}
		});

	},
	SelectTemplate: function(selector) {

		$(selector).on('click', function() {
			ISSP.UpdateScreen($(this).attr('data-id'));
		});
	}

} //class end