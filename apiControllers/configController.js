var express = require('express');
var router = express.Router();
var config = require('../config.json');

router.get('/:poolId', (req, res, next) => {
	var poolConfig = config[req.params.poolId];

	if (!poolConfig)
		return res.status(400).end();

	res.status(200).json(poolConfig);
});

module.exports = router;
