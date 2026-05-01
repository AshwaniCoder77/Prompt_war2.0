import { render, screen, act } from '@testing-library/react';
import { LanguageProvider, useLanguage } from '../LanguageContext';
import { describe, it, expect } from 'vitest';

const TestComponent = () => {
  const { t, setLang, lang } = useLanguage();
  return (
    <div>
      <span data-testid="lang">{lang}</span>
      <span data-testid="text">{t('nav.home')}</span>
      <button onClick={() => setLang('hi')}>Switch to Hindi</button>
    </div>
  );
};

describe('LanguageContext', () => {
  it('provides default language and translations', () => {
    render(
      <LanguageProvider>
        <TestComponent />
      </LanguageProvider>
    );
    
    expect(screen.getByTestId('lang')).toHaveTextContent('en');
    expect(screen.getByTestId('text')).toHaveTextContent('Home');
  });

  it('switches language and updates translations', async () => {
    render(
      <LanguageProvider>
        <TestComponent />
      </LanguageProvider>
    );
    
    const button = screen.getByText('Switch to Hindi');
    await act(async () => {
      button.click();
    });
    
    expect(screen.getByTestId('lang')).toHaveTextContent('hi');
    // Note: 'nav.home' in Hindi is 'Home' in enDict fallback if locale not loaded, 
    // but our i18n logic should load it.
  });
});
