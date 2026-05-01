const request = require('supertest');
const app = require('../index');
let expect;

describe('API Integration Tests', () => {
  
  before(async () => {
    const chai = await import('chai');
    expect = chai.expect;
  });

  it('GET /api/health should return ok', (done) => {
    request(app)
      .get('/api/health')
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body).to.deep.equal({ status: 'ok' });
        done();
      });
  });

  it('GET /api/config/maps should return an API key', (done) => {
    request(app)
      .get('/api/config/maps')
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body).to.have.property('apiKey');
        done();
      });
  });

  it('POST /api/chat should return a bot reply or handled error', (done) => {
    request(app)
      .post('/api/chat')
      .send({ message: 'Hello', mode: 'beginner', language: 'en' })
      .end((err, res) => {
        if (err) return done(err);
        if (res.status === 200) {
          expect(res.body).to.have.property('reply');
        } else {
          expect(res.status).to.equal(500);
          expect(res.body).to.have.property('error');
        }
        done();
      });
  });
});
