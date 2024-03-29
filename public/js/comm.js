
(function(){
	"use strict";

	var comm = {};

	com.killpippo.services.comm = comm;

	var logger = com.killpippo.logger;
	var auth = com.killpippo.services.auth;

	var processRequest = function(method, url, data, onError, onSuccess) {
		var xhr = new XMLHttpRequest();

		xhr.onreadystatechange = function() {
			if (xhr.readyState === 4) {
				switch (xhr.status)
				{
					case 200:
						onSuccess(xhr.responseText);
						break;

					default:
						onError(xhr.status, xhr.responseText);
						break;
				}
			}
		};

		xhr.open(method, url);

		var token = auth.getToken();

		if (token)
			xhr.setRequestHeader('Authorization', token);

		if (data) {
			xhr.setRequestHeader('Content-Type', 'application/json');

			xhr.send(JSON.stringify(data))
		}
		else {
			xhr.send();
		}
	};

	comm.get = function(url, onError, onSuccess) {
		processRequest('GET', url, null, onError, onSuccess);
	};

	comm.post = function(url, data, onError, onSuccess) {
		processRequest('POST', url, data, onError, onSuccess);
	};

	comm.put = function(url, data, onError, onSuccess) {
		processRequest('PUT', url, data, onError, onSuccess);
	};

	comm.delete = function(url, data, onError, onSuccess) {
		processRequest('DELETE', url, data, onError, onSuccess);
	};
}());
