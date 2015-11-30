/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
var expresscaredomain = "expresscareguam.com";
var app_version="1.0.1";
var baseUrl = "http://www.expresscareguam.com/";
var googleanalyticsid = 'UA-57301113-22';
var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
		document.addEventListener("offline", this.onOffline, false);
        document.addEventListener('deviceready', this.onDeviceReady, false);
		navigator.splashscreen.hide();
    },
	onOffline: function() {	
		window.location  = "park.html";
		//alert('Cannot connect to server!');
		//navigator.app.exitApp();		
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'
    onDeviceReady: function() {
		
        app.receivedEvent('deviceready');
		sessionStorage.openedIAB = 1;	
		sessionStorage.page= undefined;		
    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {
		var isIABLoaded=0;
		var networkState = checkConnection();		
			if (networkState == Connection.NONE) {				
				  setTimeout(function(){ window.location  = "park.html";}, 5000);
			}
			else{				
				var ref = cordova.InAppBrowser.open(baseUrl, '_blank', 'location=no,hidden=yes,zoom=no,toolbar=no,suppressesIncrementalRendering=yes,disallowoverscroll=yes');
			}	 
		
		ref.addEventListener("loadstop", function() {
			if(isIABLoaded==0){
					ref.show();						
					isIABLoaded=1;
				}
				//alert("loading stop");
				 //navigator.notification.activityStop();				
		});
		

		ref.addEventListener("loadstart", closeInAppBrowser);
		
		ref.addEventListener("loaderror", loaderrorcheck)
		function loaderrorcheck(event) {//alert(event.url);
				if(event.url.match("tel:") || event.url.match("mailto:"))
				{	
					execinsideiap1('history.back();location.reload();');
					ref.addEventListener('loadstart', closeInAppBrowser);
					ref.addEventListener('loaderror', loaderrorcheck);
				}
				else{
					//alert('error: ' + event.message);
				}
		}
		
		ref.addEventListener('exit', function(event) {			
			if (sessionStorage.openedIAB &&  sessionStorage.openedIAB == 1) {
				sessionStorage.openedIAB = 0;
				//navigator.app.exitApp(); 
				if(navigator.app){
					navigator.app.exitApp();
				}else if(navigator.device){
					navigator.device.exitApp();
					
				}
			}
		});
		
		function closeInAppBrowser(event) {
			//alert(event.url);
			//setTimeout(function(){execcssinsideiap1('body{background:#BBB;}');},100);
			
			//execcssinsideiap1('body{background:#BBB;}');
			//execinsideiap1('document.body.innerHTML = "";');
			//document.getElementById('div1').style.display = 'block';
			//#preloader, #status
			execinsideiap1("document.getElementById('preloader').style.display = 'block';document.getElementById('status').style.display = 'block';");
			
			var extension = event.url.substr(event.url.lastIndexOf('.')+1);
			if (event.url.match("/closeapp")) {
				//alert(event.url.match("/closeapp"));
				ref.close();
			}
			else if(extension=="pdf" || extension=="docx" || extension=="xlsx"){
				var openpdf = confirm("Clicking this link will download the document to your device. You will need to re-enter the app by clicking the app icon on your device.");
				if(openpdf==true){
					iap1 = window.open(event.url, "_system",null);
				}
				execinsideiap1('history.back();location.reload(true);');
				iap1.addEventListener('loadstart', closeInAppBrowser);
				iap1.addEventListener('loaderror', loaderrorcheck);
			}
			else if (!event.url.match(expresscaredomain) && event.url!="") {//alert(123);
				iap1 = window.open(event.url, "_system",null);
				execinsideiap1('history.back();location.reload();');
				iap1.addEventListener('loadstart', closeInAppBrowser);
				iap1.addEventListener('loaderror', loaderrorcheck);
			}
		};
		function execinsideiap1(pcode) {
			ref.executeScript({
				code: pcode
			}, function() {});
		}
		function execcssinsideiap1(pcode) {
				ref.insertCSS({
					code: pcode
				}, function(
				) {});
		}
		
		window.analytics.startTrackerWithId(googleanalyticsid);
		window.analytics.trackView('Home Screen');
		window.analytics.trackEvent('Home', 'DeviceReady', 'Hits', 1); 
		
		function handleOpenURL(url) {
		  setTimeout(function() {
			//alert("received url: " + url);
			ref = cordova.InAppBrowser.open(baseUrl, '_blank', 'location=no,hidden=yes,zoom=no,toolbar=no');
		  }, 0);
		}		
    }	
};

function checkConnection() {
	var networkState = navigator.network.connection.type;
	var states = {};
	states[Connection.UNKNOWN]  = 'Unknown connection';
	states[Connection.ETHERNET] = 'Ethernet connection';
	states[Connection.WIFI]     = 'WiFi connection';
	states[Connection.CELL_2G]  = 'Cell 2G connection';
	states[Connection.CELL_3G]  = 'Cell 3G connection';
	states[Connection.CELL_4G]  = 'Cell 4G connection';
	states[Connection.NONE]     = 'No network connection';
						  
	return networkState;
			  
}