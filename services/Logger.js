"use strict";

var colors = require('colors/safe');

var logType = {
	error: 'ERROR',
	warning: 'WARNING',
	info: 'INFO'
};


var writeError = function (message, obj)
{
	var e = (obj instanceof Error) ? obj : new Error('stackquery');

	console.error(
		colors.red(
			logType.error +	' - ' + (new Date()) + '\n' +
			message + '\n' +
			((obj !== undefined) ? JSON.stringify(obj) : '') + '\n' +
			e.stack + '\n'));
};

var writeWarning = function (message, obj)
{
	console.warn(
		colors.yellow(
			logType.warning + ' - ' + (new Date()) + '\n' +
			message + '\n' +
			((obj !== undefined) ? JSON.stringify(obj) + '\n' : '')));
};

var writeInfo = function (message, obj)
{
	console.log(
		colors.blue(
			logType.info + ' - ' + (new Date()) + '\n' +
			message + '\n' +
			((obj !== undefined) ? JSON.stringify(obj) + '\n' : '')));
};

module.exports =
{
	error: writeError,
	warn: writeWarning,
	info: writeInfo
};


