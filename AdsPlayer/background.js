var debugMode = false;
var gLaunchData;
var windowOptions = {
	'frame': 'none',
	'left': 0,
	'top': 0,
	'width': screen.width,
	'height':  screen.height
};
var os;

function launchApp(launchData) {

    console.log('Application started. launchData:');
    console.log(launchData);
    getCurrentOS();
}

function getCurrentOS() {
    	chrome.runtime.getPlatformInfo(function(info) {
		os = info.os;
		getDisplayProperties();
    	});
}

function getDisplayProperties() {
	chrome.system.display.getInfo(function(displays) {
		console.log(displays[0].bounds.left);	
		var f_mon=0;var f_left=0;var f_top=0;var max_width=0;var max_height=0;var total_width=0;var total_height=0;
		for (var i = 0; i < displays.length; i++) {
		        var display = displays[i];
		        if(os == "win") {
		        	if(display.bounds.left > f_left) {f_left=display.bounds.left;f_mon=i;}
		        	if(display.bounds.top > f_top) {f_top=display.bounds.top;f_mon=i;}
		        	if(display.bounds.width > max_width) {max_width=display.bounds.width;}
		        	if(display.bounds.height > max_height) {max_height=display.bounds.height;}
			} else {
				if(display.bounds.left === 0 && display.bounds.top === 0) {
					total_width=display.bounds.width;
					total_height=display.bounds.height;	
				}
			}
		}
		
		if(os == "win") {
			var display = displays[f_mon];
			windowOptions.width = display.bounds.left+max_width;
			windowOptions.height = display.bounds.top+max_height;
		} else {
			windowOptions.width = total_width;
			windowOptions.height = total_height;
		}
		
		if(os != "win" || displays.length === 1) {
			windowOptions.state = debugMode ? 'normal' : 'fullscreen';
		}
		startViewer();
	});
}

function startViewer() {
    console.log('debugMode = ' + debugMode + ' | screenWidth = ' + windowOptions.width + ' | screenHeight = ' + windowOptions.height + ' | state = ' + windowOptions.state + ' | os = ' + os);
    chrome.app.window.create('index.html', windowOptions,
    function (win) {
    	gLaunchData = {'debugMode': debugMode, 'windowOptions': windowOptions, 'os' : os, 'sockets': []};
        win.contentWindow.launchData = gLaunchData;
        win.onClosed.addListener(handleOnWinClosed);
    });
}

function handleOnWinClosed() {
	console.log("app is closing...");
	console.log(gLaunchData);
	//close opened sockets
	for ( var i = 0; i < gLaunchData.sockets.length; i++) {
		chrome.socket.destroy(gLaunchData.sockets[i]);
	}
	chrome.power.releaseKeepAwake();
};


chrome.runtime.onUpdateAvailable.addListener(function(details) {
	if (os == "cros") {
		console.log("updating to version " + details.version);
		chrome.runtime.reload();
	} else {
		log("[reload - not supported on "+os+", new version will be available on app restart]");
       	}	
});

chrome.power.requestKeepAwake("display");
chrome.app.runtime.onLaunched.addListener(launchApp);