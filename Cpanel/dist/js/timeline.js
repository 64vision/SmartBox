var Timeline = {
	Load:function(ele) {
		$("#timeframeview").html("");
		var timelength = 1;
		var zone = 4;
		var headerhtml;
		var zonehtml;
		headerhtml = "<tr>";
		headerhtml = headerhtml + "<th style='width: 170px'>Zones</th>";
		for (var i = 0; i < timelength;i++) {
			headerhtml = headerhtml + "<th>Campaign(s)</th>";
		}
		headerhtml = headerhtml + "</tr>";
		$("#timeframeview").append(headerhtml);
		
		
	},
} //
