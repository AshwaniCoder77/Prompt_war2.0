import { render, screen, fireEvent } from '@testing-library/react';
import PracticeSimulation from '../PracticeSimulation';
import { LanguageProvider } from '../LanguageContext';
import { describe, it, expect, vi, beforeEach } from 'vitest';

describe('Integration Flow: Practice Simulation', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('completes the entire voting simulation flow', async () => {
    render(
      <LanguageProvider>
        <PracticeSimulation />
      </LanguageProvider>
    );

    // 1. Step 1: Eligibility Check
    expect(await screen.findByText(/1. Eligibility Check/i)).toBeInTheDocument();
    const yesBtns = screen.getAllByText(/YES/i);
    fireEvent.click(yesBtns[0]); // Age 18+
    fireEvent.click(yesBtns[1]); // Citizen
    
    const confirmBtn = screen.getByRole('button', { name: /Confirm/i });
    fireEvent.click(confirmBtn);

    // 3. Step 2: Identity Verification
    expect(await screen.findByText(/2. Identity Verification/i)).toBeInTheDocument();
    const idCard = screen.getByText(/Aadhaar Card/i);
    fireEvent.click(idCard);
    fireEvent.click(screen.getByRole('button', { name: /Confirm/i }));

    // 4. Step 3: Enter Polling Booth
    expect(await screen.findByText(/3. Enter Polling Booth/i)).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: /Confirm/i }));

    // 5. Step 4: View Candidate List
    expect(await screen.findByText(/4. View Candidate List/i)).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: /Next/i }));

    // 6. Step 5: Cast Vote
    const candidateBtn = screen.getByLabelText(/Select Apple Party/i);
    fireEvent.click(candidateBtn);

    // 7. Step 6: Confirmation
    expect(await screen.findByText(/Confirmation/i)).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: /Confirm/i }));

    // 8. Step 7: Success
    expect(await screen.findByText(/successfully completed/i)).toBeInTheDocument();
    
    // 9. Reset
    fireEvent.click(screen.getByText(/Reset/i));
    expect(await screen.findByText(/Eligibility Check/i)).toBeInTheDocument();
  }, 15000);
});
