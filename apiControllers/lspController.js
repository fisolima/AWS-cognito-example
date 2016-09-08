var express = require('express');
var router = express.Router();
var logger = require('../services/Logger');

router.get('/', (req, res, next) => {
	logger.info("LSP request");

	res.status(200).end("LSP Resource");
});

module.exports = router;
