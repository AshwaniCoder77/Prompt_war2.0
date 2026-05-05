import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { LanguageProvider } from '../LanguageContext';
import RemindersPanel from '../RemindersPanel';

describe('RemindersPanel Component', () => {
  const mockReminders = [
    { id: '1', title: 'Register by May 10', time: '2026-05-10T09:00:00Z', enabled: true, priority: 'high' },
    { id: '2', title: 'Polling Day', time: '2026-06-01T07:00:00Z', enabled: false, priority: 'medium' },
  ];

  const mockSetReminders = vi.fn();
  const mockOnClose = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders reminders when isOpen is true', () => {
    render(
      <LanguageProvider>
        <RemindersPanel
          isOpen={true}
          onClose={mockOnClose}
          reminders={mockReminders}
          setReminders={mockSetReminders}
        />
      </LanguageProvider>
    );

    expect(screen.getByText(/Register by May 10/i)).toBeInTheDocument();
    expect(screen.getByText(/Polling Day/i)).toBeInTheDocument();
  });

  it('returns null when isOpen is false', () => {
    const { container } = render(
      <LanguageProvider>
        <RemindersPanel
          isOpen={false}
          onClose={mockOnClose}
          reminders={mockReminders}
          setReminders={mockSetReminders}
        />
      </LanguageProvider>
    );

    // Should render nothing
    expect(container.innerHTML).toBe('');
  });

  it('renders empty list when no reminders exist', () => {
    render(
      <LanguageProvider>
        <RemindersPanel
          isOpen={true}
          onClose={mockOnClose}
          reminders={[]}
          setReminders={mockSetReminders}
        />
      </LanguageProvider>
    );

    // Should render the panel header but no reminder cards
    expect(screen.getByText(/Notifications & Reminders/i)).toBeInTheDocument();
  });

  it('renders Add New Reminder button', () => {
    render(
      <LanguageProvider>
        <RemindersPanel
          isOpen={true}
          onClose={mockOnClose}
          reminders={[]}
          setReminders={mockSetReminders}
        />
      </LanguageProvider>
    );

    expect(screen.getByText(/Add New Reminder/i)).toBeInTheDocument();
  });

  it('shows add form when Add New Reminder is clicked', () => {
    render(
      <LanguageProvider>
        <RemindersPanel
          isOpen={true}
          onClose={mockOnClose}
          reminders={[]}
          setReminders={mockSetReminders}
        />
      </LanguageProvider>
    );

    const addBtn = screen.getByText(/Add New Reminder/i);
    fireEvent.click(addBtn);

    // Form should now be visible with Save button
    expect(screen.getByText(/Save Reminder/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Reminder Title/i)).toBeInTheDocument();
  });

  it('renders toggle switches for each reminder', () => {
    render(
      <LanguageProvider>
        <RemindersPanel
          isOpen={true}
          onClose={mockOnClose}
          reminders={mockReminders}
          setReminders={mockSetReminders}
        />
      </LanguageProvider>
    );

    const checkboxes = screen.getAllByRole('checkbox');
    expect(checkboxes.length).toBe(mockReminders.length);
  });

  it('calls onClose when close button is clicked', () => {
    render(
      <LanguageProvider>
        <RemindersPanel
          isOpen={true}
          onClose={mockOnClose}
          reminders={[]}
          setReminders={mockSetReminders}
        />
      </LanguageProvider>
    );

    const closeBtn = document.querySelector('.close-btn');
    fireEvent.click(closeBtn);
    expect(mockOnClose).toHaveBeenCalled();
  });

  it('renders FCM footer note', () => {
    render(
      <LanguageProvider>
        <RemindersPanel
          isOpen={true}
          onClose={mockOnClose}
          reminders={[]}
          setReminders={mockSetReminders}
        />
      </LanguageProvider>
    );

    expect(screen.getByText(/Firebase Cloud Messaging/i)).toBeInTheDocument();
  });
});
