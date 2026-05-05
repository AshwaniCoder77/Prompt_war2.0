import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { LanguageProvider } from '../LanguageContext';
import Settings from '../Settings';

describe('Settings Component', () => {
  const defaultProps = {
    isDark: false,
    setIsDark: vi.fn(),
    highContrast: false,
    setHighContrast: vi.fn(),
    largeText: false,
    setLargeText: vi.fn(),
    openReminders: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
    document.body.classList.remove('dark-mode', 'high-contrast', 'large-text');
    localStorage.clear();
  });

  it('renders the Settings page with appearance section', () => {
    render(
      <LanguageProvider>
        <Settings {...defaultProps} />
      </LanguageProvider>
    );

    // Settings uses t('settings.title') which maps to "Settings" in English
    expect(screen.getByText(/Settings/i)).toBeInTheDocument();
    expect(screen.getByText(/Appearance/i)).toBeInTheDocument();
  });

  it('renders theme toggle checkboxes', () => {
    render(
      <LanguageProvider>
        <Settings {...defaultProps} />
      </LanguageProvider>
    );

    const checkboxes = screen.getAllByRole('checkbox');
    expect(checkboxes.length).toBeGreaterThanOrEqual(3);
  });

  it('calls setIsDark when theme toggle is clicked', () => {
    render(
      <LanguageProvider>
        <Settings {...defaultProps} />
      </LanguageProvider>
    );

    // First checkbox is the dark theme toggle
    const checkboxes = screen.getAllByRole('checkbox');
    fireEvent.click(checkboxes[0]);
    expect(defaultProps.setIsDark).toHaveBeenCalledWith(true);
  });

  it('calls setHighContrast when high contrast toggle is clicked', () => {
    render(
      <LanguageProvider>
        <Settings {...defaultProps} />
      </LanguageProvider>
    );

    const checkboxes = screen.getAllByRole('checkbox');
    fireEvent.click(checkboxes[1]);
    expect(defaultProps.setHighContrast).toHaveBeenCalledWith(true);
  });

  it('calls setLargeText when large text toggle is clicked', () => {
    render(
      <LanguageProvider>
        <Settings {...defaultProps} />
      </LanguageProvider>
    );

    const checkboxes = screen.getAllByRole('checkbox');
    fireEvent.click(checkboxes[2]);
    expect(defaultProps.setLargeText).toHaveBeenCalledWith(true);
  });

  it('renders notification section with manage reminders button', () => {
    render(
      <LanguageProvider>
        <Settings {...defaultProps} />
      </LanguageProvider>
    );

    expect(screen.getByText(/Notifications/i)).toBeInTheDocument();
  });

  it('calls openReminders when Manage Reminders button is clicked', () => {
    render(
      <LanguageProvider>
        <Settings {...defaultProps} />
      </LanguageProvider>
    );

    const manageBtn = screen.getByText(/Manage Reminders/i);
    fireEvent.click(manageBtn);
    expect(defaultProps.openReminders).toHaveBeenCalled();
  });

  it('renders privacy and data section', () => {
    render(
      <LanguageProvider>
        <Settings {...defaultProps} />
      </LanguageProvider>
    );

    expect(screen.getByText(/Privacy/i)).toBeInTheDocument();
  });

  it('renders AI & Voice section with experience level selector', () => {
    render(
      <LanguageProvider>
        <Settings {...defaultProps} />
      </LanguageProvider>
    );

    // Check for the select dropdown with AI levels
    const selects = screen.getAllByRole('combobox');
    expect(selects.length).toBeGreaterThanOrEqual(1);
  });
});
