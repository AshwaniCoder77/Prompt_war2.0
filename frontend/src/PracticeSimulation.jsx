import { useState, useEffect, useRef } from 'react';
import { useLanguage } from './LanguageContext';
import { FaVolumeUp, FaCheckCircle, FaRedo, FaArrowRight, FaArrowLeft, FaExclamationTriangle } from 'react-icons/fa';
import { API_BASE_URL } from './config';
import './PracticeSimulation.css';


export default function PracticeSimulation() {
  const { t, lang } = useLanguage();
  const [step, setStep] = useState(1);
  const [advancedMode, setAdvancedMode] = useState(false);
  
  // Step 1 State
  const [is18, setIs18] = useState(null);
  const [isCitizen, setIsCitizen] = useState(null);

  
  // Step 2 State
  const [selectedId, setSelectedId] = useState(null);
  
  // Step 4/5 State
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  
  const audioRef = useRef(null);

  // Clean up speech synthesis on unmount
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, []);

  const speak = async (text) => {
    if (!text) {
      console.log('🔈 No text provided to speak');
      return;
    }
    
    if (audioRef.current) {
      audioRef.current.pause();
    }
    
    const cleanText = text.replace(/[*_#\[\]`]/g, '');
    console.log('🗣️ Practice Simulation speaking:', cleanText.substring(0, 50));
    
    try {
      const response = await fetch(`${API_BASE_URL}/api/speech/tts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: cleanText, language: lang })
      });


      if (response.ok) {
        const data = await response.json();
        console.log('🎵 Practice Audio received (base64 length):', data.audioContent?.length);
        
        const audioBlob = await (await fetch(`data:${data.contentType};base64,${data.audioContent}`)).blob();
        const audioUrl = URL.createObjectURL(audioBlob);
        const audio = new Audio(audioUrl);
        audioRef.current = audio;
        audio.play().catch(e => console.error('🚫 Practice play failed:', e));
        
        audio.onended = () => {
          URL.revokeObjectURL(audioUrl);
          if (audioRef.current === audio) audioRef.current = null;
        };
      } else {
        console.error("❌ Practice TTS failed:", response.status);
      }
    } catch (error) {
      console.error("❌ Practice TTS Error:", error);
    }
  };

  const handleNext = () => {
    if (audioRef.current) audioRef.current.pause();
    setStep(prev => Math.min(prev + 1, 7));
  };

  const handleBack = () => {
    if (audioRef.current) audioRef.current.pause();
    setStep(prev => Math.max(prev - 1, 1));
  };

  const handleReset = () => {
    if (audioRef.current) audioRef.current.pause();
    setStep(1);
    setIs18(null);
    setIsCitizen(null);

    setSelectedId(null);
    setSelectedCandidate(null);
  };

  const getExplanationText = (stepNum) => {
    const key = `practice.s${stepNum}.${advancedMode ? 'advanced' : 'beginner'}`;
    return t(key);
  };

  const renderStepContent = () => {
    switch (step) {
      case 1: {
        const isIneligible = is18 === 'no' || isCitizen === 'no';
        return (
          <div className="practice-content">
            <div className="eligibility-group">
              <div className="eligibility-item">
                <p>{t('practice.s1.q1')}</p>
                <div className="yes-no-btns">
                  <button 
                    className={`choice-btn ${is18 === 'yes' ? 'selected' : ''}`}
                    onClick={() => setIs18('yes')}
                  >
                    YES
                  </button>
                  <button 
                    className={`choice-btn ${is18 === 'no' ? 'selected no' : ''}`}
                    onClick={() => setIs18('no')}
                  >
                    NO
                  </button>
                </div>
              </div>

              <div className="eligibility-item">
                <p>{t('practice.s1.q2')}</p>
                <div className="yes-no-btns">
                  <button 
                    className={`choice-btn ${isCitizen === 'yes' ? 'selected' : ''}`}
                    onClick={() => setIsCitizen('yes')}
                  >
                    YES
                  </button>
                  <button 
                    className={`choice-btn ${isCitizen === 'no' ? 'selected no' : ''}`}
                    onClick={() => setIsCitizen('no')}
                  >
                    NO
                  </button>
                </div>
              </div>

              {isIneligible && (
                <div className="ineligible-error">
                  <FaExclamationTriangle />
                  <span>You are not eligible to vote.</span>
                </div>
              )}
            </div>
          </div>
        );
      }

      case 2:
        return (
          <div className="practice-content">
            <p>{t('practice.s2.prompt')}</p>
            <div className="id-grid">
              {[1, 2, 3, 4].map(idNum => (
                <div 
                  key={idNum}
                  className={`id-card ${selectedId === idNum ? 'selected' : ''}`}
                  onClick={() => setSelectedId(idNum)}
                >
                  {t(`practice.s2.id${idNum}`)}
                </div>
              ))}
            </div>
          </div>
        );
      case 3:
        return (
          <div className="practice-content" style={{ textAlign: 'center', padding: '2rem 0' }}>
            <FaCheckCircle size={64} color="var(--primary)" style={{ marginBottom: '1rem' }} />
            <p style={{ fontSize: '1.5rem', fontWeight: '500' }}>{t('practice.s3.msg')}</p>
          </div>
        );
      case 4:
      case 5:
        return (
          <div className="practice-content">
            {step === 4 && <p>{t('practice.s4.prompt')}</p>}
            <div className="evm-machine">
              {[1, 2, 3, 4].map(cNum => (
                <div key={cNum} className="evm-row">
                  <span className="evm-candidate">{t(`practice.s4.c${cNum}`)}</span>
                  <button 
                    className={`evm-button ${selectedCandidate === cNum ? 'pressed' : ''}`}
                    onClick={() => {
                      if (step === 5) {
                        setSelectedCandidate(cNum);
                        // Simulate red light, auto-advance after 1 sec
                        setTimeout(() => handleNext(), 1000);
                      }
                    }}
                    disabled={step === 4}
                    aria-label={`Select ${t(`practice.s4.c${cNum}`)}`}
                  ></button>
                </div>
              ))}
            </div>
          </div>
        );
      case 6:
        return (
          <div className="practice-content" style={{ textAlign: 'center' }}>
            <div className="confirmation-box">
              <h4>{t('practice.s6.youSelected')}</h4>
              <p style={{ fontSize: '2rem', fontWeight: 'bold' }}>
                {t(`practice.s4.c${selectedCandidate}`)}
              </p>
            </div>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginTop: '2rem' }}>
              <button className="btn-secondary" onClick={() => setStep(5)}>
                {t('practice.change')}
              </button>
              <button className="btn-primary" onClick={handleNext}>
                {t('practice.confirm')}
              </button>
            </div>
          </div>
        );
      case 7:
        return (
          <div className="practice-content" style={{ textAlign: 'center', padding: '2rem 0' }}>
            <FaCheckCircle size={80} color="#22c55e" style={{ marginBottom: '1rem' }} />
            <h3 style={{ color: '#166534', fontSize: '2rem', marginBottom: '1rem' }}>{t('practice.s7.msg')}</h3>
            <button className="btn-primary" onClick={handleReset} style={{ marginTop: '2rem' }}>
              <FaRedo style={{ marginRight: '0.5rem' }} /> {t('practice.reset')}
            </button>
          </div>
        );
      default:
        return null;
    }
  };

  const isNextDisabled = () => {
    if (step === 1) return is18 !== 'yes' || isCitizen !== 'yes';

    if (step === 2) return selectedId === null;
    if (step === 4) return false;
    if (step === 5) return selectedCandidate === null;
    return false;
  };

  return (
    <div className="practice-container">
      <div className="practice-disclaimer">
        <FaExclamationTriangle style={{ marginRight: '0.5rem' }} />
        {t('practice.disclaimer')}
      </div>

      <div className="practice-header">
        <h2>{t('nav.practice')}</h2>
        <div className="mode-toggle">
          <span>{t('practice.explanationMode')}:</span>
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
            <input 
              type="radio" 
              name="mode" 
              checked={!advancedMode} 
              onChange={() => setAdvancedMode(false)} 
            />
            {t('practice.beginner')}
          </label>
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.2rem', marginLeft: '0.5rem' }}>
            <input 
              type="radio" 
              name="mode" 
              checked={advancedMode} 
              onChange={() => setAdvancedMode(true)} 
            />
            {t('practice.advanced')}
          </label>
        </div>
      </div>

      <div className="practice-progress">
        <span style={{ fontWeight: '600', color: 'var(--text-secondary)' }}>
          {t('practice.step')} {step} {t('practice.of')} 7
        </span>
        <div className="progress-bar-container">
          <div 
            className="progress-bar-fill" 
            style={{ width: `${(step / 7) * 100}%` }}
          ></div>
        </div>
      </div>

      <div className="practice-card">
        <h3>{t(`practice.s${step}.title`)}</h3>
        
        <div className="practice-explanation">
          <span>{getExplanationText(step)}</span>
          <button 
            className="voice-btn" 
            onClick={() => speak(getExplanationText(step))}
            aria-label="Read explanation aloud"
          >
            <FaVolumeUp />
          </button>
        </div>

        {renderStepContent()}

        {step < 6 && step !== 7 && (
          <div className="practice-actions">
            <button 
              className="btn-secondary" 
              onClick={handleBack}
              disabled={step === 1}
            >
              <FaArrowLeft style={{ marginRight: '0.5rem' }} /> {t('practice.back')}
            </button>
            <button 
              className="btn-primary" 
              onClick={handleNext}
              disabled={isNextDisabled() || step === 5} // Step 5 auto-advances or waits for click on EVM
            >
              {step === 4 ? t('practice.next') : t('practice.confirm')} <FaArrowRight style={{ marginLeft: '0.5rem' }} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
