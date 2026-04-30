import { FaCheckCircle, FaClock, FaExclamationCircle } from 'react-icons/fa';
import { useLanguage } from './LanguageContext';

export default function Timeline() {
  const { t } = useLanguage();

  const timelineSteps = [
    {
      id: 1,
      title: t('timeline.step1Title'),
      date: t('timeline.step1Date'),
      status: 'completed',
      desc: t('timeline.step1Desc')
    },
    {
      id: 2,
      title: t('timeline.step2Title'),
      date: t('timeline.step2Date'),
      status: 'urgent',
      desc: t('timeline.step2Desc')
    },
    {
      id: 3,
      title: t('timeline.step3Title'),
      date: t('timeline.step3Date'),
      status: 'upcoming',
      desc: t('timeline.step3Desc')
    },
    {
      id: 4,
      title: t('timeline.step4Title'),
      date: t('timeline.step4Date'),
      status: 'upcoming',
      desc: t('timeline.step4Desc')
    }
  ];

  const getStatusIcon = (status) => {
    switch(status) {
      case 'completed': return <FaCheckCircle color="#10b981" size={24} />;
      case 'urgent': return <FaExclamationCircle color="#ef4444" size={24} />;
      case 'upcoming': return <FaClock color="#94a3b8" size={24} />;
      default: return <FaClock color="#94a3b8" size={24} />;
    }
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      
      {/* Countdown Banner */}
      <div style={{ 
        background: 'linear-gradient(to right, var(--primary), var(--secondary))', 
        borderRadius: 'var(--radius-lg)', 
        padding: '2rem', 
        color: 'white',
        textAlign: 'center',
        marginBottom: '3rem',
        boxShadow: 'var(--shadow-md)'
      }}>
        <h2 style={{ fontSize: '1.25rem', marginBottom: '0.5rem', color: 'rgba(255,255,255,0.9)', fontWeight: 500 }}>{t('timeline.countdownTitle')}</h2>
        <div style={{ fontSize: '3rem', fontWeight: 700, lineHeight: 1 }}>{t('banner.daysLeft')}</div>
        <p style={{ marginTop: '0.5rem', fontSize: '0.9rem', opacity: 0.8 }}>{t('timeline.countdownDate')}</p>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.5rem', margin: 0 }}>{t('timeline.journeyTitle')}</h2>
        <button className="btn-primary" style={{ padding: '0.5rem 1rem', fontSize: '0.9rem' }}>
          🔔 {t('timeline.enableReminders')}
        </button>
      </div>

      {/* Vertical Timeline */}
      <div style={{ position: 'relative', paddingLeft: '2rem' }}>
        {/* The line */}
        <div style={{ position: 'absolute', left: '11px', top: '0', bottom: '0', width: '2px', background: 'var(--border-color)' }}></div>

        {timelineSteps.map((step, index) => (
          <div key={step.id} style={{ position: 'relative', marginBottom: index === timelineSteps.length - 1 ? '0' : '2.5rem' }}>
            
            {/* The dot icon */}
            <div style={{ position: 'absolute', left: '-2rem', background: 'var(--bg-card)' }}>
              {getStatusIcon(step.status)}
            </div>

            {/* The Card */}
            <div style={{ 
              background: 'var(--bg-card)', 
              border: '1px solid var(--border-color)',
              borderRadius: 'var(--radius-md)',
              padding: '1.5rem',
              boxShadow: 'var(--shadow-sm)',
              marginLeft: '1rem'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <h3 style={{ margin: 0, fontSize: '1.1rem', color: 'var(--text-primary)' }}>{step.title}</h3>
                <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)' }}>{step.date}</span>
              </div>
              <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.95rem' }}>{step.desc}</p>
              
              {step.status === 'urgent' && (
                <button style={{ marginTop: '1rem', background: '#fee2e2', color: '#ef4444', padding: '0.4rem 0.8rem', borderRadius: '6px', fontWeight: 600, fontSize: '0.85rem', border: '1px solid #fca5a5' }}>
                  {t('timeline.actionReq')}
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
