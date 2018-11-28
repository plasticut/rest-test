const {Router} = require('express');
const facebookController = require('./oauth/facebook');

const router = new Router();
module.exports = router;

router.use('/oauth/facebook', facebookController);
