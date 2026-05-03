import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import App from '../App';
import { LanguageProvider } from '../LanguageContext';

describe('Accessibility Features', () => {
  it('toggles High Contrast mode', async () => {
    render(
      <LanguageProvider>
        <App />
      </LanguageProvider>
    );
    
    const hcButton = await screen.findByText(/Normal/i, {}, { timeout: 5000 });
    fireEvent.click(hcButton);
    
    expect(screen.getByText(/High/i)).toBeInTheDocument();
    expect(document.body.classList.contains('high-contrast')).toBe(true);
  });

  it('toggles Large Text mode', async () => {
    render(
      <LanguageProvider>
        <App />
      </LanguageProvider>
    );
    
    const ltButton = await screen.findByText(/Medium/i);
    fireEvent.click(ltButton);
    
    expect(screen.getByText(/Large/i)).toBeInTheDocument();
    expect(document.body.classList.contains('large-text')).toBe(true);
  });
});
