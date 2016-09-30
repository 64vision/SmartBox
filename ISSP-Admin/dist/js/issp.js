var _Campaigns;
$(function () { 
	var  socket = io("http://prod.inventiv.ph",{path: '/server1'});
	$('#Main').show();

	if(!sessionStorage.Auth) {
		 window.location.assign("login.html");
		
	} else {
		var logged_user = JSON.parse(sessionStorage.Auth);
		 	ISSP.getScreens();
		 	ISSP.getCampaigns();
		 	ISSP.getMedias();
			ISSP.getSchedules();
			ISSP.getGroup();
			Report.loadSummary();
			Report.GetStorage();

		 $('.logfullname').html(logged_user.userdata[0].fullname);
	}
	$('.sidebar-menu li a._slide').on('click', function() {

			var clickID = $(this).attr('href');
			var pageTitle = $(clickID).attr('data-title');
			$('.viewpanel').hide('slide', {direction: 'right'}, 300);
			$('.viewpanel').removeClass('showviewpanel');
			$(".sidebar-menu li" ).removeClass('active');
			$(this).closest( "li" ).addClass('active');
			$(''+clickID+'').addClass('showviewpanel');

			setTimeout(function() {

				$('.pageTitle').html(pageTitle);
				$(''+clickID+'').show('slide', {direction: 'left'}, 300);	

			}, 300);
				
			return false;

	});
	$("#viewscreengroup").on('change', function() {
		ISSP.filterScreen($(this).val());

	});

	$('#newCampaignForm').on('submit', function() {
			ISSP.addCampaign();
			return false;
	});

 	$('#newMediaForm').submit(function() {
		//ISSP.addMedia();
		return false;
	
    });

    $('#newScheduleForm').submit(function() {
    		ISSP.addSchedule();
			return false;
	
    });  
    $(".newGroupBtn").on('click', function() {
 
    	$(".newgroupblock").fadeIn();

    });

    $("#newScreenForm").on('submit', function() {
    	if($("#newscreenname").val() && $("#newscreengroup").val()) {
			ISSP.screenRequest();
    	} else {
    		alert("Please enter name and select group!");
    	}
    	return false;
    });

    $('.addGroupBtn').on('click', function() {
    	if($("#newGroupName").val()) {
    		ISSP.addNewGroup();
    		$(".newgroupblock").fadeOut();
    	} else {
    		alert('Enter group name!');
    	}
    	return false;

    });
    $(".signoutbtn").on("click", function() {
    	sessionStorage.clear();
    	 window.location.assign("issp.html");
    	return false;
    });

    //Timepicker
    $(".timepicker").timepicker({
      showInputs: false
    });

	$('#reportRange').daterangepicker();
	$('#reportRange').on('change', function() {
		Report.GetStats(Global_active_media);
	});

	$('#IsspModal9').on('show.bs.modal', function (e) {
  		ISSP.getTemplates();
	});

	$("body").on('click', '.trashBtn', function() {
		var m;
		if($(this).attr("data-type") == "media") {
			m = "You are going to remove this asset.";
		}
		var r = confirm(m);
		if (r == true) {
		   ISSP.Remove($(this));
		}
		
		return false
	});
	$("body").on('click', '.editBtn', function() {

		if($(this).attr("data-type") == "media") {
			$("#IsspModal3 .modal-title").html('Edit media asset');
			$('#IsspModal3').modal('show');
		}
	});

	$('#IsspModal3').on('hidden.bs.modal', function (e) {
 		$('#media-name').val("");
		$('#media-file').val("");
		$('#media-type').val("");
	});
	$("#ResetScreenBtn").on("click", function() {
		
		var data = {};
				data.screen_id = Global_active_screen;
				socket.emit('update', data);
		return false;
	});

});

