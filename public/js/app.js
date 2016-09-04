
(function() {
	"use strict";

	var app = {};

	var logger = com.killpippo.logger;

	app.load = function() {
		logger.info("AWS-cognito-example started!");

		com.killpippo.services.aws.load();
	};

	app.login = function(control) {
		var poolId = control.getAttribute('data-pool-id');

		var username = document.querySelector('input[data-type=login-username][data-pool-id=' + poolId + ']').value || '';
		var password = document.querySelector('input[data-type=login-password][data-pool-id=' + poolId + ']').value || '';

		if (username.length === 0 || password.length === 0)
			return alert('Missing mandatory parameters');

		com.killpippo.services.aws.loginUser(username, password);
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

		com.killpippo.services.aws.createUser(username, password, email);
	};

	app.confirmUserRegistration = function(control) {
		var poolId = control.getAttribute('data-pool-id');

		var username = document.querySelector('input[data-type=register-confirm-username][data-pool-id=' + poolId + ']').value;
		var code = document.querySelector('input[data-type=register-confirm-code][data-pool-id=' + poolId + ']').value;

		if (username.length === 0 || code.length === 0)
			return alert('Missing mandatory parameters');

		com.killpippo.services.aws.confirmUser(username, code);
	};

	com.killpippo.app = app;
}());

