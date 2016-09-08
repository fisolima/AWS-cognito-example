(function() {

	var service = {};

	com.killpippo.services.aws = service;

	var logger = com.killpippo.logger;

	var comm = com.killpippo.services.comm;

	var loadPool = function(poolId, config) {
		AWS.config.region = config.region;
        AWS.config.credentials = new AWS.CognitoIdentityCredentials({
            IdentityPoolId: config.identityPoolId
        });

        // Cognito credential and User Pool Id
        AWSCognito.config.region = config.region;
        AWSCognito.config.credentials = new AWS.CognitoIdentityCredentials({
            IdentityPoolId: config.identityPoolId
        });

		var poolData = {
			UserPoolId : config.userPoolId,
			ClientId : config.clientId
		};
		var userPool =
			new AWSCognito.CognitoIdentityServiceProvider.CognitoUserPool(poolData);

		service[poolId] = service[poolId] || {};

		service[poolId].pool = userPool;

		logger.info("AWS loaded - " + poolId);
	};

	service.load = function() {
		com.killpippo.services.auth.cleanToken();

		comm.get('/api/config/dcs',
			function(err) {
				logger.error("Loading DCS Pool", err);
			},
			function(data) {
				loadPool('dcs', JSON.parse(data));
			});

		comm.get('/api/config/lsp',
			function(err) {
				logger.error("Loading LSP Pool", err);
			},
			function(data) {
				loadPool('lsp', JSON.parse(data));
			});
	};

	service.createUser = function(poolId, username, password, email, callback) {
		if (!service[poolId])
			return logger.error("AWS UserPool not loaded");

		var userPool = service[poolId].pool;

		var attributeList = [];

		var dataEmail = {
			Name : 'email',
			Value : email
		};

		var attributeEmail = new AWSCognito.CognitoIdentityServiceProvider.CognitoUserAttribute(dataEmail);

		attributeList.push(attributeEmail);

		userPool.signUp(username, password, attributeList, null, function(err, result){
			if (err) {
				logger.error("AWS Signup", err);

				return callback(err, null);
			}

			var cognitoUser = result.user;

			logger.info("AWS signed up", cognitoUser.getUsername());

			callback(null, result);
		});
	};

	service.confirmUser = function(poolId, username, code) {
		if (!service[poolId])
			return logger.error("AWS UserPool not loaded");

		var userPool = service[poolId].pool;

		var userData = {
			Username : username,
			Pool : userPool
		};

		var cognitoUser = new AWSCognito.CognitoIdentityServiceProvider.CognitoUser(userData);

		cognitoUser.confirmRegistration(code, true, function(err, result) {
			if (err)
				return logger.error("AWS User Confirm", err);

			logger.info("AWS User Confirm", result);
		});
	};

	service.loginUser = function(poolId, username, password, callback) {
		if (!service[poolId])
			return logger.error("AWS UserPool not loaded");

		var userPool = service[poolId].pool;

		var authenticationData = {
			Username : username,
			Password : password
		};

		var authenticationDetails = new AWSCognito.CognitoIdentityServiceProvider.AuthenticationDetails(authenticationData);

		var userData = {
			Username : username,
			Pool : userPool
		};

		var cognitoUser = new AWSCognito.CognitoIdentityServiceProvider.CognitoUser(userData);

		cognitoUser.authenticateUser(authenticationDetails, {
			onSuccess: function (result) {
				// logger.info("Access result", result);
				//
				// var accessToken = result.getAccessToken().getJwtToken();
				//
				// logger.info("Access garanted ", accessToken);
				//
				// var idToken = result.getIdToken().getJwtToken();
				//
				// logger.info("Access garanted", idToken);
				//
				// var payload = token.split('.')[1];
				// var parsedToken = JSON.parse(sjcl.codec.utf8String.fromBits(sjcl.codec.base64url.toBits(payload)));
				//
				// console.log('%o', parsedToken);

				result.getAccessToken().getJwtToken();

				com.killpippo.services.auth.storeToken(result);

				callback(null, result);
			},

			onFailure: function(err) {
				logger.error("Access failed", err);

				callback(err, null);
			},
			mfaRequired: function(codeDeliveryDetails) {
				var verificationCode = prompt('Please input verification code' ,'');

				cognitoUser.sendMFACode(verificationCode, this);
			}
		});
	};
}());
