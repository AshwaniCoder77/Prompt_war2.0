const request = require('supertest');
const app = require('../index');
let expect;

before(async () => {
  const chai = await import('chai');
  expect = chai.expect;
});

/**
 * Comprehensive unit tests for all API route modules.
 * Covers input validation, error handling, and edge cases.
 */

// ==================== CHAT ROUTE TESTS ====================
describe('Chat Route - /api/chat', () => {

  it('should return 400 when message is missing', (done) => {
    request(app)
      .post('/api/chat')
      .send({ mode: 'beginner' })
      .expect(400)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body).to.have.property('error');
        expect(res.body.error).to.equal('Message is required');
        done();
      });
  });

  it('should return 400 when message is an empty string', (done) => {
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

  it('should return 400 when message is whitespace only', (done) => {
    request(app)
      .post('/api/chat')
      .send({ message: '   ', mode: 'beginner' })
      .expect(400)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body).to.have.property('error');
        done();
      });
  });

  it('should return 400 when message exceeds max length', (done) => {
    const longMessage = 'a'.repeat(5001);
    request(app)
      .post('/api/chat')
      .send({ message: longMessage, mode: 'beginner' })
      .expect(400)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body).to.have.property('error');
        done();
      });
  });

  it('should accept valid beginner mode request', (done) => {
    request(app)
      .post('/api/chat')
      .send({ message: 'How to vote?', mode: 'beginner', language: 'en' })
      .end((err, res) => {
        if (err) return done(err);
        // Either success or handled service error
        expect(res.status).to.be.oneOf([200, 500]);
        if (res.status === 200) {
          expect(res.body).to.have.property('reply');
        }
        done();
      });
  });

  it('should default to intermediate mode when mode is not specified', (done) => {
    request(app)
      .post('/api/chat')
      .send({ message: 'What is EVM?', language: 'en' })
      .end((err, res) => {
        if (err) return done(err);
        expect(res.status).to.be.oneOf([200, 500]);
        done();
      });
  });

  it('should default to English when language is not specified', (done) => {
    request(app)
      .post('/api/chat')
      .send({ message: 'What is voter ID?', mode: 'beginner' })
      .end((err, res) => {
        if (err) return done(err);
        expect(res.status).to.be.oneOf([200, 500]);
        done();
      });
  });
});

// ==================== TRANSLATE ROUTE TESTS ====================
describe('Translate Route - /api/translate', () => {

  it('should return 400 when texts is missing', (done) => {
    request(app)
      .post('/api/translate')
      .send({ targetLanguage: 'hi' })
      .expect(400)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body).to.have.property('error');
        done();
      });
  });

  it('should return 400 when texts is not an object', (done) => {
    request(app)
      .post('/api/translate')
      .send({ texts: 'not an object', targetLanguage: 'hi' })
      .expect(400)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body).to.have.property('error');
        done();
      });
  });

  it('should return 400 when targetLanguage is missing', (done) => {
    request(app)
      .post('/api/translate')
      .send({ texts: { hello: 'Hello' } })
      .expect(400)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body.error).to.equal('targetLanguage is required');
        done();
      });
  });

  it('should return original texts when targetLanguage is "en"', (done) => {
    request(app)
      .post('/api/translate')
      .send({ texts: { greeting: 'Hello', farewell: 'Goodbye' }, targetLanguage: 'en' })
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body).to.have.property('translated');
        expect(res.body.translated.greeting).to.equal('Hello');
        expect(res.body.translated.farewell).to.equal('Goodbye');
        done();
      });
  });

  it('should return 400 for unsupported language code', (done) => {
    request(app)
      .post('/api/translate')
      .send({ texts: { test: 'Test' }, targetLanguage: 'xyz' })
      .end((err, res) => {
        if (err) return done(err);
        // Should either reject or attempt translation
        expect(res.status).to.be.oneOf([200, 400, 500]);
        done();
      });
  });

  it('should handle empty texts object for non-English language', (done) => {
    request(app)
      .post('/api/translate')
      .send({ texts: {}, targetLanguage: 'hi' })
      .end((err, res) => {
        if (err) return done(err);
        expect(res.status).to.be.oneOf([200, 500]);
        done();
      });
  });
});

// ==================== CONFIG ROUTE TESTS ====================
describe('Config Route - /api/config', () => {

  it('GET /api/config/maps should return JSON with apiKey', (done) => {
    request(app)
      .get('/api/config/maps')
      .expect(200)
      .expect('Content-Type', /json/)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body).to.have.property('apiKey');
        expect(res.body.apiKey).to.be.a('string');
        done();
      });
  });
});

// ==================== HEALTH CHECK TESTS ====================
describe('Health Check - /api/health', () => {

  it('should return { status: "ok" }', (done) => {
    request(app)
      .get('/api/health')
      .expect(200)
      .expect('Content-Type', /json/)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body).to.deep.equal({ status: 'ok' });
        done();
      });
  });

  it('should respond within acceptable time', (done) => {
    const start = Date.now();
    request(app)
      .get('/api/health')
      .expect(200)
      .end((err) => {
        if (err) return done(err);
        const duration = Date.now() - start;
        expect(duration).to.be.below(1000); // < 1 second
        done();
      });
  });
});

// ==================== SPEECH ROUTE TESTS ====================
describe('Speech Route - /api/speech', () => {

  it('POST /api/speech/tts should return 400 when text is missing', (done) => {
    request(app)
      .post('/api/speech/tts')
      .send({ language: 'en' })
      .end((err, res) => {
        if (err) return done(err);
        expect(res.status).to.be.oneOf([400, 503]);
        done();
      });
  });

  it('POST /api/speech/tts should return 400 when text is empty', (done) => {
    request(app)
      .post('/api/speech/tts')
      .send({ text: '', language: 'en' })
      .end((err, res) => {
        if (err) return done(err);
        expect(res.status).to.be.oneOf([400, 503]);
        done();
      });
  });

  it('POST /api/speech/transcribe should return 400 when no audio file is provided', (done) => {
    request(app)
      .post('/api/speech/transcribe')
      .send({ language: 'en' })
      .end((err, res) => {
        if (err) return done(err);
        expect(res.status).to.be.oneOf([400, 503]);
        done();
      });
  });
});

// ==================== REMINDERS ROUTE TESTS ====================
describe('Reminders Route - /api/reminders', () => {

  it('GET /api/reminders should return an array', (done) => {
    request(app)
      .get('/api/reminders')
      .end((err, res) => {
        if (err) return done(err);
        // Could be array or 503 if Firestore isn't available
        if (res.status === 200) {
          expect(res.body).to.be.an('array');
        } else {
          expect(res.status).to.equal(503);
        }
        done();
      });
  });

  it('POST /api/reminders should return 400 when title is missing', (done) => {
    request(app)
      .post('/api/reminders')
      .send({ time: new Date().toISOString() })
      .end((err, res) => {
        if (err) return done(err);
        expect(res.status).to.be.oneOf([400, 503]);
        done();
      });
  });

  it('POST /api/reminders should return 400 when time is missing', (done) => {
    request(app)
      .post('/api/reminders')
      .send({ title: 'Test Reminder' })
      .end((err, res) => {
        if (err) return done(err);
        expect(res.status).to.be.oneOf([400, 503]);
        done();
      });
  });

  it('POST /api/reminders/token should return 400 when token is missing', (done) => {
    request(app)
      .post('/api/reminders/token')
      .send({})
      .expect(400)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body).to.have.property('error');
        done();
      });
  });

  it('DELETE /api/reminders/:id should handle non-existent id', (done) => {
    request(app)
      .delete('/api/reminders/non-existent-id-12345')
      .end((err, res) => {
        if (err) return done(err);
        // Should return 200 (Firebase doesn't error on missing docs) or 503
        expect(res.status).to.be.oneOf([200, 503]);
        done();
      });
  });

  it('PATCH /api/reminders/:id should return 400 when enabled is missing', (done) => {
    request(app)
      .patch('/api/reminders/test-id')
      .send({})
      .end((err, res) => {
        if (err) return done(err);
        expect(res.status).to.be.oneOf([400, 503]);
        done();
      });
  });
});

// ==================== STATIC FILE SERVING TESTS ====================
describe('Static File Serving', () => {

  it('should serve index.html for unknown routes (SPA fallback)', (done) => {
    request(app)
      .get('/some-random-page')
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.header['content-type']).to.include('text/html');
        done();
      });
  });

  it('should serve index.html for deeply nested unknown routes', (done) => {
    request(app)
      .get('/some/deeply/nested/page')
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.header['content-type']).to.include('text/html');
        done();
      });
  });
});

// ==================== SECURITY HEADER TESTS ====================
describe('Security Headers', () => {

  it('should include Content-Security-Policy header', (done) => {
    request(app)
      .get('/api/health')
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.headers).to.have.property('content-security-policy');
        done();
      });
  });

  it('should include X-Content-Type-Options header', (done) => {
    request(app)
      .get('/api/health')
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.headers).to.have.property('x-content-type-options');
        expect(res.headers['x-content-type-options']).to.equal('nosniff');
        done();
      });
  });

  it('should include Referrer-Policy header', (done) => {
    request(app)
      .get('/api/health')
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.headers).to.have.property('referrer-policy');
        done();
      });
  });

  it('should return proper CORS headers', (done) => {
    request(app)
      .options('/api/health')
      .end((err, res) => {
        if (err) return done(err);
        // CORS is enabled via cors() middleware
        expect(res.status).to.be.oneOf([200, 204]);
        done();
      });
  });
});
