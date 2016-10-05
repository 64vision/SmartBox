var Report = {
	ChartOptions: {
          //Boolean - If we should show the scale at all
          showScale: true,
          //Boolean - Whether grid lines are shown across the chart
          scaleShowGridLines: false,
          //String - Colour of the grid lines
          scaleGridLineColor: "rgba(0,0,0,.05)",
          //Number - Width of the grid lines
          scaleGridLineWidth: 1,
          //Boolean - Whether to show horizontal lines (except X axis)
          scaleShowHorizontalLines: true,
          //Boolean - Whether to show vertical lines (except Y axis)
          scaleShowVerticalLines: true,
          //Boolean - Whether the line is curved between points
          bezierCurve: true,
          //Number - Tension of the bezier curve between points
          bezierCurveTension: 0.3,
          //Boolean - Whether to show a dot for each point
          pointDot: false,
          //Number - Radius of each point dot in pixels
          pointDotRadius: 4,
          //Number - Pixel width of point dot stroke
          pointDotStrokeWidth: 1,
          //Number - amount extra to add to the radius to cater for hit detection outside the drawn point
          pointHitDetectionRadius: 20,
          //Boolean - Whether to show a stroke for datasets
          datasetStroke: true,
          //Number - Pixel width of dataset stroke
          datasetStrokeWidth: 2,
          //Boolean - Whether to fill the dataset with a color
          datasetFill: true,
          //String - A legend template
          legendTemplate: "<ul class=\"<%=name.toLowerCase()%>-legend\"><% for (var i=0; i<datasets.length; i++){%><li><span style=\"background-color:<%=datasets[i].lineColor%>\"></span><%if(datasets[i].label){%><%=datasets[i].label%><%}%></li><%}%></ul>",
          //Boolean - whether to maintain the starting aspect ratio or not when responsive, if set to false, will take up entire container
          maintainAspectRatio: true,
          //Boolean - whether to make the chart responsive to window resizing
          responsive: true
    },
	GenerateChart: function(element, _labels, _data) {
		var areaChartCanvas = $(element).get(0).getContext("2d");
        // This will get the first returned node in the jQuery collection.
        var areaChart = new Chart(areaChartCanvas);

        var areaChartData = {
          labels: _labels,
          datasets: [
            {
              label: "Views",
              fillColor: "rgba(60,141,188,0.9)",
              strokeColor: "rgba(60,141,188,0.8)",
              pointColor: "#3b8bba",
              pointStrokeColor: "rgba(60,141,188,1)",
              pointHighlightFill: "#fff",
              pointHighlightStroke: "rgba(60,141,188,1)",
              data: _data
            }
          ]
        };

       

         areaChart.Line(areaChartData, this.ChartOptions);

	},

	GetCampaign: function(media_id) {
		var obj = ISSP.auth;
		var _params = {};
		_params.token = obj.token;
		_params.user_id = obj.userdata[0].user_id;
		_params.media_id = media_id;
		
		$.post(ISSP.server + 'media/getcampaign', _params, function(res) {
			var resobj = JSON.parse(res);
			if(resobj.status == 1) {
				$("._campaign_number").html(resobj.items.length);
			}

		});

	},
	GetScreen:function(media_id) {

		var obj = ISSP.auth;
		var _params = {};
		_params.token = obj.token;
		_params.user_id = obj.userdata[0].user_id;
		_params.media_id = media_id;
		
		$.post(ISSP.server + 'media/getscreen', _params, function(res) {
			var resobj = JSON.parse(res);
			if(resobj.status == 1) {
				$("._screen_number").html(resobj.items.length);
			}

		});
	},

	GetSchedule:function(media_id) {

		var obj = ISSP.auth;
		var _params = {};
		_params.token = obj.token;
		_params.user_id = obj.userdata[0].user_id;
		_params.media_id = media_id;
		
		$.post(ISSP.server + 'media/getschedule', _params, function(res) {
			var resobj = JSON.parse(res);
			if(resobj.status == 1) {
				$("._schedule_number").html(resobj.items.length);
			}

		});
	},

	GetStorage:function(media_id) {

		var obj = ISSP.auth;
		var _params = {};
		var gb = 0;
		_params.token = obj.token;
		_params.user_id = obj.userdata[0].user_id;
		$.post(ISSP.server + 'user/storage', _params, function(res) {
			var resobj = JSON.parse(res);
			console.log(resobj);
			if(resobj.status == 1) {
			var b = resobj.user[0].totalsize;
			
			if(!isNaN)
				gb = parseInt(b) / 1024 / 1024 /1024;
			$("._storage").html(gb + " GB");
				//$("._schedule_number").html(resobj.items.length);
			}

		});
	},

	GetViews:function(media_id) {

		var obj = ISSP.auth;
		var _params = {};
		_params.token = obj.token;
		_params.user_id = obj.userdata[0].user_id;
		_params.media_id = media_id;
		$("._view_number").html("");
		$.post(ISSP.server + 'media/getviews', _params, function(res) {
			var resobj = JSON.parse(res);
			console.log(resobj);
			if(resobj.status == 1) {
				$("._view_number").html(resobj.items[0].views);
			}

		});
	},

	GetStats:function(media_id, viewby) {

			var obj = ISSP.auth;
			var _params = {};
			_params.token = obj.token;
			_params.user_id = obj.userdata[0].user_id;
			_params.media_id = media_id;
			_params.viewby =viewby;
			
			$.post(ISSP.server + 'media/getstats', _params, function(res) {
				
				var resobj = JSON.parse(res);
				if(resobj.status == 1) {
					var labels = [];
					var datas = []
					for (var i = 0; i < resobj.items.length; i++) {
							labels.push(moment(resobj.items[i].log).format('L'));
							datas.push(resobj.items[i].views);
					};

					setTimeout(function() {Report.GenerateChart("#areaChart", labels, datas);}, 300);
				}

			});
	},
//var md = new MobileDetect(
	GetAdsStats:function(media_id, viewby) {

			var obj = ISSP.auth;
			var _params = {};
			_params.token = obj.token;
			_params.user_id = obj.userdata[0].user_id;
			_params.media_id = media_id;
			_params.viewby =viewby;
			var total_views = 0;
			$.post(ISSP.server + 'media/getads_stats', _params, function(res) {
				
				var resobj = JSON.parse(res);
				console.log(resobj);
				if(resobj.status == 1) {
					var labels = [];
					var datas = []
					for (var i = 0; i < resobj.items.length; i++) {
							labels.push(moment(resobj.items[i].log).format('L'));
							datas.push(resobj.items[i].views);
							total_views = total_views + resobj.items[i].views;
							console.log(resobj.items[i].views);
					};

					$("._view_number").html(total_views);

					setTimeout(function() {Report.GenerateChart("#areaChart", labels, datas);}, 300);
				}

			});
	},


	GetPlatform:function(media_id) {

			var obj = ISSP.auth;
			var _params = {};
			_params.token = obj.token;
			_params.user_id = obj.userdata[0].user_id;
			_params.media_id = media_id;
			//_params.viewby =viewby;
			var html;
			var total_views = 0;
			var others = 0;
			var iOS  = 0;
			var android  = 0;
			$.post(ISSP.server + 'media/getads_platform', _params, function(res) {
				
				var resobj = JSON.parse(res);
				$("#os_stats").html("");
				console.log(resobj);
				if(resobj.status == 1) {
					var labels = [];
					var datas = []
					for (var i = 0; i < resobj.items.length; i++) {
						var md = new MobileDetect(resobj.items[i].agent);
						var osname;
						osname = md.mobile();
						console.log(osname);
						if(md.is('iPhone')) {
							iOS = iOS + resobj.items[i].views;
						}
						if(osname != "iPhone" && osname != "UnknownTablet") {
							android=android + resobj.items[i].views;;
						} 
						if(osname == "null" || osname == "UnknownTablet") {
							others=others + resobj.items[i].views;;
						} 

					};

					var total = others + android + iOS;
					var iosPer = (iOS/total) * 100;
					var andPer = (android/total) * 100;
					var othersPer = (others/total) * 100;
					
					html = '<div class="progress-group">';
					html = html +  '<span class="progress-text">iOS</span>';
					html = html +  '<span class="progress-number"><b>'+iOS+'</b></span>';
					html = html +  '<div class="progress sm">';
					html = html +  '<div class="progress-bar progress-bar-aqua" style="width: '+iosPer.toFixed(2)+'%"></div>';
					html = html +  '</div>';
					html = html +  '</div>';
					$("#os_stats").append(html);

					html = '<div class="progress-group">';
					html = html +  '<span class="progress-text">Android</span>';
					html = html +  '<span class="progress-number"><b>'+android+'</b></span>';
					html = html +  '<div class="progress sm">';
					html = html +  '<div class="progress-bar progress-bar-green" style="width: '+andPer.toFixed(2)+'%"></div>';
					html = html +  '</div>';
					html = html +  '</div>';
					$("#os_stats").append(html);


					html = '<div class="progress-group">';
							html = html +  '<span class="progress-text">Others</span>';
							html = html +  '<span class="progress-number"><b>'+others+'</b></span>';
							html = html +  '<div class="progress sm">';
							html = html +  '<div class="progress-bar progress-bar-red" style="width: '+othersPer.toFixed(2)+'%"></div>';
							html = html +  '</div>';
							html = html +  '</div>';
							$("#os_stats").append(html);

					
				}

			});
	},
	loadSummary: function() {

		var obj = ISSP.auth;
		var _params = {};
		_params.token = obj.token;
		_params.user_id = obj.userdata[0].user_id;
		
		$.post(ISSP.server + 'user/getsummary', _params, function(res) {
			
			var resobj = JSON.parse(res);
			if(resobj.status == 1) {
				var labels = [];
				var datas = []
				for (var i = 0; i < resobj.items.length; i++) {
						labels.push(moment(resobj.items[i].log).format('L'));
						datas.push(resobj.items[i].views);
				};

				setTimeout(function() {Report.GenerateChart("#summaryChart", labels, datas);}, 300);
			}

		});
	}

}//report object