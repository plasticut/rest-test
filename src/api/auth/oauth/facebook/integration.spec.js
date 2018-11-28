const {expect} = require('chai');
const sinon = require('sinon');
const supertest = require('supertest');
const {OAuth2} = require('oauth');
const app = require('../../../../app');
const request = supertest(app);
const db = require('../../../../db');

describe('Auth by Facebook OAuth', () => {
  const testUser = {
    id: 123,
    firstName: 'Test',
    lastName: 'User',
    email: 'emal@email.com',
    'auth.facebook.id': 'facebook user id'
  };
  let stubs = [];

  beforeEach(async () => {
    await db.users.create(testUser);

  });

  afterEach(async () => {
    await db.users.clear();
    stubs.forEach(stub => stub.restore());
  });

  describe('POST /api/auth/oauth/facebook', () => {
    const code = 'test auth code';
    const testUserInfo = {
      id: 'facebook user id'
    };

    it('should return token for existing user', async () => {
      stubs = [
        sinon.stub(OAuth2.prototype, 'getOAuthAccessToken').yields(null, 'test access token'),
        sinon.stub(OAuth2.prototype, 'getProtectedResource').yields(null, JSON.stringify(testUserInfo))
      ];

      const {body} = await request.post('/api/auth/oauth/facebook')
          .send({
            code
          })
          .expect('Content-Type', /json/)
          .expect(200);

      expect(body).to.be.an('object');
      expect(body.token).to.be.an('string');

      expect(db.users.items.length).to.be.equal(1);
    });

    it('should return token for new user', async () => {
      const testUserInfo = {
        id: 'facebook user id 2',
        last_name: 'Last name',
        first_name: 'First name',
        email: 'email@gmail.com'
      };

      stubs = [
        sinon.stub(OAuth2.prototype, 'getOAuthAccessToken').yields(null, 'test access token'),
        sinon.stub(OAuth2.prototype, 'getProtectedResource').yields(null, JSON.stringify(testUserInfo))
      ];

      const {body} = await request.post('/api/auth/oauth/facebook')
          .send({
            code
          })
          .expect('Content-Type', /json/)
          .expect(200);

      expect(body).to.be.an('object');
      expect(body.token).to.be.an('string');

      expect(db.users.items.length).to.be.equal(2);
    });

    it('should return 401', async () => {
      stubs = [
        sinon.stub(OAuth2.prototype, 'getOAuthAccessToken').yields(new Error()),
        sinon.stub(OAuth2.prototype, 'getProtectedResource').yields(null, JSON.stringify(testUserInfo))
      ];

      await request.post('/api/auth/oauth/facebook')
          .send({
            code
          })
          .expect('Content-Type', /json/)
          .expect(401);
    });

    it('should return 401', async () => {
      stubs = [
        sinon.stub(OAuth2.prototype, 'getOAuthAccessToken').yields(null, 'test access token'),
        sinon.stub(OAuth2.prototype, 'getProtectedResource').yields(new Error())
      ];

      await request.post('/api/auth/oauth/facebook')
          .send({
            code
          })
          .expect('Content-Type', /json/)
          .expect(401);
    });
  });
});
