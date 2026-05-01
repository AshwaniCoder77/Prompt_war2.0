import { render, screen } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import App from '../App';
import { describe, it, expect, vi } from 'vitest';
import { LanguageProvider } from '../LanguageContext';

// Mock Firebase config to avoid initialization errors in tests
vi.mock('../firebase-config', () => ({
  requestForToken: vi.fn(() => Promise.resolve('mock-token')),
  onMessageListener: vi.fn(() => () => {}),
}));

// Mock LanguageContext to provide stable translations in tests
vi.mock('../LanguageContext', () => {
  const React = require('react');
  const Context = React.createContext();

  const t = (key) => {
    const dict = {
      'nav.home': 'Home',
      'nav.askAssistant': 'Ask Assistant',
      'nav.electionProcess': 'Election Process',
      'nav.timeline': 'Timeline',
      'nav.pollingStation': 'Polling Station',
      'nav.resources': 'Resources',
      'nav.settings': 'Settings',
      'home.greeting': 'Hi, 👋',
      'home.title': 'How can we help you today?',
      'home.subtitle': 'Get instant answers about elections, processes, timelines and more.',
      'home.askBtn': 'Ask Assistant',
      'home.typeOrSpeak': 'You can type or speak your question 🎙️',
      'home.quickAccess': 'Quick Access',
    };
    return dict[key] || key;
  };

  const value = {
    lang: 'en',
    setLang: vi.fn(),
    t: t
  };

  return {
    LanguageProvider: ({ children }) => <Context.Provider value={value}>{children}</Context.Provider>,
    useLanguage: () => React.useContext(Context),
  };
});

// Mock fetch to avoid network errors in tests
global.fetch = vi.fn(() => 
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve({}),
    blob: () => Promise.resolve(new Blob()),
  })
);

describe('App Component', () => {
  it('renders Home Dashboard by default', async () => {
    render(
      <LanguageProvider>
        <App />
      </LanguageProvider>
    );
    
    // Use findByText to wait for lazy-loaded components if needed
    expect(await screen.findByText(/How can we help you today/i)).toBeInTheDocument();
  });

  it('contains navigation links', async () => {
    render(
      <LanguageProvider>
        <App />
      </LanguageProvider>
    );
    
    // Check for some nav items
    expect((await screen.findAllByText(/Home/i)).length).toBeGreaterThan(0);
    expect((await screen.findAllByText(/Ask Assistant/i)).length).toBeGreaterThan(0);
  });
});
