/**
 * Flash Notes - a web-based musical flash card game
 * 
 * Copyright Jon Ensminger 2011
 * 
 * Class for Ajax basic utilities
 */ 

/* constructor */
AjaxUtilities = function (){	
	var xhr, xml,
		req_status = false,
		that = this,
		type = -1;
	this.createXHR = function (){
		xhr = new XMLHttpRequest();	
	}
	this.getXHR = function (){	
		return xhr;
	}
	this.open = function (mode, url){
		try {
			xhr.open(mode, url, true);
		}
		catch (e){
			req_status = false;
		}
	}
	this.send = function (t, msg){
		try {
		xhr.setRequestHeader("Content-type","application/x-www-form-urlencoded");
		xhr.send(msg);
		}
		catch (e) {
			req_status = false;
		}
	}
	this.onChange = function (){
		var txt, i, s, d, t;
		if (xhr.readyState === 4){
			if (xhr.status === 200 || xhr.statusText === 'OK'){
				req_status = true;
				xml = xhr.responseXML;
				s = xml.getElementsByTagName("score");
				t = xml.getElementsByTagName("time");
				ds = xml.getElementsByTagName("date_string");
				ts = xml.getElementsByTagName("time_string");
				for (i = 0; i < s.length; i++){
					statusModel.top_scores[i] = s[i].childNodes[0].nodeValue;
					statusModel.top_times[i] = t[i].childNodes[0].nodeValue;
					statusModel.top_date_strings[i] = ds[i].childNodes[0].nodeValue;
					statusModel.top_time_strings[i] = ts[i].childNodes[0].nodeValue;
				}
			}
			else {
				req_status = false;
			}
			gameController.displayFinalScore(req_status);
			$('#main_menu_button').show();
		}		
	}
}