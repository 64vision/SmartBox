var appId = '1075830449126209';
var filecount = 0;
var filecounter = 0;
var roleArn = 'arn:aws:iam::441204750735:role/isspRole';

var bucketName = 'isspbucket';

AWS.config.region = 'ap-southeast-1';

AWS.config.update({
accessKeyId: "AKIAJIH3VLSVHHKH6XWQ",
secretAccessKey: "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",
"region": "ap-southeast-1"  
});
 var bucket = new AWS.S3({
            params: {
                Bucket: bucketName,
            }
});
var  User = ISSP.auth.userdata[0];
fbUserId = User.user_id;


      $("#uploadLogo").on('change', function() {
      	console.log($(this));
      		var reader = new FileReader();
      		//console.log(this.files[0]);
			if (this.files[0].type.match('image/')) {
			    reader.onload = function (e) {
			        // get loaded data and render thumbnail.
			        document.getElementById("logoPreview").src = e.target.result;
			        $("#logoPreview").attr('src', e.target.result);
			    };
			    // read the image file as a data URL.

			    reader.readAsDataURL(this.files[0]);
			    _upload(this.files[0], 'logo');
			   } else {
			   	alert("Only image allowed!");
			   }

	      });

       $("#uploadFile").on('change', function() {
      	
      		var reader = new FileReader();
      		//console.log(this.files[0]);
				if (this.files[0].type.match('video/')) {
			    reader.onload = function (e) {
			        // get loaded data and render thumbnail.
			        document.getElementById("logoPreview").src = e.target.result;
			        $("#_File video").attr('src', e.target.result);

			    };
			    // read the image file as a data URL.

			    reader.readAsDataURL(this.files[0]);
			   uploadFile = this.files[0];
			   } else {
			   	alert("Only image video for now!");
			   }

	      });

       $("#uploadPoster").on('change', function() {
      	console.log($(this));
      		var reader = new FileReader();
      		//console.log(this.files[0]);
			if (this.files[0].type.match('image/')) {
			    reader.onload = function (e) {
			        // get loaded data and render thumbnail.
			        //document.getElementById("logoPreview").src = e.target.result;
			        $("#_poster").attr('src', e.target.result);
			    };
			    // read the image file as a data URL.

			    reader.readAsDataURL(this.files[0]);
			    uploadPoster = this.files[0];
			   } else {
			   	alert("Only image allowed!");
			   }

	      });

        $("#uploadThumbnail").on('change', function() {
      	console.log($(this));
      		var reader = new FileReader();
      		//console.log(this.files[0]);
			if (this.files[0].type.match('image/')) {
			    reader.onload = function (e) {
			        // get loaded data and render thumbnail.
			        //document.getElementById("logoPreview").src = e.target.result;
			        $("#_Thumbnail	").attr('src', e.target.result);
			    };
			    // read the image file as a data URL.

			    reader.readAsDataURL(this.files[0]);
			   	uploadThumbnail = this.files[0];
			   } else {
			   	alert("Only image allowed!");
			   }

	      });


function _upload(filetolupload,concern) {
				var file = filetolupload;
				if (file) {
						var fileExt = file.name.split('.').pop();
						//results.innerHTML = '';
						//console.log("Uploading...save file: " + md5(file.name);
					
						var objKey = 'inventiv-client-' + fbUserId + '/' + md5(file.name)+'.'+fileExt;

						var params = {

							Key: objKey,

							ContentType: file.type,

							Body: file,

							ACL: 'public-read'

						};
						var options = {partSize: 5 * 1024 * 1024, queueSize: 1};
						bucket.upload(params, options).
						 on('httpUploadProgress', function(evt) {
							 var percent = Math.round((evt.loaded/evt.total) * 100);
							 var prog = ''+percent + '%';
							//console.log(prog);
							 $(".progress").html('<span class="label label-success" style="width:'+prog+'">'+prog+'</span>');
						}).send(function (err, data) {
							if (err) {
								//results.innerHTML = 'ERROR: ' + err;

							} else {
									console.log(data.Location);
									$(".progress").html('<span class="label label-success" style="width:100%">Complete</span>');
									var _data  = {};
									if(concern == 'logo') {
										_data.logo = data.Location;
										ONBOARD.updateSite(_data);
									} 
									if(concern == 'file') {
										_data.media_file = data.Location;
										ONBOARD.updateMedia(_data);
										$(".progress").html("upload poster");
										uploadFile=null;
										if(uploadPoster)
											_upload(uploadPoster,'poster');
									}
									if(concern == 'poster') {
										_data.poster = data.Location;
										ONBOARD.updateMedia(_data);
										$(".progress").html("upload thumbnail");
										uploadPoster=null;
										if(uploadThumbnail)
											_upload(uploadThumbnail,'thumb');
									}
									if(concern == 'thumb') {
										_data.thumbnail = data.Location;
										uploadThumbnail=null;
										ONBOARD.updateMedia(_data);
										 $('.addBtn').button('reset');
									}
								
									
									
							}

						});

					} else {

						results.innerHTML = 'Nothing to upload.';

					}
	
	} //end upload

  		
			
			
		

       
