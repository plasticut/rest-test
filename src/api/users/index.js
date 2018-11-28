const {Router} = require('express');
const controller = require('./users.controller');

const router = new Router();
module.exports = router;

router.get('/', controller.listUsers);
