let expect;

before(async () => {
  const chai = await import('chai');
  expect = chai.expect;
});

/**
 * Unit tests for backend services.
 * Tests notification scheduler logic and exported functions.
 */
describe('Notification Scheduler Service', () => {

  it('should export checkAndSendNotifications function', () => {
    const { checkAndSendNotifications } = require('../services/notificationScheduler');
    expect(checkAndSendNotifications).to.be.a('function');
  });

  it('checkAndSendNotifications should execute without throwing', async () => {
    const { checkAndSendNotifications } = require('../services/notificationScheduler');
    // Should gracefully handle missing Firebase or no reminders
    try {
      await checkAndSendNotifications();
    } catch (err) {
      // Should not throw even if Firebase is not configured
      expect.fail('checkAndSendNotifications should not throw');
    }
  });
});

describe('Firebase Config Module', () => {

  it('should export admin, db, and auth', () => {
    const firebase = require('../config/firebase');
    expect(firebase).to.have.property('admin');
    expect(firebase).to.have.property('db');
    expect(firebase).to.have.property('auth');
  });

  it('admin should be an object', () => {
    const { admin } = require('../config/firebase');
    expect(admin).to.be.an('object');
  });
});

describe('Auth Middleware Module', () => {

  it('should export verifyToken as a function', () => {
    const { verifyToken } = require('../middleware/auth');
    expect(verifyToken).to.be.a('function');
  });

  it('verifyToken should have correct arity (3 params: req, res, next)', () => {
    const { verifyToken } = require('../middleware/auth');
    expect(verifyToken.length).to.equal(3);
  });
});
