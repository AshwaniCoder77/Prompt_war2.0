import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import App from '../App';
import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock Firebase config
vi.mock('../firebase-config', () => ({
  requestForToken: vi.fn(() => Promise.resolve('mock-token')),
  onMessageListener: vi.fn(() => () => {}),
}));

// Mock LanguageContext
vi.mock('../LanguageContext', () => {
  const React = require('react');
  const Context = React.createContext();

  const t = (key) => {
    const dict = {
      'nav.home': 'Home',
      'nav.practice': 'Practice Simulation',
      'practice.s1.title': 'Eligibility Check',
      'practice.s1.q1': 'Are you 18 years of age or older?',
      'practice.s1.q2': 'Are you an Indian citizen?',
      'practice.s2.title': 'Identity Verification',
      'practice.s2.id1': 'Aadhaar Card',
      'practice.s3.title': 'Voter Ink',
      'practice.s4.title': 'EVM Machine',
      'practice.s4.c1': 'Candidate A',
      'practice.s6.title': 'Final Confirmation',
      'practice.s7.title': 'Success',
      'practice.s7.msg': 'You have successfully practiced voting!',
      'practice.confirm': 'Confirm',
      'practice.next': 'Next',
      'practice.reset': 'Reset',
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

// Mock fetch
global.fetch = vi.fn(() => 
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve({ audioContent: 'mock-audio', contentType: 'audio/mpeg' }),
  })
);

describe('Integration Flow: Practice Simulation', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('completes the entire voting simulation flow', async () => {
    const { LanguageProvider } = await import('../LanguageContext');
    render(
      <LanguageProvider>
        <App />
      </LanguageProvider>
    );

    // 1. Navigate to Practice Simulation
    const practiceTab = await screen.findByText(/Practice Simulation/i);
    fireEvent.click(practiceTab);

    // 2. Step 1: Eligibility Check
    expect(await screen.findByText(/Eligibility Check/i)).toBeInTheDocument();
    const yesBtns = screen.getAllByText(/YES/i);
    fireEvent.click(yesBtns[0]); // Age 18+
    fireEvent.click(yesBtns[1]); // Citizen
    
    const confirmBtn = screen.getByRole('button', { name: /Confirm/i });
    fireEvent.click(confirmBtn);

    // 3. Step 2: Identity Verification
    expect(await screen.findByText(/Identity Verification/i)).toBeInTheDocument();
    const idCard = screen.getByText(/Aadhaar Card/i);
    fireEvent.click(idCard);
    fireEvent.click(screen.getByRole('button', { name: /Confirm/i }));

    // 4. Step 3: Voter Ink
    expect(await screen.findByText(/Voter Ink/i)).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: /Confirm/i }));

    // 5. Step 4: EVM Preview
    expect(await screen.findByText(/EVM Machine/i)).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: /Next/i }));

    // 6. Step 5: Cast Vote
    const candidateBtn = screen.getByLabelText(/Select Candidate A/i);
    fireEvent.click(candidateBtn);

    // 7. Step 6: Confirmation
    expect(await screen.findByText(/Final Confirmation/i)).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: /Confirm/i }));

    // 8. Step 7: Success
    expect(await screen.findByText(/You have successfully practiced voting!/i)).toBeInTheDocument();
    
    // 9. Reset
    fireEvent.click(screen.getByText(/Reset/i));
    expect(await screen.findByText(/Eligibility Check/i)).toBeInTheDocument();
  });
});
