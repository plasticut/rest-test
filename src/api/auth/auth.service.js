const fs = require('fs');
const Path = require('path');
const jwt = require('jsonwebtoken');

const certPath = 'certs';
const privateKey = fs.readFileSync(Path.join(certPath, 'privatekey.pem'));
const publicKey = fs.readFileSync(Path.join(certPath, 'certificate.pem'));

class AuthService {
  constructor() {
  }

  verifyToken(token) {
    return jwt.verify(token, publicKey);
  }

  createTokenForUser(user) {
    const token = jwt.sign({
      sub: user.id
    }, privateKey, {
      algorithm: 'RS256',
      expiresIn: 3600
    });

    return token;
  }
}

module.exports = AuthService;
