const {Unauthorized} = require('http-errors');
const FacebookService = require('./facebook.service');
const db = require('../../../../db');
const AuthService = require('../../auth.service');

const facebookService = new FacebookService();

module.exports = {
  callback
};

async function callback(req, res, next) {
  /* eslint-disable camelcase */
  const {code} = req.body;

  try {
    if (!code) {
      throw new Unauthorized();
    }

    let info;
    try {
      info = await facebookService.authenticate(code);
    } catch (error) {
      throw new Unauthorized();
    }

    let [user] = await db.users.find({'auth.facebook.id': info.id});
    if (!user) {
      user = await db.users.create({
        email: res.email,
        firstName: res.first_name,
        lastName: res.last_name,
        'auth.facebook.id': info.id
      });
    }

    const authService = new AuthService();
    const token = await authService.createTokenForUser(user);
    res.status(200).json({token}).end();
  } catch (error) {
    return next(error);
  }
  /* eslint-enable camelcase */
}
