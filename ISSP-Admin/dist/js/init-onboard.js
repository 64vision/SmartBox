
var uploadFile;
var uploadPoster;
var uploadThumbnail;
var currentMedias;
$(function () {

		var url = window.location.pathname;
		var pagename = url.substring(url.lastIndexOf('/')+1);
		if(pagename == "singlesite.html") {

			ONBOARD.getSiteData();

		}
		if(!sessionStorage.Auth) {
			 window.location.assign("../login.html");
		} else {

			ONBOARD.getSites();
		}

		$('body').on("submit", '#newSiteForm', function() {
			
				var _data ={};
				_data.name = $('#site_name').val();
				_data.address = $('#site_address').val();
				_data.contact_person = $('#site_person').val();
				_data.contact_number = $('#site_contact_number').val();
				ONBOARD.addSite(_data);
				return false;
		})
		$("body").on('click', '#sitelist a', function() {
			//var siteid = $(this).attr("data-id");
			sessionStorage.site_id = $(this).attr("data-id");
			sessionStorage.site_name = $(this).attr("data-name");
			 window.location.assign("singlesite.html");
			return false;
		});
		$('body').on('click', '.update_siteBtn', function() {
			var _data ={};
				_data.name = $('#site_name').val();
				_data.address = $('#site_address').val();
				_data.contact_person = $('#site_contact_person').val();
				_data.contact_number = $('#site_contact_number').val();
			ONBOARD.updateSite(_data);
			return false;
		});

		$('body').on('submit', '#newCategoryForm', function() {
			var _data ={};
				_data.name = $('#cat_name').val();
				_data.cat_desc = $('#cat_desc').val();
				_data.parent = $('#cat_parent').val();
				_data.site_id = sessionStorage.site_id;
				//_data.contact_number = $('#site_contact_number').val();
			ONBOARD.addCategory(_data);
			return false;
		});

		$('body').on('submit', '#newMediaForm', function() {
			 $('.addBtn').button('loading');
				var _data ={};
				_data.title = $('#media_title').val();
				_data.description = $('#media_description').val();
				_data.site_id = sessionStorage.site_id;
				var cats = JSON.stringify(getSelectedCat());
				_data.categories = cats;
				ONBOARD.addMedia(_data);
			return false;
		});

		$("body").on('click', 'a.viewmedia', function() {
			sessionStorage.media_id = $(this).attr('data-id');
			$(".addBtn").hide();
			$(".updateBtn, .removeBtn").show();
			$("#NewMediaModal").modal('show');
			//	$("#NewMediaModal").modal('show');
				var obj = currentMedias;
			if(obj.status == 1) {
				if(obj.media.length > 0) {
				
					for (var i = 0; i < obj.media.length; i++) {
						if(obj.media[i].media_id == sessionStorage.media_id) {
							 $('#media_title').val(obj.media[i].title);
							 $('#media_description').val(obj.media[i].description);
							 $("#_File video").attr('src', obj.media[i].media_file);
							 $("#_poster").attr('src', obj.media[i].poster);
							 $("#_Thumbnail").attr('src', obj.media[i].thumbnail);
							break;
						}
						
					}
					
				}
			}
			return false;
		});

		$("body").on('click', '.openForm', function() {
 				$('#media_title').val("");
				 $('#media_description').val("");
				 $("#_File video").attr('src',"");
				 $("#_poster").attr('src', "");
				 $("#_Thumbnail").attr('src', "");
				 $('.addBtn').show();
				 $('.progress').html("");
				 	$("#NewMediaModal").modal('show');
			return false;
		});

		$("body").on('click', '.updateBtn', function() {
			$('.updateBtn').button('loading');
				var _data ={};
				_data.title = $('#media_title').val();
				_data.description = $('#media_description').val();
				_data.site_id = sessionStorage.site_id;
				var cats = JSON.stringify(getSelectedCat());
				_data.categories = cats;
					ONBOARD.updateMedia(_data);	
				return false;
		});

$("body").on('click', '.removeBtn', function() {
				var _data ={};
				_data.site_id = sessionStorage.site_id;
				_data.status = 0; 
				var r = confirm("Are you sure to remove this media?");
				if (r == true) {
				  	ONBOARD.updateMedia(_data);	
				  	$("#NewMediaModal").modal('hide');
				}
				
				return false;
		});

		$('#NewMediaModal').on('hidden.bs.modal', function (e) {
  			ONBOARD.getMedias();
  			$('.progress').html("");
  			$('.updateBtn').hide();
			$('.addBth').show();
		});


});

function getSelectedCat() {
	var cat = [];
	$('#catcheckboxes input:checkbox').each(function () {
       var sThisVal = (this.checked ? $(this).val() : "");
       if(sThisVal)
       		cat.push(sThisVal);
  	});	
  	return cat;
}