const request = require('supertest');
const app = require('../index');
let expect;

before(async () => {
  const chai = await import('chai');
  expect = chai.expect;
});

/**
 * Unit tests for authentication middleware.
 * Verifies token validation behavior on protected routes.
 */
describe('Auth Middleware - /api/progress', () => {

  it('should return 401 when no Authorization header is provided', (done) => {
    request(app)
      .get('/api/progress')
      .expect(401)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body).to.have.property('error');
        expect(res.body.error).to.include('Unauthorized');
        done();
      });
  });

  it('should return 401 when Authorization header has no Bearer prefix', (done) => {
    request(app)
      .get('/api/progress')
      .set('Authorization', 'invalid-token-here')
      .expect(401)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body).to.have.property('error');
        expect(res.body.error).to.include('Unauthorized');
        done();
      });
  });

  it('should return 401 when Bearer token is empty', (done) => {
    request(app)
      .get('/api/progress')
      .set('Authorization', 'Bearer ')
      .expect(401)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body).to.have.property('error');
        done();
      });
  });

  it('should return 401 when Bearer token is invalid/expired', (done) => {
    request(app)
      .get('/api/progress')
      .set('Authorization', 'Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.invalid')
      .expect(401)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body).to.have.property('error');
        expect(res.body.error).to.include('Unauthorized');
        done();
      });
  });

  it('POST /api/progress/update should also require authentication', (done) => {
    request(app)
      .post('/api/progress/update')
      .send({ step: 'registration', completed: true })
      .expect(401)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body).to.have.property('error');
        done();
      });
  });
});
