const {OAuth2} = require('oauth');
const config = require('config');

const appId = config.get('oauth.facebook.appId');
const appSecret = config.get('oauth.facebook.appSecret');
const redirectUri = config.get('oauth.facebook.redirectUri');

class FacebookService {
  constructor() {
    this.oauth = new OAuth2(appId, appSecret, 'https://graph.facebook.com');
  }

  authenticate(code) {
    return new Promise((resolve, reject) => {
      this.oauth.getOAuthAccessToken(code, {redirect_uri: redirectUri}, (error, accessToken) => {
        if (error) {
          return reject(error);
        }

        this.oauth.getProtectedResource('https://graph.facebook.com/me', accessToken, (error, data) => {
          if (error) {
            return reject(error);
          }

          let info;
          try {
            info = JSON.parse(data);
          } catch (error) {
            return reject(error);
          }

          resolve(info);
        });
      });
    });
  }
}

module.exports = FacebookService;

