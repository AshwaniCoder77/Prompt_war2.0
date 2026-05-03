import { render, screen } from '@testing-library/react';
import App from '../App';
import { describe, it, expect } from 'vitest';
import { LanguageProvider } from '../LanguageContext';

// Clean, simple test suite leveraging global setup.js
describe('App Component', () => {
  it('renders Home Dashboard by default', async () => {
    render(
      <LanguageProvider>
        <App />
      </LanguageProvider>
    );
    
    expect(await screen.findByText(/How can we help you today/i)).toBeInTheDocument();
  });

  it('contains navigation links', async () => {
    render(
      <LanguageProvider>
        <App />
      </LanguageProvider>
    );
    
    const navItems = await screen.findAllByRole('link');
    expect(navItems.length).toBeGreaterThan(5);
    expect(screen.getByText(/Home/i)).toBeInTheDocument();
    expect(screen.getAllByText(/Ask Assistant/i)[0]).toBeInTheDocument();
  });
});
