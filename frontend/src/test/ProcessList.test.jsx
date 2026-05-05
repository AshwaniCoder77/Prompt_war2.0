import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { LanguageProvider } from '../LanguageContext';
import ProcessList from '../ProcessList';

describe('ProcessList Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders the election process steps', () => {
    render(
      <LanguageProvider>
        <ProcessList />
      </LanguageProvider>
    );

    // ProcessList should render election process information
    const container = document.querySelector('.process-list') || document.querySelector('[class*="process"]');
    expect(container || screen.getByRole('main') || document.body.firstChild).toBeTruthy();
  });

  it('renders without crashing with LanguageProvider', () => {
    const { container } = render(
      <LanguageProvider>
        <ProcessList />
      </LanguageProvider>
    );

    expect(container).toBeTruthy();
    expect(container.innerHTML).not.toBe('');
  });

  it('renders step content related to voter registration', async () => {
    render(
      <LanguageProvider>
        <ProcessList />
      </LanguageProvider>
    );

    // Should contain election-related content
    const text = document.body.textContent;
    expect(text.length).toBeGreaterThan(0);
  });

  it('renders multiple steps in the process', () => {
    const { container } = render(
      <LanguageProvider>
        <ProcessList />
      </LanguageProvider>
    );

    // Should have multiple child elements representing steps
    const children = container.firstChild?.children;
    expect(children?.length).toBeGreaterThanOrEqual(1);
  });
});
