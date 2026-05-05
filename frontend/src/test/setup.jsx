import { vi } from 'vitest';
import '@testing-library/jest-dom';

// 1. Mock Global Browser APIs
Object.defineProperty(global.navigator, 'serviceWorker', {
  value: {
    register: vi.fn(() => Promise.resolve({ scope: '/' })),
    addEventListener: vi.fn(),
    controller: { postMessage: vi.fn() }
  },
  configurable: true
});

// Fix: Mock location.reload without breaking other properties
delete window.location;
window.location = new URL('http://localhost');
window.location.reload = vi.fn();
window.location.assign = vi.fn();
window.location.replace = vi.fn();

global.Notification = {
  permission: 'granted',
  requestPermission: vi.fn(() => Promise.resolve('granted'))
};

// Mock scrollIntoView (not available in JSDOM)
Element.prototype.scrollIntoView = vi.fn();

// Mock speechSynthesis
window.speechSynthesis = {
  speak: vi.fn(),
  cancel: vi.fn(),
  getVoices: vi.fn(() => []),
};

// Mock SpeechSynthesisUtterance
global.SpeechSynthesisUtterance = function(text) {
  this.text = text;
  this.voice = null;
  this.lang = 'en-IN';
  this.rate = 1.0;
};

// Mock Audio
global.Audio = vi.fn().mockImplementation(() => ({
  play: vi.fn(() => Promise.resolve()),
  pause: vi.fn(),
  currentTime: 0,
}));

// 2. Mock Global Fetch with a Universal Success Response
global.fetch = vi.fn((url) => {
  const isReminders = typeof url === 'string' && url.includes('/reminders');
  
  return Promise.resolve({
    ok: true,
    status: 200,
    json: () => Promise.resolve(isReminders ? [] : { 
      apiKey: 'mock-api-key', 
      audioContent: 'mock-audio-data', 
      reply: 'Mock AI Response for Testing',
      success: true
    }),
    blob: () => Promise.resolve(new Blob()),
    text: () => Promise.resolve('Mock Text Response'),
  });
});

// 3. Mock External Libraries
vi.mock('@react-google-maps/api', () => ({
  useJsApiLoader: () => ({ isLoaded: true }),
  GoogleMap: ({ children }) => <div data-testid="mock-map">{children}</div>,
  MarkerF: () => <div data-testid="mock-marker">Marker</div>,
  InfoWindowF: ({ children }) => <div data-testid="mock-info-window">{children}</div>,
}));

// 4. Mock Firebase
vi.mock('../firebase-config', () => ({
  requestForToken: vi.fn(() => Promise.resolve('mock-fcm-token')),
  onMessageListener: vi.fn(() => () => {}),
}));

// 5. Mock Speech Recognition
global.SpeechRecognition = vi.fn();
global.webkitSpeechRecognition = vi.fn();
