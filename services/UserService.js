
var logger = require('./Logger');
var AWS = require('aws-sdk');

//var AWSCognito = require('../aws-cognito-node/src/index');
//var CognitoUserPool = AWSCognito.CognitoIdentityServiceProvider.CognitoUserPool;

var AWSCognito = AWS;
var AmazonCognitoIdentity = require('amazon-cognito-identity-js');
var CognitoUserPool = AmazonCognitoIdentity.CognitoUserPool;

var _userPool = null;

var load = function() {
	if (_userPool)
		return;

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
	var userPool = new CognitoUserPool(poolData);

	logger.info("AWS loading - userPool generated");

	_userPool = userPool;

	logger.info("AWS loaded");
};

var createUser = function(username, password, email, callback) {
	if (!_userPool) {
		var msg = "AWS UserPool not created";

		logger.error(msg);

		return callback(msg);
	}

	var attributeList = [];

	var dataEmail = {
		Name : 'email',
		Value : email
	};

	var attributeEmail = new AWSCognito.CognitoIdentityServiceProvider.CognitoUserAttribute(dataEmail);

	attributeList.push(attributeEmail);

	_userPool.signUp(username, password, attributeList, null, function(err, result){
		if (err) {
			logger.error("AWS Signup", err);

			return callback(err);
		}

		var cognitoUser = result.user;

		logger.info("AWS signed up", cognitoUser.getUsername());

		callback(null, cognitoUser);
	});
};

var confirmUser = function(username,code, callback) {
	if (!_userPool) {
		var msg = "AWS UserPool not created";

		logger.error(msg);

		return callback(msg);
	}

	var userData = {
		Username : username,
		Pool : service.userPool
	};

	var cognitoUser = new AWSCognito.CognitoIdentityServiceProvider.CognitoUser(userData);

	cognitoUser.confirmRegistration(code, true, function(err, result) {
		if (err) {
			logger.error("AWS User Confirm", err);

			return callback(err);
		}

		logger.info("AWS User Confirm", result);

		callback(null, result);
	});
};

var loginUser = function(username, password, callback) {
	if (!_userPool) {
		var msg = "AWS UserPool not created";

		logger.error(msg);

		return callback(msg);
	}

	var authenticationData = {
		Username : username,
		Password : password
	};

	var authenticationDetails = new AWSCognito.CognitoIdentityServiceProvider.AuthenticationDetails(authenticationData);

	var userData = {
		Username : username,
		Pool : _userPool
	};

	var cognitoUser = new AWSCognito.CognitoIdentityServiceProvider.CognitoUser(userData);

	logger.info('', cognitoUser);

	cognitoUser.authenticateUser(authenticationDetails, {
		onSuccess: function (result) {
			var token = result.getAccessToken().getJwtToken();

			logger.info("Access garanted", token);

			callback(null, token)
		},

		onFailure: function(err) {
			logger.error("Access failed", err);

			callback(err);
		},
		mfaRequired: function(codeDeliveryDetails) {
			// var verificationCode = prompt('Please input verification code' ,'');
			//
			// cognitoUser.sendMFACode(verificationCode, this);
		}
	});
};

module.exports = {
	load: load,
	createUser: createUser,
	confirmUser: confirmUser,
	loginUser: loginUser
};

