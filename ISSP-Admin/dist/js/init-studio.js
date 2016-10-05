//GLOBAL variables
var active_template;
var filter = false;
var socket;
$(function () {
	 socket = io("http://prod.inventiv.ph",{path: '/server1'});
	Timeline.Load();
	Studio.getTemplates();
	Studio.getMedias(filter);
	Studio.getWidgets(filter);
	Studio.GetCampaigns();
	Studio.GetScreens();
	$("body").on('click','#templatelist span', function() {
		Studio.LoadTemplate($(this));	
	});

	$('#medialist').tooltip({
 	 	selector: "a[rel=tooltip]",
 	 	 html : true, 
	});
	$('#NewMediaModal').on('hidden.bs.modal', function (e) {
  		//alert("");file-chooser
  		$("#file-chooser").val("");
  		$("#fileLister").html("");
  		filter = false;
  		Studio.getMedias(filter);
	});
	$("#filesearch").on("keypress", function() {
		filter = true;
		Studio.getMedias(filter);
	});
	$("body").on("change", "#widgetType", function() {
		var val = $(this).val();
		$('._wid').hide();
		if(val == "fullscreen") {
			$('.web').show();
		} else if(val == "crawler") {
			$('.crawler').show();
		} else if(val == "popup") {
			$('.popment').show();
		}  else if(val == "inline") {
			$('.web').show();
		}
	});
	$("#newWidgetForm").on('submit', function() {
		var type = $('#widgetType').val();
		var file;
		if(type == "fullscreen") {
			file = $("#website").val();
		} else if(type == "crawler") {
			file = $("#crawlertext").val();
		} else if(type == "popup") {
			file = $("#announcement").val();
		} else if(type == "inline") {
			file = $("#website").val();
		} 
		var _media ={};
		_media.name = $('#widgetlabel').val();
		_media.file = file;
		_media.type = type;
		ISSP.addWidget(_media);
		setTimeout(function() {Studio.getWidgets(false);}, 1000);
		$('#NewWidgetModal').modal('hide');
		return false;
	});
	$('#newCampaignForm').on('submit', function() {
			Studio.AddCampaign();
			return false;
	});
	$("body").on('click','#campaignlist .mediadragable span .fa', function() {
		Studio.RemoveCampaignItem($(this).attr("data-id"), $(this).attr("data-camp"));
		return false;
	});

	$("body").on('click','#timeframeview .campaigndragable span', function(e) {
		var indexId = $(this).attr("data-indexId");
		var zoneIndex = $(this).attr("data-zoneIndex");
		var time = $(this).attr("data-time");
		$(this).remove();
		Campaign.SaveToZone(indexId,zoneIndex,time);
		return false;
	});
	$("body").on('change','.screencheckbox', function(e) {
		if($(this).prop('checked') == true){
	    	if(active_template && scheduleObject.zones.length > 0) {
				var data = {};
				data.screen_id = $(this).attr('data-screenid');
				socket.emit('update', data);
				Studio.ApplyToScreen($(this));
			} 
		}
		
	});
});