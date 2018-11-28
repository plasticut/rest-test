const {NotFound} = require('http-errors');
const db = require('../../db');

module.exports = {
  listArticles,
  getArticleById,
  createArticle,
  updateArticleById,
  removeArticleById
};

async function listArticles(req, res, next) {
  let articles;

  try {
    articles = await db.articles.find({owner: req.user.id});
  } catch (err) {
    return next(err);
  }

  res.status(200).json(articles).end();
}

async function getArticleById(req, res, next) {
  const {articleId} = req.params;
  let article;

  try {
    [article] = await db.articles.find({id: Number(articleId), owner: req.user.id});

    if (!article) {
      throw new NotFound(`Article ${articleId} not found`);
    }
  } catch (err) {
    return next(err);
  }

  res.status(200).json(article).end();
}

async function createArticle(req, res, next) {
  const data = req.body;
  let article;

  try {
    article = await db.articles.create(Object.assign(data, {owner: req.user.id}));
  } catch (err) {
    return next(err);
  }

  res.status(200).json(article).end();
}

async function updateArticleById(req, res, next) {
  const {articleId} = req.params;
  const data = req.body;
  let article;

  try {
    [article] = await db.articles.find({id: Number(articleId), owner: req.user.id});

    if (!article) {
      throw new NotFound(`Article ${articleId} not found`);
    }

    await db.articles.update(article, data);
  } catch (err) {
    return next(err);
  }

  res.status(200).json(article).end();
}

async function removeArticleById(req, res, next) {
  const {articleId} = req.params;
  let article;

  try {
    [article] = await db.articles.find({id: Number(articleId), owner: req.user.id});

    if (!article) {
      throw new NotFound(`Article ${articleId} not found`);
    }

    await db.articles.remove(article);
  } catch (err) {
    return next(err);
  }

  res.status(204).json().end();
}
