const {Router} = require('express');
const jwtMiddleware = require('./jwt.middleware');
const authRouter = require('./auth');
const usersRouter = require('./users');
const articlesRouter = require('./articles');

const router = new Router();
module.exports = router;

router.use('/auth', authRouter);
router.use('/users', usersRouter);
router.use('/articles', jwtMiddleware, articlesRouter);
