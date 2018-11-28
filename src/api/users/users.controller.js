const db = require('../../db');

module.exports = {
  listUsers
};

async function listUsers(req, res, next) {
  let articles;

  try {
    articles = await db.users.find({});
  } catch (err) {
    return next(err);
  }

  res.status(200).json(articles).end();
}
