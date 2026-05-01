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

// Mock fetch to avoid network errors in tests
global.fetch = vi.fn(() => 
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve({}),
    blob: () => Promise.resolve(new Blob()),
  })
);

describe('App Component', () => {
  it('renders Home Dashboard by default', () => {
    render(
      <LanguageProvider>
        <App />
      </LanguageProvider>
    );
    
    // Check for title in HomeDashboard
    expect(screen.getByText(/How can we help you today/i)).toBeInTheDocument();
  });

  it('contains navigation links', () => {
    render(
      <LanguageProvider>
        <App />
      </LanguageProvider>
    );
    
    // Check for some nav items
    expect(screen.getAllByText(/Home/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Ask Assistant/i).length).toBeGreaterThan(0);
  });
});
