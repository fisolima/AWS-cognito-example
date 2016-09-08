var express = require('express');
var router = express.Router();
var logger = require('../services/Logger');

router.get('/', (req, res, next) => {
	logger.info("DCS request");

	res.status(200).end("DCS Resource");
});

module.exports = router;