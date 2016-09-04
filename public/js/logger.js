
(function() {
	var logger = {};

	logger.error = function(message, data){
		console.log('ERROR! ' + '\n' + message + '\n' + JSON.stringify(data));
	};

	logger.info = function(message, data) {
		console.log('INFO:\n' + message + (data ? JSON.stringify(data) + '\n' : ''));
	};

	logger.warn = function(message, data) {
		console.log('WARNING:\n' + message + (data ? JSON.stringify(data) + '\n' : ''));
	};

	com.killpippo.logger = logger;
}());
