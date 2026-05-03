import { lazy, Suspense, useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { FaHome, FaRobot, FaClipboardList, FaCalendarAlt, FaMapMarkerAlt, FaBook, FaCog, FaUniversalAccess, FaBullhorn, FaGlobe, FaCheckCircle, FaSpinner } from 'react-icons/fa';
import { API_BASE_URL } from './config';
import './App.css';
import { LanguageProvider, useLanguage } from './LanguageContext';
import { requestForToken, onMessageListener } from './firebase-config';

// Lazy loaded components for better performance
const ProcessList = lazy(() => import('./ProcessList'));
const Chatbot = lazy(() => import('./Chatbot'));
const PollingMap = lazy(() => import('./PollingMap'));
const Timeline = lazy(() => import('./Timeline'));
const Resources = lazy(() => import('./Resources'));
const Settings = lazy(() => import('./Settings'));
const PracticeSimulation = lazy(() => import('./PracticeSimulation'));
const RemindersPanel = lazy(() => import('./RemindersPanel'));

const LoadingFallback = () => (
  <div className="loading-fallback" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', minHeight: '200px', color: 'var(--primary)' }}>
    <FaSpinner className="spin" size={40} />
    <p style={{ marginTop: '1rem', fontWeight: 500 }}>Loading...</p>
  </div>
);

const indianLanguages = [
  { code: 'en', name: 'English' },
  { code: 'hi', name: 'Hindi (हिन्दी)' },
  { code: 'bn', name: 'Bengali (বাংলা)' },
  { code: 'te', name: 'Telugu (తెలుగు)' },
  { code: 'mr', name: 'Marathi (मराठी)' },
  { code: 'ta', name: 'Tamil (தமிழ்)' },
  { code: 'ur', name: 'Urdu (اردو)' },
  { code: 'gu', name: 'Gujarati (ગુજરાતી)' },
  { code: 'kn', name: 'Kannada (ಕನ್ನಡ)' },
  { code: 'ml', name: 'Malayalam (മലയാളം)' },
  { code: 'pa', name: 'Punjabi (ਪੰਜਾਬੀ)' },
  { code: 'as', name: 'Assamese (অসমীয়া)' },
  { code: 'brx', name: 'Bodo (बड़ो)' },
  { code: 'doi', name: 'Dogri (डोगरी)' },
  { code: 'ks', name: 'Kashmiri (कॉशुर)' },
  { code: 'kok', name: 'Konkani (कोंकणी)' },
  { code: 'mai', name: 'Maithili (मैथिली)' },
  { code: 'mni', name: 'Manipuri (ꯃꯤꯇꯩꯂꯣꯟ)' },
  { code: 'ne', name: 'Nepali (नेपाली)' },
  { code: 'or', name: 'Odia (ଓଡ଼ିଆ)' },
  { code: 'sa', name: 'Sanskrit (संस्कृतम्)' },
  { code: 'sat', name: 'Santali (ᱥᱟᱱᱛᱟᱲᱤ)' },
  { code: 'sd', name: 'Sindhi (सिन्धी)' }
];

function Sidebar({ isOpen, setIsOpen, highContrast, setHighContrast, largeText, setLargeText }) {
  const location = useLocation();

  const { t } = useLanguage();

  const isActive = (path) => location.pathname === path ? 'active' : '';

  return (
    <aside className={`sidebar ${isOpen ? 'mobile-open' : ''}`} aria-label="Main Navigation">
      <button className="mobile-close-btn" onClick={() => setIsOpen(false)} aria-label="Close menu">✕</button>
      <div className="logo-container">

        <img src="/logo.png" alt="Vote For Nation Logo" />
        <div>
          <h2>Vote For Nation</h2>
          <p>Your Voice. Your Future.</p>
        </div>
      </div>
      <nav className="nav-menu">
        <Link to="/" className={`nav-item ${isActive('/')}`} onClick={() => setIsOpen(false)} aria-current={location.pathname === '/' ? 'page' : undefined}>
          <FaHome aria-hidden="true" /> <span>{t('nav.home')}</span>
        </Link>
        <Link to="/ask-assistant" className={`nav-item ${isActive('/ask-assistant')}`} onClick={() => setIsOpen(false)} aria-current={location.pathname === '/ask-assistant' ? 'page' : undefined}>
          <FaRobot aria-hidden="true" /> <span>{t('nav.askAssistant')}</span>
        </Link>
        <Link to="/process" className={`nav-item ${isActive('/process')}`} onClick={() => setIsOpen(false)} aria-current={location.pathname === '/process' ? 'page' : undefined}>
          <FaClipboardList aria-hidden="true" /> <span>{t('nav.electionProcess')}</span>
        </Link>
        <Link to="/timeline" className={`nav-item ${isActive('/timeline')}`} onClick={() => setIsOpen(false)} aria-current={location.pathname === '/timeline' ? 'page' : undefined}>
          <FaCalendarAlt aria-hidden="true" /> <span>{t('nav.timeline')}</span>
        </Link>
        <Link to="/polling" className={`nav-item ${isActive('/polling')}`} onClick={() => setIsOpen(false)} aria-current={location.pathname === '/polling' ? 'page' : undefined}>
          <FaMapMarkerAlt aria-hidden="true" /> <span>{t('nav.pollingStation')}</span>
        </Link>
        <Link to="/resources" className={`nav-item ${isActive('/resources')}`} onClick={() => setIsOpen(false)} aria-current={location.pathname === '/resources' ? 'page' : undefined}>
          <FaBook aria-hidden="true" /> <span>{t('nav.resources')}</span>
        </Link>
        <Link to="/practice" className={`nav-item ${isActive('/practice')}`} onClick={() => setIsOpen(false)} aria-current={location.pathname === '/practice' ? 'page' : undefined}>
          <FaCheckCircle aria-hidden="true" /> <span>{t('nav.practice')}</span>
        </Link>

        <Link to="/settings" className={`nav-item ${isActive('/settings')}`} onClick={() => setIsOpen(false)}>
          <FaCog /> <span>{t('nav.settings')}</span>
        </Link>
      </nav>


      <div className="accessibility-box">
        <div className="access-icon">
          <FaUniversalAccess size={24} />
        </div>
        <div className="access-text-container" style={{ flex: 1 }}>
          <h4>{t('nav.accessibilityMode')}</h4>
          <p>{t('nav.textSize')} <button className="access-toggle-btn" onClick={() => setLargeText(!largeText)}>{largeText ? 'Large' : 'Medium'}</button></p>
          <p>{t('nav.contrast')} <button className="access-toggle-btn" onClick={() => setHighContrast(!highContrast)}>{highContrast ? 'High' : 'Normal'}</button></p>
        </div>
      </div>
    </aside>
  );
}

function MainApp() {
  const { lang, setLang } = useLanguage();
  const [isRemindersOpen, setIsRemindersOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Global Settings State
  const [isDark, setIsDark] = useState(() => localStorage.getItem('vote_dark') === 'true' || document.body.classList.contains('dark-mode'));
  const [highContrast, setHighContrast] = useState(() => localStorage.getItem('vote_hc') === 'true' || document.body.classList.contains('high-contrast'));
  const [largeText, setLargeText] = useState(() => localStorage.getItem('vote_lt') === 'true' || document.body.classList.contains('large-text'));


  useEffect(() => {
    localStorage.setItem('vote_dark', isDark);
    if (isDark) document.body.classList.add('dark-mode');
    else document.body.classList.remove('dark-mode');
  }, [isDark]);

  useEffect(() => {
    localStorage.setItem('vote_hc', highContrast);
    if (highContrast) document.body.classList.add('high-contrast');
    else document.body.classList.remove('high-contrast');
  }, [highContrast]);

  useEffect(() => {
    localStorage.setItem('vote_lt', largeText);
    if (largeText) document.body.classList.add('large-text');
    else document.body.classList.remove('large-text');
  }, [largeText]);
  const [reminders, setReminders] = useState([]);

  useEffect(() => {
    const fetchReminders = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/reminders`);
        if (response.ok) {
          const data = await response.json();
          setReminders(data);
        }
      } catch (e) {
        console.error("Failed to fetch reminders from backend", e);
      }
    };
    fetchReminders();
  }, []);

  useEffect(() => {
    // 1. Register Service Worker explicitly for background notifications
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/firebase-messaging-sw.js')
          .then((registration) => {
            console.log('✅ Service Worker registered:', registration.scope);
            
            // Ensure SW is active and controlling the page
            if (navigator.serviceWorker.controller) {
               requestForToken(registration).then(token => {
                if (token) {
                  localStorage.setItem('fcm_token', token);
                  fetch(`${API_BASE_URL}/api/reminders/token`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ token })
                  }).then(() => console.log('FCM Token synced with backend'));
                }
              });
            } else {
              // Wait for it to become active
              navigator.serviceWorker.addEventListener('controllerchange', () => {
                window.location.reload(); 
              });
            }
          })
          .catch((err) => {
            console.error('❌ Service Worker registration failed:', err);
          });
      });
    }
  }, []);

  useEffect(() => {
    // Foreground listener
    const unsubscribe = onMessageListener(payload => {
      console.log('Foreground message:', payload);
      if (Notification.permission === 'granted') {
        new Notification(payload.notification.title, { body: payload.notification.body, icon: '/logo.png' });
      } else {
        console.warn('Notification permission not granted');
      }
    });

    return () => {
      if (typeof unsubscribe === 'function') unsubscribe();
    };
  }, []);

  useEffect(() => {
    // Local Check Fallback (Check every 30 seconds)
    const interval = setInterval(() => {
      const now = new Date();
      let changed = false;
      const updatedReminders = reminders.map(r => {
        const rTime = new Date(r.time);
        if (r.enabled && Math.abs(rTime - now) < 30000 && !r.notified) {
           if (Notification.permission === 'granted') {
             new Notification(r.title, { body: "Your election reminder is due!" });
           }
           changed = true;
           return { ...r, notified: true };
        }
        return r;
      });
      if (changed) setReminders(updatedReminders);
    }, 30000);
    return () => clearInterval(interval);
  }, [reminders]);


  const activeCount = reminders.filter(r => r.enabled).length;

  return (
    <Router>
      <div className={`app-container ${isDark ? 'dark-mode' : ''} ${highContrast ? 'high-contrast' : ''} ${largeText ? 'large-text' : ''}`}>
        <a href="#main-content" className="skip-link">Skip to main content</a>
        <Sidebar 
          isOpen={isSidebarOpen} 
          setIsOpen={setIsSidebarOpen} 
          highContrast={highContrast} 
          setHighContrast={setHighContrast}
          largeText={largeText}
          setLargeText={setLargeText}
        />
        {isSidebarOpen && <div className="sidebar-overlay" onClick={() => setIsSidebarOpen(false)}></div>}


        {/* Main Content Area */}
        <main className="main-content" id="main-content">
          <header className="top-header">
            <button className="hamburger-menu" onClick={() => setIsSidebarOpen(true)} aria-label="Open menu">
              ☰
            </button>
            <div className="lang-select" style={{ position: 'relative' }}>

              <FaGlobe style={{ color: 'var(--primary)' }} />
              <select 
                value={lang} 
                onChange={(e) => setLang(e.target.value)}
                aria-label="Select Language"
                className="lang-inner-select"
              >
                {indianLanguages.map(l => (
                  <option key={l.code} value={l.code}>{l.name}</option>
                ))}
              </select>
            </div>
            <div className="notification-icon" onClick={() => setIsRemindersOpen(true)} style={{ cursor: 'pointer' }} role="button" aria-label="Open reminders">
              🔔
              {activeCount > 0 && <span className="badge">{activeCount}</span>}
            </div>
          </header>

          <Suspense fallback={<LoadingFallback />}>
            <RemindersPanel 
              isOpen={isRemindersOpen} 
              onClose={() => setIsRemindersOpen(false)} 
              reminders={reminders}
              setReminders={setReminders}
            />

            <Routes>
              <Route path="/" element={<HomeDashboard />} />
              <Route path="/ask-assistant" element={<div className="page-container" style={{padding:0, border:'none', background:'transparent', boxShadow:'none'}}><Chatbot /></div>} />
              <Route path="/process" element={<div className="page-container"><ProcessList /></div>} />
              <Route path="/polling" element={<div className="page-container"><PollingMap /></div>} />
              <Route path="/timeline" element={<div className="page-container"><Timeline /></div>} />
              <Route path="/resources" element={<div className="page-container"><Resources /></div>} />
              <Route path="/practice" element={<div className="page-container" style={{backgroundColor: 'transparent', boxShadow: 'none'}}><PracticeSimulation /></div>} />
              <Route path="/settings" element={
                <div className="page-container">
                  <Settings 
                    isDark={isDark} 
                    setIsDark={setIsDark}
                    highContrast={highContrast}
                    setHighContrast={setHighContrast}
                    largeText={largeText}
                    setLargeText={setLargeText}
                    openReminders={() => setIsRemindersOpen(true)}
                  />
                </div>
              } />
            </Routes>
          </Suspense>
        </main>
      </div>
    </Router>
  );
}

function HomeDashboard() {
  const { t } = useLanguage();

  return (
    <div className="dashboard-container">
      {/* Hero Section */}
      <div className="hero-section">
        <div className="hero-content">
          <p style={{ fontSize: '1.25rem', color: 'var(--text-primary)', marginBottom: '0.5rem' }}>{t('home.greeting')}</p>
          <h1>{t('home.title')}</h1>
          <p>{t('home.subtitle')}</p>
          <Link to="/ask-assistant">
            <button className="btn-primary ask-assistant-btn">
              <FaRobot /> {t('home.askBtn')}
            </button>
          </Link>
          <p style={{ fontSize: '0.875rem', marginTop: '1rem', color: 'var(--text-secondary)' }}>
            {t('home.typeOrSpeak')}
          </p>
        </div>
        <img src="/hero-illustration.png" alt="Voters Illustration" className="hero-image" />
      </div>

      {/* Quick Access */}
      <div>
        <h2 className="section-title">{t('home.quickAccess')}</h2>
        <div className="quick-access-grid">
          <Link to="/process" className="quick-card card-blue">
            <div className="card-icon"><FaClipboardList /></div>
            <h3>{t('card.processTitle')}</h3>
            <p>{t('card.processDesc')}</p>
            <div className="arrow-icon">➔</div>
          </Link>
          <Link to="/timeline" className="quick-card card-green">
            <div className="card-icon"><FaCalendarAlt /></div>
            <h3>{t('card.datesTitle')}</h3>
            <p>{t('card.datesDesc')}</p>
            <div className="arrow-icon">➔</div>
          </Link>
          <Link to="/polling" className="quick-card card-yellow">
            <div className="card-icon"><FaMapMarkerAlt /></div>
            <h3>{t('card.pollingTitle')}</h3>
            <p>{t('card.pollingDesc')}</p>
            <div className="arrow-icon">➔</div>
          </Link>
          <Link to="/resources" className="quick-card card-purple">
            <div className="card-icon"><FaBook /></div>
            <h3>{t('card.guidelinesTitle')}</h3>
            <p>{t('card.guidelinesDesc')}</p>
            <div className="arrow-icon">➔</div>
          </Link>
        </div>
      </div>

      {/* Banner */}
      <div className="election-banner">
        <div className="banner-left">
          <div className="megaphone-icon"><FaBullhorn /></div>
          <div>
            <div className="banner-title">{t('banner.nextElection')}</div>
            <div className="banner-date">{t('banner.date')}</div>
          </div>
        </div>
        <div className="banner-right">
          <div className="banner-title">
            <FaCalendarAlt style={{marginRight: '0.5rem', color: 'var(--card-purple-text)'}}/> {t('banner.daysLeft')}
          </div>
          <div className="arrow-icon" style={{color: 'var(--card-purple-text)'}}>➔</div>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <MainApp />
    </LanguageProvider>
  );
}
