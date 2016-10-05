var Campaign = {
	dragSrcEl: '',
	intDragable:function() {
		
		var cols = document.querySelectorAll('.issp .campaigndragable');
			[].forEach.call(cols, function(col) {
					col.addEventListener('dragstart', Campaign.DragStart, false);
					col.addEventListener('dragenter', Campaign.DragEnter, false);
					col.addEventListener('dragover', Campaign.DragOver, false);
					col.addEventListener('dragleave', Campaign.DragLeave, false);
					 col.addEventListener('drop', Campaign.Drop, false);
					col.addEventListener('dragend', Campaign.DragEnd, false);
			});
	},
	DragStart:function(e) {
		//console.log("DragStart");
		 this.style.opacity = '0.5';  // this / e.target is the source node.
  		Campaign.dragSrcEl = this;
  		//sconsole.log(Campaign.dragSrcEl);
	},
	DragOver: function(e){

		 if (e.preventDefault) {
    		e.preventDefault(); // Necessary. Allows us to drop.
  		}
  		e.dataTransfer.dropEffect = 'move';  // See the section on the DataTransfer object.
  		return false;
	},
	DragEnter: function(e){
		this.classList.add('over');
	},
	DragLeave: function(e){
		this.classList.remove('over');
	},
	Drop: function(e){
		//console.log("Drop");
		if (e.stopPropagation) {
   			 e.stopPropagation(); // stops the browser from redirecting.
  		}
  			// See the section on the DataTransfer object.
  			//console.log($(e.srcElement).attr('data-time'));
  			// Don't do anything if dropping the same column we're dragging.
  		var zoneIndex = $(e.srcElement).attr("data-index");
  		var indexId =  "#" + $(e.srcElement).attr("id");
  		//console.log(indexId);
  		if(e.srcElement.tagName == "TD" && $(Campaign.dragSrcEl).attr('class') == "box-title campaigndragable") {
  			var time = $(e.srcElement).attr("data-time");
  			$(e.srcElement).append('<span class="btn btn-default btn-xs" data-time="'+time+'"data-zoneIndex="'+zoneIndex+'" data-indexId="'+indexId+'" data-campId="'+$(Campaign.dragSrcEl).attr('data-id') +'">' + $(Campaign.dragSrcEl).html() + ' <i class="fa fa-times"></i></span>');
  			Campaign.SaveToZone(indexId,zoneIndex,time);
  			
  		}
  			
  		return false;
	},
	DragEnd: function(e){
		$('.content .campaigndragable').removeClass('over');
		$('.content .mediadragable').removeClass('over');
		 this.style.opacity = '1';
	},
	SaveToZone: function(indexId,zoneIndex,time) {
		//zoneid-zoneIndex
		var parentID = "#zoneid-" + zoneIndex;
		setTimeout(function() {
  				var items;
  				var obj = JSON.parse(scheduleObject.zones[zoneIndex]);
  				obj.timeslot = []; //reset obj
  				if($(parentID + " span" ).length > 0) {
  					$(parentID + " span" ).each(function( index ) {
  					items = $( this ).attr('data-campId');
  					time = $( this ).attr('data-time');
	  				obj.timeslot.push('{"time":"'+time+'","campaigns":'+items+'}');
	  				scheduleObject.zones[zoneIndex] = JSON.stringify(obj);
	  				
	  				//items = [];
	  				});
  				} else {
  					scheduleObject.zones[zoneIndex] =JSON.stringify(obj);
  				}
  				//console.log(scheduleObject.zones);
  				Campaign.SaveToScreen();
  			},200);
	},
	SaveToScreen: function() {
		$('input:checked').each(function () {
    			Studio.ApplyToScreen($(this));
    			
		});

	}


} //

var Media = {
	intDragable:function() {
		
		var cols = document.querySelectorAll('.issp .mediadragable');
			[].forEach.call(cols, function(col) {
					col.addEventListener('dragstart', Campaign.DragStart, false);
					col.addEventListener('dragenter', Campaign.DragEnter, false);
					col.addEventListener('dragover', Campaign.DragOver, false);
					col.addEventListener('dragleave', Campaign.DragLeave, false);
					 col.addEventListener('drop', Media.Drop, false);
					col.addEventListener('dragend', Campaign.DragEnd, false);
			});
	},

	Drop: function(e){
		console.log("Media");
		if (e.stopPropagation) {
   			 e.stopPropagation(); // stops the browser from redirecting.
  		}
  		if(e.srcElement.tagName == "DIV" && $(Campaign.dragSrcEl).attr('class') == "mediadragable") {
			var _campaign ={};
			_campaign.campaign_id = $(e.srcElement).attr('data-id');
			_campaign.media_id =  $(Campaign.dragSrcEl).attr('data-id');
			_campaign.media_name =$(Campaign.dragSrcEl).attr('data-file');;
			console.log(_campaign);
  			Studio.AddCampaignItem(_campaign);
  				Studio.GetCampaignItems(_campaign.campaign_id);
  			//$(e.srcElement).append('<span class="btn btn-default btn-xs">' + $(Campaign.dragSrcEl).html() + ' <i class="fa fa-times"></i></span>');
  		}
  			
  		return false;
	},
}//Class end
