const {Router} = require('express');
const controller = require('./facebook.controller');

const router = new Router();
module.exports = router;

router.post('/', controller.callback);
