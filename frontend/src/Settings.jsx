import { useState, useEffect } from 'react';
import { FaMoon, FaSun, FaUniversalAccess, FaMicrophone, FaLanguage, FaShieldAlt, FaPalette } from 'react-icons/fa';
import { useLanguage } from './LanguageContext';

export default function Settings() {
  const { t } = useLanguage();
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [autoRead, setAutoRead] = useState(true);
  const [aiLevel, setAiLevel] = useState('intermediate');
  const [isDark, setIsDark] = useState(document.body.classList.contains('dark-mode'));

  const [isHighContrast, setIsHighContrast] = useState(document.body.classList.contains('high-contrast'));

  const toggleTheme = () => {
    const newIsDark = !isDark;
    if (newIsDark) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
    setIsDark(newIsDark);
  };

  const toggleHighContrast = () => {
    const newIsHighContrast = !isHighContrast;
    if (newIsHighContrast) {
      document.body.classList.add('high-contrast');
    } else {
      document.body.classList.remove('high-contrast');
    }
    setIsHighContrast(newIsHighContrast);
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.75rem', margin: 0 }}>{t('settings.title')}</h2>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        
        {/* Appearance & Accessibility */}
        <div style={{ background: 'var(--bg-card)', padding: '1.5rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
          <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1.1rem', marginBottom: '1.25rem', color: 'var(--text-primary)' }}>
            <FaPalette /> {t('settings.appearance')}
          </h3>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '1rem', borderBottom: '1px solid var(--border-color)' }}>
            <div>
              <div style={{ fontWeight: 500 }}>{t('settings.darkTheme')}</div>
              <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>{t('settings.darkThemeDesc')}</div>
            </div>
            <label className="switch">
              <input type="checkbox" checked={isDark} onChange={toggleTheme} />
              <span className="slider"></span>
            </label>

          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '1rem' }}>
            <div>
              <div style={{ fontWeight: 500 }}>{t('settings.highContrast')}</div>
              <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>{t('settings.highContrastDesc')}</div>
            </div>
            <label className="switch">
              <input type="checkbox" checked={isHighContrast} onChange={toggleHighContrast} />
              <span className="slider"></span>
            </label>

          </div>
        </div>


        {/* AI & Voice Settings */}
        <div style={{ background: 'var(--bg-card)', padding: '1.5rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
          <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1.1rem', marginBottom: '1.25rem', color: 'var(--text-primary)' }}>
            <FaMicrophone /> {t('settings.aiVoice')}
          </h3>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '1rem', borderBottom: '1px solid var(--border-color)' }}>
            <div>
              <div style={{ fontWeight: 500 }}>{t('settings.explLevel')}</div>
              <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>{t('settings.explLevelDesc')}</div>
            </div>
            <select 
              value={aiLevel} 
              onChange={(e) => setAiLevel(e.target.value)}
              style={{ padding: '0.5rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-main)', color: 'var(--text-primary)' }}
            >
              <option value="beginner">{t('settings.beginner')}</option>
              <option value="intermediate">{t('settings.intermediate')}</option>
              <option value="expert">{t('settings.expert')}</option>
            </select>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '1rem' }}>
            <div>
              <div style={{ fontWeight: 500 }}>{t('settings.autoRead')}</div>
              <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>{t('settings.autoReadDesc')}</div>
            </div>
            <label className="switch">
              <input type="checkbox" checked={autoRead} onChange={() => setAutoRead(!autoRead)} />
              <span className="slider"></span>
            </label>

          </div>
        </div>

        {/* Privacy & Security */}
        <div style={{ background: 'var(--bg-card)', padding: '1.5rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
          <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1.1rem', marginBottom: '1.25rem', color: 'var(--text-primary)' }}>
            <FaShieldAlt /> {t('settings.privacy')}
          </h3>
          
          <div style={{ paddingBottom: '1rem', borderBottom: '1px solid var(--border-color)' }}>
            <div style={{ fontWeight: 500 }}>{t('settings.voiceData')}</div>
            <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>{t('settings.voiceDataDesc')}</div>
          </div>

          <div style={{ paddingTop: '1rem' }}>
            <button style={{ color: '#ef4444', border: '1px solid #ef4444', padding: '0.5rem 1rem', borderRadius: '8px', fontWeight: 500 }}>
              {t('settings.clearData')}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
