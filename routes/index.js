var express = require('express');
var router = express.Router();
/*const sessionManager = require('../helper/sessionManager');

router.use(sessionManager.initialize());
router.use((request, response, next) => {
    sessionManager.getSession(request)
        .then((session) => {
            next();
        })
        .catch((error) => {
            next(error);
        });
});*/
router.use('/api/devices', require('./devices'));

module.exports = router;
