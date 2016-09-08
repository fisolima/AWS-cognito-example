(function(){
	"use strict";

	var auth = {};

	com.killpippo.services.auth = auth;

	auth.storeToken = function(token) {
		window.localStorage.setItem('kp-auth-token', JSON.stringify(token));
	};

	auth.cleanToken = function() {
		window.localStorage.removeItem('kp-auth-token');
	};

	auth.getToken = function() {
		return window.localStorage.getItem('kp-auth-token');
	};
}());
