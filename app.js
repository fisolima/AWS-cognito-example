
var express = require('express');
var app = express();
var EJS  = require('ejs');
var path = require('path');
var logger = require('./services/Logger');
var userService = require('./services/UserService');
var sjcl = require('sjcl');
var config = require('./config.json');

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.engine('html', EJS.renderFile);

app.use(express.static(path.join(__dirname, 'public')));

app.use('/', require('./controllers/homeController'));
app.use('/api/config', require('./apiControllers/configController'));

app.use('/api/restricted/:poolId', function(req, res, next) {
	var token = req.header('Authorization');

	logger.info("Auth token:", token);

	if (!token || token.length === 0) {
		logger.error("Unauthenticated request", req.params.poolId);

		return res.status(400).end('Missing token');
	}

	var accessToken = JSON.parse(token).accessToken.jwtToken;

	logger.info("Auth token:", accessToken);

	var payload = accessToken.split('.')[1];
	var parsedToken = JSON.parse(sjcl.codec.utf8String.fromBits(sjcl.codec.base64url.toBits(payload)));

	logger.info("Auth token:", parsedToken);

	if (config[req.params.poolId].clientId !== parsedToken.client_id) {
		logger.error("Unauthorized request", req.params.poolId);

		return res.status(401).end('User not allowed to access this request');
	}

	next();
});

app.use('/api/restricted/lsp', require('./apiControllers/lspController'));
app.use('/api/restricted/dcs', require('./apiControllers/dcsController'));

app.listen(3000, () => {
	logger.info('Application stater at 3000');
});

//userService.load();

// userService.createUser('testawscognito7@yopmail.com', '123456', 'testawscognito7@yopmail.com', function(err,result) {
// 	if (err)
// 		logger.warn('', err);
// 	else
// 		logger.info('Success', result);
// });

// userService.loginUser('testawscognito2@yopmail.com', '123456', function(err,result) {
// 	if (err)
// 		logger.warn('', err);
// 	else
// 		logger.info('Success', result);
// });

module.exports = app;