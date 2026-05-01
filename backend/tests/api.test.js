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

  it('POST /api/translate should return 400 if targetLanguage is missing', (done) => {
    request(app)
      .post('/api/translate')
      .send({ texts: { test: 'hello' } })
      .expect(400)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body).to.have.property('error');
        done();
      });
  });

  it('POST /api/translate should return original text if targetLanguage is "en"', (done) => {
    request(app)
      .post('/api/translate')
      .send({ texts: { home: 'Home' }, targetLanguage: 'en' })
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body.translated.home).to.equal('Home');
        done();
      });
  });

  it('GET /non-existent-route should return 200 (index.html)', (done) => {
    request(app)
      .get('/non-existent-route')
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.header['content-type']).to.include('text/html');
        done();
      });
  });

  describe('Edge Cases', () => {
    it('POST /api/chat with empty message should return 400', (done) => {
      request(app)
        .post('/api/chat')
        .send({ message: '', mode: 'beginner' })
        .expect(400)
        .end((err, res) => {
          if (err) return done(err);
          expect(res.body).to.have.property('error');
          done();
        });
    });

    it('POST /api/translate with empty texts should return 200 with empty object', (done) => {
      request(app)
        .post('/api/translate')
        .send({ texts: {}, targetLanguage: 'hi' })
        .expect(200)
        .end((err, res) => {
          if (err) return done(err);
          expect(res.body.translated).to.be.empty;
          done();
        });
    });

    it('GET /api/reminders should return an array', (done) => {
      request(app)
        .get('/api/reminders')
        .expect(200)
        .end((err, res) => {
          if (err) return done(err);
          expect(res.body).to.be.an('array');
          done();
        });
    });
  });
});
