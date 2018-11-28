const {expect} = require('chai');
const supertest = require('supertest');
const app = require('../../app');
const request = supertest(app);
const AuthService = require('../auth/auth.service');
const db = require('../../db');

describe('Articles', () => {
  let token;
  const testUser = {
    id: 123,
    firstName: 'Test',
    lastName: 'User',
    email: 'emal@email.com'
  };
  const testArticles = [
    {name: 'Article 1', owner: testUser.id},
    {name: 'Article 2', owner: testUser.id},
    {name: 'Article 3', owner: 1}
  ];

  beforeEach(async () => {
    await db.users.create(testUser);
    await db.articles.createMany(testArticles);

    const authService = new AuthService();
    token = await authService.createTokenForUser(db.users.items[0]);
  });

  afterEach(async () => {
    await db.articles.clear();
    await db.users.clear();
  });

  describe('GET /api/articles', () => {
    it('should check token', () =>
      request.get('/api/articles')
          .expect('Content-Type', /json/)
          .expect(401)
    );

    it('should return articles', async () => {
      const {body} = await request.get('/api/articles')
          .set('Authorization', `Bearer ${token}`)
          .expect('Content-Type', /json/)
          .expect(200);

      expect(body).to.be.an('array').and.have.lengthOf(2);
    });
  });

  describe('GET /api/articles/:articleId', () => {
    it('should check token', () =>
      request.get(`/api/articles/${testArticles[2].id}`)
          .expect('Content-Type', /json/)
          .expect(401)
    );

    it('should return article', async () => {
      const testArticle = testArticles[1];
      await request.get(`/api/articles/${testArticle.id}`)
          .set('Authorization', `Bearer ${token}`)
          .expect('Content-Type', /json/)
          .expect({
            id: testArticle.id,
            name: testArticle.name,
            owner: testUser.id
          })
          .expect(200);
    });

    it('should return 404', async () => {
      const testArticle = testArticles[2];
      await request.get(`/api/articles/${testArticle.id}`)
          .set('Authorization', `Bearer ${token}`)
          .expect('Content-Type', /json/)
          .expect({
            error: `Article 3 not found`
          })
          .expect(404);
    });
  });
});
