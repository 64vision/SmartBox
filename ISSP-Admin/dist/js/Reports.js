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
		
		$.post(ISSP.server + 'media/getviews', _params, function(res) {
			var resobj = JSON.parse(res);
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