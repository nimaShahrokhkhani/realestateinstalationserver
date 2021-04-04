const controller = require('./controller');
const router = require('express').Router();

router.use('/', controller);

module.exports = router;
