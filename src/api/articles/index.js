const {Router} = require('express');
const controller = require('./articles.controller');

const router = new Router();
module.exports = router;

router.get('/', controller.listArticles);
router.get('/:articleId', controller.getArticleById);
router.post('/', controller.createArticle);
router.post('/:articleId', controller.updateArticleById);
router.delete('/:articleId', controller.removeArticleById);
