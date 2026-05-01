import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import App from '../App';
import { LanguageProvider } from '../LanguageContext';

// Mock Firebase config
vi.mock('../firebase-config', () => ({
  requestForToken: vi.fn(() => Promise.resolve('mock-token')),
  onMessageListener: vi.fn(() => () => {}),
}));

// Mock fetch
global.fetch = vi.fn(() => 
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve({}),
  })
);

describe('Accessibility Features', () => {
  it('toggles High Contrast mode', async () => {
    render(
      <LanguageProvider>
        <App />
      </LanguageProvider>
    );
    
    // Find High Contrast toggle button in sidebar
    const hcButton = screen.getByText(/Normal/i);
    fireEvent.click(hcButton);
    
    // Check if body has high-contrast class (via checking state reflected in button)
    expect(screen.getByText(/High/i)).toBeInTheDocument();
    expect(document.body.classList.contains('high-contrast')).toBe(true);
  });

  it('toggles Large Text mode', async () => {
    render(
      <LanguageProvider>
        <App />
      </LanguageProvider>
    );
    
    // Find Large Text toggle button
    const ltButton = screen.getByText(/Medium/i);
    fireEvent.click(ltButton);
    
    expect(screen.getByText(/Large/i)).toBeInTheDocument();
    expect(document.body.classList.contains('large-text')).toBe(true);
  });
});
