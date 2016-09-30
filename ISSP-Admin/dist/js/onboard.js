var ONBOARD = {
	server: 'http://localhost:8081/',
	auth: JSON.parse(sessionStorage.Auth),
	getSites: function () {
		var obj = this.auth;
		var _params = {};
		_params.token = obj.token;
		_params.user_id = obj.userdata[0].user_id;
		$.post(this.server + 'site/get', _params, function(res) {
			var obj = JSON.parse(res);
			var html;
			if(obj.status == 1) {
				$("#sitelist").html("");
				if(obj.sites.length > 0) {
				
					for (var i = 0; i < obj.sites.length; i++) {
						html = "<tr>";
						html = html + "<td><a hre='#' data-name='"+obj.sites[i].name+"' data-id='"+obj.sites[i].site_id+"'>"+obj.sites[i].name+" <i class='fa fa-external-link'></i></a></td>";
						html = html + "<td>"+obj.sites[i].address+"</td>";
						html = html + "<td>"+obj.sites[i].created+"</td>";
						html = html + "</tr>";
						$("#sitelist").append(html);
					}
					
				}
			}
		});
	},
	addSite: function(_data) {
		var obj = this.auth;
		var _params = {};
		_params.token = obj.token;
		_params.user_id = obj.userdata[0].user_id;
		_params.site = '['+JSON.stringify(_data)+']';
		$.post(this.server + 'site/add', _params, function(res) {
			var obj = JSON.parse(res);
			if(obj.status == 1) {
				ONBOARD.getSites();
			} else {
				alert("Error");
			}
			$("#NewSiteModal").modal('hide');
		});
	},
	getSiteData: function() {
		var obj = this.auth;
		var _params = {};
		_params.token = obj.token;
		_params.user_id = obj.userdata[0].user_id;
		_params.site_id = sessionStorage.site_id;
		$.post(this.server + 'site/getsite', _params, function(res) {
			var obj = JSON.parse(res);
			var html;
			if(obj.status == 1) {
				//$("#sitedetails").html("");
				if(obj.sites.length > 0) {
					for (var i = 0; i < obj.sites.length; i++) {
						$("#site_name").val(obj.sites[0].name);
						$("#site_address").val(obj.sites[0].address);
						$("#site_contact_person").val(obj.sites[0].contact_person);
						$("#site_contact_number").val(obj.sites[0].contact_number);
						$("#logoPreview").attr('src', obj.sites[0].logo);
					}
					
				}
			}
		});
		ONBOARD.getCategories();
		ONBOARD.getMedias();
	},
	getCategories: function() {
		var obj = this.auth;
		var _params = {};
		_params.token = obj.token;
		_params.user_id = obj.userdata[0].user_id;
		_params.site_id = sessionStorage.site_id;
		$.post(this.server + 'site/getcat', _params, function(res) {
			var obj = JSON.parse(res);
			console.log(obj)
			var html;
			var selecthtml;
			var checkboxhtml;
			var currentloop = 0;
			if(obj.status == 1) {
				$("#cat_list").html("");
				$("#cat_parent").html("");
				selecthtml = '<option value="0">--Select Parent Category--</option>'
				$("#cat_parent").append(selecthtml);
				if(obj.categories.length > 0) {
				
					for (var i = 0; i < obj.categories.length; i++) {
						console.log(obj.categories[i].cat_id + ':' + currentloop);

						if(obj.categories[i].cat_id != currentloop) {

							html = "<tr><td><strong>"+obj.categories[i].name+"</strong></td></tr>";
							selecthtml = '<option value="'+obj.categories[i].cat_id+'">'+obj.categories[i].name+'</option>';
							checkboxhtml = '<label><input type="checkbox"  value="'+obj.categories[i].cat_id+'" class="minimal"> <strong>'+obj.categories[i].name+'</strong></label>';	
							if(obj.categories[i].sub_name){
								html = html + "<tr><td>--"+obj.categories[i].sub_name+"</td></tr>";
								selecthtml = selecthtml+ '<option value="'+obj.categories[i].sub_id+'">--' +obj.categories[i].sub_name+'</option>';
								checkboxhtml = checkboxhtml + '<label><input type="checkbox"  value="'+obj.categories[i].sub_id+'" class="minimal"> --'+obj.categories[i].sub_name+'</label>';	
							}
						} else {
							if(obj.categories[i].sub_name){
								html =  "<tr><td>--"+obj.categories[i].sub_name+"</td></tr>";
								selecthtml = '<option value="'+obj.categories[i].cat_id+'">--' +obj.categories[i].sub_name+'</option>';
								checkboxhtml = '<label><input type="checkbox"  value="'+obj.categories[i].sub_id+'" class="minimal"> --'+obj.categories[i].sub_name+'</label>';	
							}
						}

						currentloop = obj.categories[i].cat_id;
						
						$("#cat_list").append(html);
						$("#cat_parent").append(selecthtml);
						$("#catcheckboxes").append(checkboxhtml);
					}
					
				}
			}
		});
	},
	updateSite: function(_data) {
		var obj = this.auth;
		var _params = {};
		//alert();
		_params.token = obj.token;
		_params.user_id = obj.userdata[0].user_id;
		_params.site_id = sessionStorage.site_id;
		_params.site = '['+JSON.stringify(_data)+']';
		$.post(this.server + 'site/update', _params, function(res) {
			var obj = JSON.parse(res);
			console.log(obj);
			if(obj.status == 1) {
				alert('Site Updated');
			}
		});
	},

	addSite: function(_data) {
		var obj = this.auth;
		var _params = {};
		_params.token = obj.token;
		_params.user_id = obj.userdata[0].user_id;
		_params.site = '['+JSON.stringify(_data)+']';
		$.post(this.server + 'site/add', _params, function(res) {
			var obj = JSON.parse(res);
			if(obj.status == 1) {
				ONBOARD.getSites();
			} else {
				alert("Error");
			}
			$("#NewSiteModal").modal('hide');
		});
	},

	addCategory: function(_data) {
		var obj = this.auth;
		var _params = {};

		_params.token = obj.token;
		_params.user_id = obj.userdata[0].user_id;
		_params.category = '['+JSON.stringify(_data)+']';
		$.post(this.server + 'site/addcat', _params, function(res) {
			var obj = JSON.parse(res);
			if(obj.status == 1) {
				ONBOARD.getCategories();
			} else {
				alert("Error");
			}
			$("#NewCategoryModal").modal('hide');
		});
	},
	
	addMedia: function(_data) {
		var obj = this.auth;
		var _params = {};
		_params.token = obj.token;
		_params.user_id = obj.userdata[0].user_id;
		_params.media = '['+JSON.stringify(_data)+']';
		$.post(this.server + 'site/addmedia', _params, function(res) {
			var obj = JSON.parse(res);
			if(obj.status == 1) {
				sessionStorage.media_id = obj.media_id;
					if(uploadFile)
						_upload(uploadFile,'file');

			}
		});
	},

	updateMedia: function(_data) {
		var obj = this.auth;
		var _params = {};
		_params.token = obj.token;
		_params.user_id = obj.userdata[0].user_id;
		_params.media_id = sessionStorage.media_id;
		_params.media = '['+JSON.stringify(_data)+']';
		$.post(this.server + 'site/updatemedia', _params, function(res) {
			var obj = JSON.parse(res);
			console.log(obj);
			$('.updateBtn').button('reset');
			
		});
	},

	getMedias: function(_data) {
		var obj = this.auth;
		var _params = {};
		_params.token = obj.token;
			_params.user_id = obj.userdata[0].user_id;
			_params.site_id = sessionStorage.site_id;
		$.post(this.server + 'site/getmedia', _params, function(res) {
			var obj = JSON.parse(res);
			currentMedias = obj;
			var html;
			if(obj.status == 1) {
				$('#mediatable').html("");
				if(obj.media.length > 0) {
				
					for (var i = 0; i < obj.media.length; i++) {
						 html= '<tr>';
						html= html+   '<td><img width="50"src="'+obj.media[i].thumbnail+'"/></td>';
						html= html+    '<td><a href="#" class="viewmedia" data-id="'+obj.media[i].media_id+'">'+obj.media[i].title+'</a></td>'
						html= html+    '<td>'+moment(obj.media[i].uploaded_date).format("M/DD/YYYY h:mm:ss a");+'</td>'
						html= html+    '<td>'+obj.media[i].views+'</td>'
						html= html+ '</tr>';
                      	 $('#mediatable').append(html);
					}
					
				}
				$("#example1").DataTable();
			}
		});
	},



}