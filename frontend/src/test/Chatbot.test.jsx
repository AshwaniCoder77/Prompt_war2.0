import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { LanguageProvider } from '../LanguageContext';

// Must import Chatbot after mocks are set up in setup.jsx
import Chatbot from '../Chatbot';

describe('Chatbot Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders the chatbot container with header', async () => {
    render(
      <LanguageProvider>
        <Chatbot />
      </LanguageProvider>
    );

    expect(screen.getByRole('complementary', { name: /AI Assistant Chat/i })).toBeInTheDocument();
    expect(screen.getByText(/Online/i)).toBeInTheDocument();
  });

  it('renders the initial bot greeting message', () => {
    render(
      <LanguageProvider>
        <Chatbot />
      </LanguageProvider>
    );

    expect(screen.getByText(/How can I help you with elections today/i)).toBeInTheDocument();
  });

  it('renders send button, microphone button, and input field', () => {
    render(
      <LanguageProvider>
        <Chatbot />
      </LanguageProvider>
    );

    expect(screen.getByLabelText(/Chat input field/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Send message/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Start voice input/i)).toBeInTheDocument();
  });

  it('send button is disabled when input is empty', () => {
    render(
      <LanguageProvider>
        <Chatbot />
      </LanguageProvider>
    );

    const sendButton = screen.getByLabelText(/Send message/i);
    expect(sendButton).toBeDisabled();
  });

  it('allows typing in the input field', () => {
    render(
      <LanguageProvider>
        <Chatbot />
      </LanguageProvider>
    );

    const input = screen.getByLabelText(/Chat input field/i);
    fireEvent.change(input, { target: { value: 'How to register?' } });
    expect(input.value).toBe('How to register?');
  });

  it('sends a message and displays user message bubble', async () => {
    render(
      <LanguageProvider>
        <Chatbot />
      </LanguageProvider>
    );

    const input = screen.getByLabelText(/Chat input field/i);
    fireEvent.change(input, { target: { value: 'How to register to vote?' } });

    const form = input.closest('form');
    fireEvent.submit(form);

    await waitFor(() => {
      expect(screen.getByText('How to register to vote?')).toBeInTheDocument();
    });
  });

  it('renders the mode selector dropdown with all options', () => {
    render(
      <LanguageProvider>
        <Chatbot />
      </LanguageProvider>
    );

    const modeSelect = screen.getByLabelText(/Select AI expertise level/i);
    expect(modeSelect).toBeInTheDocument();
    expect(modeSelect.value).toBe('intermediate');

    const options = modeSelect.querySelectorAll('option');
    expect(options.length).toBe(3);
  });

  it('toggles voice output when mute/unmute button is clicked', () => {
    render(
      <LanguageProvider>
        <Chatbot />
      </LanguageProvider>
    );

    const muteBtn = screen.getByLabelText(/Mute voice/i);
    fireEvent.click(muteBtn);

    expect(screen.getByLabelText(/Unmute voice/i)).toBeInTheDocument();
  });

  it('renders the floating robot illustration', () => {
    render(
      <LanguageProvider>
        <Chatbot />
      </LanguageProvider>
    );

    expect(screen.getByAltText(/3D Assistant Robot Illustration/i)).toBeInTheDocument();
  });

  it('clears input after sending a message', async () => {
    render(
      <LanguageProvider>
        <Chatbot />
      </LanguageProvider>
    );

    const input = screen.getByLabelText(/Chat input field/i);
    fireEvent.change(input, { target: { value: 'Test message' } });

    const form = input.closest('form');
    fireEvent.submit(form);

    await waitFor(() => {
      expect(input.value).toBe('');
    });
  });
});
