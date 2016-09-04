(function() {

	var service = {};

	com.killpippo.services.aws = service;

	var logger = com.killpippo.logger;

	service.load = function() {
		logger.info("AWS loading...");

		AWS.config.region = 'eu-west-1'; // Region
        AWS.config.credentials = new AWS.CognitoIdentityCredentials({
            IdentityPoolId: 'eu-west-1:710c4d3c-06f9-4884-8745-0acf075958a2'
        });

        // Cognito credential and User Pool Id
        AWSCognito.config.region = 'eu-west-1';
        AWSCognito.config.credentials = new AWS.CognitoIdentityCredentials({
            IdentityPoolId: 'eu-west-1:710c4d3c-06f9-4884-8745-0acf075958a2'
        });

		var poolData = {
			UserPoolId : 'eu-west-1_IB357mfCC', // your user pool id here
			ClientId : '4jln93ac35uk8ptqkv6cttnaap' // your app client id here
		};
		var userPool =
			new AWSCognito.CognitoIdentityServiceProvider.CognitoUserPool(poolData);

		logger.info("AWS loading - userPool generated");

		service.userPool = userPool;

		logger.info("AWS loaded");
	};

	service.createUser = function(username, password, email) {
		if (!service.userPool)
			return logger.error("AWS UserPool not created");

		var attributeList = [];

		var dataEmail = {
			Name : 'email',
			Value : email
		};

		var attributeEmail = new AWSCognito.CognitoIdentityServiceProvider.CognitoUserAttribute(dataEmail);

		attributeList.push(attributeEmail);

		service.userPool.signUp(username, password, attributeList, null, function(err, result){
			if (err)
				return logger.error("AWS Signup", err);

			var cognitoUser = result.user;

			logger.info("AWS signed up", cognitoUser.getUsername());
		});
	};

	service.confirmUser = function(username,code) {
		if (!service.userPool)
			return logger.error("AWS UserPool not created");

		var userData = {
			Username : username,
			Pool : service.userPool
		};

		var cognitoUser = new AWSCognito.CognitoIdentityServiceProvider.CognitoUser(userData);

		cognitoUser.confirmRegistration(code, true, function(err, result) {
			if (err)
				return logger.error("AWS User Confirm", err);

			logger.info("AWS User Confirm", result);
		});
	};

	service.loginUser = function(username, password) {
		if (!service.userPool)
			return logger.error("AWS UserPool not created");

		var authenticationData = {
			Username : username,
			Password : password
		};

		var authenticationDetails = new AWSCognito.CognitoIdentityServiceProvider.AuthenticationDetails(authenticationData);

		var userData = {
			Username : username,
			Pool : service.userPool
		};

		var cognitoUser = new AWSCognito.CognitoIdentityServiceProvider.CognitoUser(userData);

		cognitoUser.authenticateUser(authenticationDetails, {
			onSuccess: function (result) {
				logger.info("Access garanted", result.getAccessToken().getJwtToken());
			},

			onFailure: function(err) {
				logger.error("Access failed", err);
			},
			mfaRequired: function(codeDeliveryDetails) {
				var verificationCode = prompt('Please input verification code' ,'');

				cognitoUser.sendMFACode(verificationCode, this);
			}
		});
	};
}());
