
        var appId = '*******';
		 var filecount = 0;
		 var filecounter = 0;
         var roleArn = '*******';

        var bucketName = '*******';

        AWS.config.region = '*******';
		
		AWS.config.update({
			accessKeyId: "*******",
secretAccessKey: "*******",
				"region": "*******"  
			});
	   var elastictranscoder = new AWS.ElasticTranscoder({apiVersion: '2012-09-25'});


        var fbUserId;
       var  User = ISSP.auth.userdata[0];
		fbUserId = User.user_id;
	var Filestoupload = [];
	var _count = 0;
        var bucket = new AWS.S3({

            params: {

                Bucket: bucketName,
            }

        });

        var fileChooser = document.getElementById('file-chooser');
        var button = document.getElementById('upload-button');
	    var uploadprogress = document.getElementById('uploadprogress');
        var results = document.getElementById('results');
		$("#file-chooser").on("change", function() {
					$("#filelister").html("");

					//if(fbUserId) {
						 _count = 0;						
						$("#filelister").html("");
						//alert(_count);
						
						for (var i = 0; i <  fileChooser.files.length; i++) { 
						var file = fileChooser.files[i];
						if (!file.type.match('video.*') && !file.type.match('image/')) {
							alert("Only video are allowed!");
						  } else {
							Filestoupload[_count] = fileChooser.files;
							$("#fileLister").append("<li class='cfile"+_count+"'> <i class='fa fa-film'></i> "+file.name+" "+_count+"<span class='label label-success pull-right s3up s3upact' data-index='"+_count+"'><i class='fa fa-upload'></i>  Upload</span> <span class='label label-danger pull-right s3upremove s3upact s3upremove"+_count+"' data-index='"+_count+"'><i class='fa fa-trash'></i> Remove</span> <span class='label label-info progress-"+_count+"'>0%</span></li>");
							_count++;
						  }

						}
													
													
						//$("#upload-button").show();
					//} else {
						//alert("This features required facebook authentication!");
					//}
		});

	$("#fileLister ").on("click", ".s3up", function() {
		var index = $(this).attr("data-index");
		console.log(index);
		 $(this).hide();
		$(".s3upremove"+index).hide();
		console.log(Filestoupload[index]);
		_upload(Filestoupload[index], index);
	});

  $("#fileLister ").on("click", ".s3upremove", function() {
			var index = $(this).attr("data-index");
			$(".cfile"+index).hide();
	});



	function _upload(arrayfile, _index) {
				var file = arrayfile[_index];
				if (file) {
						
						results.innerHTML = '';
						console.log("Uploading...save file: " + file.name);
					
						var objKey = 'inventiv-client-' + fbUserId + '/' + file.name;

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
							 $(".progress-"+_index).html(prog);
						}).send(function (err, data) {
							if (err) {
								results.innerHTML = 'ERROR: ' + err;

							} else {
									console.log(data.Location);
									file.location = data.Location;
									file.advertiser_id = $('#_media-advertiser').val();
									ISSP.uploadMedia(file);
									filecounter++;
											//do_transcode(file);
											
											 $(".progress-"+_index).html("Complete");
									
									

								
								//listObjs();

							}

						});

					} else {

						results.innerHTML = 'Nothing to upload.';

					}
	
	} //end upload

     			
			
			
		function do_transcode(transcodeFile) {
			console.log("go transcode");
			//for (var i = 0; i <  fileChooser.files.length; i++) { 
						var file = transcodeFile;
						var removeExt = file.name.slice(0, -4);
						var filename = removeExt.replace(/\s/g, '').trim()+'.mp4';
			
				$.post( "/upload/save", { filesize: file.size, filename: filename, vtitle: removeExt, vdescription: removeExt, type: 1, catId: 0} , function( data ) {
					
					var res = $.parseJSON(data);
					if(res.status == 1) {
						var channel = res.cname;
						var params = {
									PipelineId: '1426479547539-1bbg80', /* required */
									  Input: { /* required */
										AspectRatio: 'auto',
										Container: 'auto',
										FrameRate: 'auto',
										Interlaced: 'auto',
										Key: 'facebook-'+fbUserId+'/'+file.name,
										Resolution: 'auto'
									  },
									  Outputs: [
										{
										  Key: channel+'/video360/'+filename.trim(),
										  PresetId: '1426480279262-qznfdn',
										  ThumbnailPattern: channel+'/thumb360/'+filename.trim()+'-{count}',
										},
										//{   Key: channel+'/video480/'+filename.trim(),
										//	PresetId: '1426480137573-4rjka8',
										//	ThumbnailPattern:channel+'/thumb480/'+filename.trim()+'-{count}',
										//},
										//{   Key: channel+'/video270/'+filename.trim(),
										//	PresetId: '1426480388012-cjjmev',
										//	ThumbnailPattern: channel+'/thumb270/'+filename.trim()+'-{count}',
										//}
									  ],
									  
									};
									
								elastictranscoder.createJob(params, function(err, data) {
									  if (err) console.log(err, err.stack); // an error occurred
									  else     console.log(data);           // successful response
									});
					} else {
						alert(res.remarks);
					}
				});
			
				
			//} //for end

							
		
		}
        function listObjs() {

            var prefix = 'facebook-' + fbUserId;

            bucket.listObjects({

                Prefix: prefix

            }, function (err, data) {

                if (err) {

                    results.innerHTML = 'ERROR: ' + err;

                } else {

                    var objKeys = "";

                    data.Contents.forEach(function (obj) {

                        objKeys += obj.Key + "<br>";

                    });
					console.log("Uploading OK");
                    results.innerHTML = objKeys;

                }

            });

        }

       
