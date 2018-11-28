const {expect} = require('chai');
const supertest = require('supertest');
const app = require('../../app');
const request = supertest(app);
const db = require('../../db');

describe('Articles', () => {
  let token;
  const testUsers = [{
    id: 123,
    firstName: 'Test1',
    lastName: 'User1',
    email: 'email@email.com'
  }, {
    id: 124,
    firstName: 'Test2',
    lastName: 'User2',
    email: 'email@gmail.com'
  }];

  beforeEach(async () => {
    await db.users.createMany(testUsers);
  });

  afterEach(async () => {
    await db.users.clear();
  });

  describe('GET /api/users', () => {
    it('should return users', async () => {
      const {body} = await request.get('/api/users')
          .set('Authorization', `Bearer ${token}`)
          .expect('Content-Type', /json/)
          .expect(200);

      expect(body).to.be.an('array').and.have.lengthOf(2);
    });
  });
});
