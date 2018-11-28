const {Unauthorized} = require('http-errors');
const AuthService = require('./auth/auth.service');
const db = require('../db');

module.exports = async function(req, res, next) {
  try {
    const token = getToken(req);

    if (!token) {
      throw new Unauthorized();
    }

    const authService = new AuthService();
    try {
      req.userInfo = authService.verifyToken(token);
    } catch (e) {
      throw new Unauthorized();
    }

    const [user] = await db.users.find({id: req.userInfo.sub});

    if (!user) {
      throw new Unauthorized();
    }

    req.user = user;
  } catch (err) {
    return next(err);
  }

  next();
};

function getToken(req) {
  let token;

  if (req.headers && req.headers.authorization) {
    const parts = req.headers.authorization.split(' ');
    if (parts.length == 2) {
      if (/^Bearer$/i.test(parts[0])) {
        token = parts[1];
      }
    } else {
      return;
    }
  }

  if (req.body && req.body['access_token']) {
    if (token) {
      return;
    }
    token = req.body['access_token'];
  }

  if (req.query && req.query['access_token']) {
    if (token) {
      return;
    }
    token = req.query['access_token'];
  }

  return token;
}
