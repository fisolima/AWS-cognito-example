
(function() {
	"use strict";

	var app = {};

	var logger = com.killpippo.logger;

	app.load = function() {
		logger.info("AWS-cognito-example started!");

		com.killpippo.services.aws.load();
	};

	var resultControl = document.getElementById('result');
	var loginStatusControl = document.getElementById('loginStatus');


	app.login = function(control) {
		var poolId = control.getAttribute('data-pool-id');

		var username = document.querySelector('input[data-type=login-username][data-pool-id=' + poolId + ']').value || '';
		var password = document.querySelector('input[data-type=login-password][data-pool-id=' + poolId + ']').value || '';

		if (username.length === 0 || password.length === 0)
			return alert('Missing mandatory parameters');

		com.killpippo.services.aws.loginUser(poolId, username, password, function(err, data) {
			if (err) {
				loginStatusControl.innerHTML = "&lt;disconnected&gt;";

				resultControl.className = 'result resultError';
				resultControl.innerHTML = "Login failed<br>" + JSON.stringify(err);

				return;
			}

			loginStatusControl.innerHTML = username + ' (' + poolId + ')';
			resultControl.className = 'result resultSuccess';
			resultControl.innerHTML = JSON.stringify(data);
		});
	};

	app.registerUser = function(control) {
		var poolId = control.getAttribute('data-pool-id');

		var username = document.querySelector('input[data-type=register-username][data-pool-id=' + poolId + ']').value || '';
		var email = document.querySelector('input[data-type=register-email][data-pool-id=' + poolId + ']').value || '';
		var password = document.querySelector('input[data-type=register-password][data-pool-id=' + poolId + ']').value || '';
		var confirmPassword = document.querySelector('input[data-type=register-confirm-password][data-pool-id=' + poolId + ']').value || '';

		if (username.length === 0 || email.length === 0 || password.length === 0)
			return alert('Missing mandatory parameters');

		if (password !== confirmPassword)
			return alert('Password does not match');

		com.killpippo.services.aws.createUser(poolId, username, password, email, function(err, data) {
			if (err) {
				resultControl.className = 'result resultError';
				resultControl.innerHTML = "Register failed<br>" + JSON.stringify(err);

				return;
			}

			resultControl.className = 'result resultSuccess';
			resultControl.innerHTML = JSON.stringify(data);
		});
	};

	app.confirmUserRegistration = function(control) {
		var poolId = control.getAttribute('data-pool-id');

		var username = document.querySelector('input[data-type=register-confirm-username][data-pool-id=' + poolId + ']').value;
		var code = document.querySelector('input[data-type=register-confirm-code][data-pool-id=' + poolId + ']').value;

		if (username.length === 0 || code.length === 0)
			return alert('Missing mandatory parameters');

		com.killpippo.services.aws.confirmUser(username, code);
	};

	var comm = com.killpippo.services.comm;

	app.callDCSApi = function() {
		comm.get('/api/restricted/dcs',
			function(err) {
				resultControl.className = 'result resultError';
				resultControl.innerHTML = "Request error<br>" + JSON.stringify(err);
			},
			function(data) {
				resultControl.className = 'result resultSuccess';
				resultControl.innerHTML = JSON.stringify(data);
			});
	};

	app.callLSPApi = function() {
		comm.get('/api/restricted/lsp',
			function(err) {
				resultControl.className = 'result resultError';
				resultControl.innerHTML = "Request error<br>" + JSON.stringify(err);
			},
			function(data) {
				resultControl.className = 'result resultSuccess';
				resultControl.innerHTML = JSON.stringify(data);
			});
	};

	com.killpippo.app = app;
}());

