import { FaMoon, FaSun, FaUniversalAccess, FaMicrophone, FaLanguage, FaShieldAlt, FaPalette, FaBell, FaTrash } from 'react-icons/fa';
import { useLanguage } from './LanguageContext';
import { useState } from 'react';

export default function Settings({ 
  isDark, setIsDark, 
  highContrast, setHighContrast, 
  largeText, setLargeText, 
  openReminders 
}) {
  const { t } = useLanguage();
  const [aiLevel, setAiLevel] = useState('intermediate');
  const [autoRead, setAutoRead] = useState(true);

  const clearAppData = () => {
    if (window.confirm('Are you sure you want to clear all app data? This will reset your preferences and reminders.')) {
      localStorage.clear();
      window.location.reload();
    }
  };

  const toggleTheme = () => setIsDark(!isDark);
  const toggleHighContrast = () => setHighContrast(!highContrast);
  const toggleLargeText = () => setLargeText(!largeText);

  return (
    <div className="settings-wrapper" style={{ maxWidth: '850px', margin: '0 auto', animation: 'fadeIn 0.5s ease-out' }}>
      <header style={{ marginBottom: '2.5rem' }}>
        <h2 style={{ fontSize: '2rem', fontWeight: 700, margin: 0, color: 'var(--text-primary)' }}>{t('settings.title')}</h2>
        <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem' }}>Customize your experience and manage your data.</p>
      </header>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        
        {/* Appearance & Theme */}
        <section className="settings-card" style={{ 
          background: 'var(--bg-card)', 
          padding: '2rem', 
          borderRadius: 'var(--radius-lg)', 
          border: '1px solid var(--border-color)',
          boxShadow: 'var(--shadow-sm)',
          backdropFilter: 'blur(10px)'
        }}>
          <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '1.25rem', marginBottom: '1.5rem', color: 'var(--primary)' }}>
            <FaPalette /> {t('settings.appearance')}
          </h3>
          
          <div className="setting-item" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem 0', borderBottom: '1px solid var(--border-color)' }}>
            <div>
              <div style={{ fontWeight: 600, fontSize: '1.05rem' }}>{t('settings.darkTheme')}</div>
              <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>{t('settings.darkThemeDesc')}</div>
            </div>
            <label className="switch">
              <input type="checkbox" checked={isDark} onChange={toggleTheme} />
              <span className="slider round"></span>
            </label>
          </div>

          <div className="setting-item" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem 0', borderBottom: '1px solid var(--border-color)' }}>
            <div>
              <div style={{ fontWeight: 600, fontSize: '1.05rem' }}>{t('settings.highContrast')}</div>
              <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>{t('settings.highContrastDesc')}</div>
            </div>
            <label className="switch">
              <input type="checkbox" checked={highContrast} onChange={toggleHighContrast} />
              <span className="slider round"></span>
            </label>
          </div>

          <div className="setting-item" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem 0' }}>
            <div>
              <div style={{ fontWeight: 600, fontSize: '1.05rem' }}>{t('nav.textSize')}</div>
              <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Toggle between normal and large text for better readability</div>
            </div>
            <label className="switch">
              <input type="checkbox" checked={largeText} onChange={toggleLargeText} />
              <span className="slider round"></span>
            </label>
          </div>
        </section>

        {/* Notifications & Reminders */}
        <section className="settings-card" style={{ 
          background: 'var(--bg-card)', 
          padding: '2rem', 
          borderRadius: 'var(--radius-lg)', 
          border: '1px solid var(--border-color)',
          boxShadow: 'var(--shadow-sm)'
        }}>
          <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '1.25rem', marginBottom: '1.5rem', color: 'var(--primary)' }}>
            <FaBell /> {t('settings.notifications')}
          </h3>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontWeight: 600, fontSize: '1.05rem' }}>{t('settings.notificationsDesc')}</div>
              <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Manage your scheduled alerts for voter registration and election day.</div>
            </div>
            <button 
              onClick={openReminders}
              style={{ 
                background: 'var(--primary)', 
                color: 'white', 
                padding: '0.6rem 1.25rem', 
                borderRadius: '8px', 
                border: 'none', 
                fontWeight: 600, 
                cursor: 'pointer',
                transition: 'transform 0.2s',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}
              onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
              onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
            >
              <FaBell /> {t('settings.manageReminders')}
            </button>
          </div>
        </section>

        {/* AI & Voice Assistant */}
        <section className="settings-card" style={{ 
          background: 'var(--bg-card)', 
          padding: '2rem', 
          borderRadius: 'var(--radius-lg)', 
          border: '1px solid var(--border-color)',
          boxShadow: 'var(--shadow-sm)'
        }}>
          <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '1.25rem', marginBottom: '1.5rem', color: 'var(--primary)' }}>
            <FaMicrophone /> {t('settings.aiVoice')}
          </h3>
          
          <div className="setting-item" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem 0', borderBottom: '1px solid var(--border-color)' }}>
            <div>
              <div style={{ fontWeight: 600, fontSize: '1.05rem' }}>{t('settings.explLevel')}</div>
              <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>{t('settings.explLevelDesc')}</div>
            </div>
            <select 
              value={aiLevel} 
              onChange={(e) => setAiLevel(e.target.value)}
              style={{ 
                padding: '0.6rem', 
                borderRadius: '8px', 
                border: '1px solid var(--border-color)', 
                background: 'var(--bg-main)', 
                color: 'var(--text-primary)',
                fontWeight: 500,
                cursor: 'pointer'
              }}
            >
              <option value="beginner">{t('settings.beginner')}</option>
              <option value="intermediate">{t('settings.intermediate')}</option>
              <option value="expert">{t('settings.expert')}</option>
            </select>
          </div>

          <div className="setting-item" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem 0' }}>
            <div>
              <div style={{ fontWeight: 600, fontSize: '1.05rem' }}>{t('settings.autoRead')}</div>
              <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>{t('settings.autoReadDesc')}</div>
            </div>
            <label className="switch">
              <input type="checkbox" checked={autoRead} onChange={() => setAutoRead(!autoRead)} />
              <span className="slider round"></span>
            </label>
          </div>
        </section>

        {/* Privacy & Data */}
        <section className="settings-card" style={{ 
          background: 'var(--bg-card)', 
          padding: '2rem', 
          borderRadius: 'var(--radius-lg)', 
          border: '1px solid var(--border-color)',
          boxShadow: 'var(--shadow-sm)'
        }}>
          <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '1.25rem', marginBottom: '1.5rem', color: 'var(--primary)' }}>
            <FaShieldAlt /> {t('settings.privacy')}
          </h3>
          
          <div className="setting-item" style={{ padding: '1rem 0', borderBottom: '1px solid var(--border-color)' }}>
            <div style={{ fontWeight: 600, fontSize: '1.05rem' }}>{t('settings.voiceData')}</div>
            <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>{t('settings.voiceDataDesc')}</div>
          </div>

          <div style={{ paddingTop: '1.5rem' }}>
            <button 
              onClick={clearAppData}
              style={{ 
                color: '#ef4444', 
                border: '1.5px solid #ef4444', 
                padding: '0.75rem 1.5rem', 
                borderRadius: '10px', 
                fontWeight: 600, 
                background: 'transparent',
                cursor: 'pointer',
                transition: 'all 0.2s',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}
              onMouseOver={(e) => { e.currentTarget.style.background = '#ef4444'; e.currentTarget.style.color = 'white'; }}
              onMouseOut={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#ef4444'; }}
            >
              <FaTrash /> {t('settings.clearData')}
            </button>
          </div>
        </section>

      </div>
      
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .settings-card {
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        .settings-card:hover {
          transform: translateY(-2px);
          box-shadow: var(--shadow-md);
        }
        .switch {
          position: relative;
          display: inline-block;
          width: 50px;
          height: 26px;
        }
        .switch input { opacity: 0; width: 0; height: 0; }
        .slider {
          position: absolute;
          cursor: pointer;
          top: 0; left: 0; right: 0; bottom: 0;
          background-color: #ccc;
          transition: .4s;
        }
        .slider:before {
          position: absolute;
          content: "";
          height: 18px; width: 18px;
          left: 4px; bottom: 4px;
          background-color: white;
          transition: .4s;
        }
        input:checked + .slider { background-color: var(--primary); }
        input:focus + .slider { box-shadow: 0 0 1px var(--primary); }
        input:checked + .slider:before { transform: translateX(24px); }
        .slider.round { border-radius: 34px; }
        .slider.round:before { border-radius: 50%; }
      `}</style>
    </div>
  );
}
