import { useState } from 'react';
import './ProcessList.css';
import { FaCheckCircle, FaRegCircle } from 'react-icons/fa';
import { useLanguage } from './LanguageContext';

export default function ProcessList() {
  const { t } = useLanguage();
  const [progress, setProgress] = useState({
    eligibility: false,
    registration: false,
    verification: false,
    polling: false,
    voting: false
  });

  const steps = [
    {
      id: 'eligibility',
      title: t('process.s1.title'),
      description: t('process.s1.desc')
    },
    {
      id: 'registration',
      title: t('process.s2.title'),
      description: t('process.s2.desc')
    },
    {
      id: 'verification',
      title: t('process.s3.title'),
      description: t('process.s3.desc')
    },
    {
      id: 'polling',
      title: t('process.s4.title'),
      description: t('process.s4.desc')
    },
    {
      id: 'voting',
      title: t('process.s5.title'),
      description: t('process.s5.desc')
    }
  ];

  const toggleStep = (stepId) => {
    // In a real app, this would call the backend API we just created
    setProgress(prev => ({
      ...prev,
      [stepId]: !prev[stepId]
    }));
  };

  const calculateProgress = () => {
    const completed = Object.values(progress).filter(Boolean).length;
    return (completed / steps.length) * 100;
  };

  const handleDone = () => {
    setProgress({
      eligibility: false,
      registration: false,
      verification: false,
      polling: false,
      voting: false
    });
  };

  return (
    <div className="process-container">
      <h2>{t('process.title')}</h2>
      <p>{t('process.desc')}</p>

      <div className="progress-bar-container" aria-hidden="true">
        <div className="progress-bar-fill" style={{ width: `${calculateProgress()}%` }}></div>
      </div>
      <p className="sr-only">{t('process.progress')}: {calculateProgress()}% {t('process.completed')}.</p>

      <div className="steps-list">
        {steps.map(step => (
          <div 
            key={step.id} 
            className={`step-card ${progress[step.id] ? 'completed' : ''}`}
            onClick={() => toggleStep(step.id)}
            role="button"
            tabIndex={0}
            onKeyPress={(e) => { if(e.key === 'Enter') toggleStep(step.id) }}
            aria-pressed={progress[step.id]}
          >
            <div className="step-icon">
              {progress[step.id] ? <FaCheckCircle className="icon-completed" /> : <FaRegCircle className="icon-pending" />}
            </div>
            <div className="step-content">
              <h3>{step.title}</h3>
              <p>{step.description}</p>
            </div>
          </div>
        ))}
      </div>
      
      {calculateProgress() === 100 && (
        <div style={{ marginTop: '2rem', textAlign: 'center' }}>
          <button 
            onClick={handleDone}
            style={{
              backgroundColor: 'var(--primary)',
              color: 'white',
              border: 'none',
              padding: '0.75rem 2rem',
              fontSize: '1.2rem',
              fontWeight: '600',
              borderRadius: '8px',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
            }}
          >
            <FaCheckCircle /> Done
          </button>
        </div>
      )}
    </div>
  );
}
